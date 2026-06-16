#!/usr/bin/env node

/**
 * Server analyzer benchmark on a large dataset.
 * Only evaluates the final verdict from analyzeImageBuffer() over thousands of images.
 * Skips the 500 individual signal methods which are already covered by benchmark-methods.mjs.
 */

import fs from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks";

import { analyzeImageBuffer } from "../src/lib/serverAnalyzer.ts";

const ROOT_DIR = path.resolve(import.meta.dirname, "..");
const DEBUG_DIR = path.join(ROOT_DIR, "debug");
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, "-");
const SUMMARY_PATH = path.join(DEBUG_DIR, `server-benchmark-${TIMESTAMP}.json`);
const ERRORS_PATH = path.join(DEBUG_DIR, `server-benchmark-${TIMESTAMP}-errors.json`);

const SAMPLES_PER_CLASS = Number.parseInt(process.env.SERVER_SAMPLES_PER_CLASS ?? "1000", 10);
const PARALLELISM = Number.parseInt(process.env.SERVER_PARALLELISM ?? "8", 10);

fs.mkdirSync(DEBUG_DIR, { recursive: true });

function inferLabel(filePath) {
    const normalized = filePath.replace(/\\/g, "/").toLowerCase();
    const base = path.basename(normalized);
    if (normalized.includes("/ai/") || /^ai[_-]/.test(base)) return "ai";
    if (normalized.includes("/real/") || /^real[_-]/.test(base)) return "real";
    return null;
}

function walk(dir, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(fullPath, out);
        else if (/\.(jpg|jpeg|png|webp|bmp)$/i.test(entry.name)) out.push(fullPath);
    }
    return out;
}

function neutralName(index, ext) {
    return `sample-${String(index + 1).padStart(5, "0")}${ext}`;
}

async function processInBatches(items, parallelism, processor) {
    const results = new Array(items.length);
    let nextIndex = 0;
    let completed = 0;
    const startedAt = performance.now();

    async function worker() {
        while (true) {
            const idx = nextIndex++;
            if (idx >= items.length) return;
            try {
                results[idx] = await processor(items[idx], idx);
            } catch (error) {
                results[idx] = { error: error?.message ?? String(error), item: items[idx] };
            }
            completed++;
            if (completed % 100 === 0 || completed === items.length) {
                const elapsedSec = (performance.now() - startedAt) / 1000;
                const rate = completed / elapsedSec;
                const remaining = (items.length - completed) / rate;
                console.log(
                    `  progress: ${completed}/${items.length} (${(completed / items.length * 100).toFixed(1)}%) `
                    + `${rate.toFixed(1)}/s, ETA ${remaining.toFixed(0)}s`,
                );
            }
        }
    }

    await Promise.all(Array.from({ length: parallelism }, worker));
    return results;
}

async function main() {
    console.log(`Starting server analyzer benchmark (per-class target: ${SAMPLES_PER_CLASS}, parallelism: ${PARALLELISM})...`);

    const candidates = [];
    for (const root of [path.join(ROOT_DIR, "test_images"), path.join(ROOT_DIR, "public", "benchmark")]) {
        for (const file of walk(root)) {
            const label = inferLabel(file);
            if (!label) continue;
            candidates.push({ filePath: file, label, rel: path.relative(ROOT_DIR, file).replace(/\\/g, "/") });
        }
    }

    const grouped = { ai: [], real: [] };
    for (const candidate of candidates) grouped[candidate.label].push(candidate);
    for (const key of Object.keys(grouped)) grouped[key].sort((a, b) => a.rel.localeCompare(b.rel));

    const selected = [
        ...grouped.real.slice(0, SAMPLES_PER_CLASS),
        ...grouped.ai.slice(0, SAMPLES_PER_CLASS),
    ];

    console.log(`Discovered ${candidates.length} labeled images (ai=${grouped.ai.length}, real=${grouped.real.length}); selected ${selected.length}.`);

    if (selected.length === 0) {
        console.error("No labeled images found. Aborting.");
        process.exit(1);
    }

    const startedAt = performance.now();
    const results = await processInBatches(selected, PARALLELISM, async (sample, idx) => {
        const buffer = fs.readFileSync(sample.filePath);
        const ext = path.extname(sample.filePath).toLowerCase();
        const analysis = await analyzeImageBuffer(buffer, neutralName(idx, ext));
        return {
            label: sample.label,
            rel: sample.rel,
            verdict: analysis.verdict,
            aiScore: analysis.aiScore,
            confidence: analysis.confidence,
            signals: Object.fromEntries(analysis.signals.map((signal) => [signal.name, signal.score])),
            processingMs: analysis.processingTimeMs,
        };
    });

    const totalMs = performance.now() - startedAt;
    const errors = results.filter((row) => row && row.error);
    const ok = results.filter((row) => row && !row.error);
    let strictCorrect = 0;
    let classified = 0;
    let classifiedCorrect = 0;
    let truePositive = 0;
    let falsePositive = 0;
    let falseNegative = 0;
    const incorrect = [];
    for (const row of ok) {
        const expected = row.label;
        const predicted = row.verdict;
        if (predicted === expected) strictCorrect++;
        if (predicted !== "uncertain") {
            classified++;
            if (predicted === expected) classifiedCorrect++;
        }
        if (predicted === "ai" && expected === "ai") truePositive++;
        if (predicted === "ai" && expected === "real") falsePositive++;
        if (predicted === "real" && expected === "ai") falseNegative++;
        if (predicted !== expected) incorrect.push(row);
    }

    const precision = truePositive + falsePositive > 0 ? truePositive / (truePositive + falsePositive) : null;
    const recall = truePositive + falseNegative > 0 ? truePositive / (truePositive + falseNegative) : null;
    const f1 = precision !== null && recall !== null && precision + recall > 0
        ? (2 * precision * recall) / (precision + recall)
        : null;

    const summary = {
        generatedAt: new Date().toISOString(),
        config: { samplesPerClass: SAMPLES_PER_CLASS, parallelism: PARALLELISM },
        evaluated: ok.length,
        errored: errors.length,
        strictAccuracy: ok.length ? strictCorrect / ok.length : 0,
        classified,
        classifiedAccuracy: classified ? classifiedCorrect / classified : 0,
        coverage: ok.length ? classified / ok.length : 0,
        precision,
        recall,
        f1,
        avgProcessingMs: ok.length ? ok.reduce((sum, row) => sum + row.processingMs, 0) / ok.length : 0,
        totalElapsedMs: totalMs,
        incorrectCount: incorrect.length,
        sampleIncorrect: incorrect.slice(0, 30),
    };

    fs.writeFileSync(SUMMARY_PATH, JSON.stringify(summary, null, 2), "utf8");
    if (errors.length) fs.writeFileSync(ERRORS_PATH, JSON.stringify(errors, null, 2), "utf8");

    console.log("");
    console.log("=== Summary ===");
    console.log(`Evaluated: ${ok.length} (errors: ${errors.length})`);
    console.log(`Strict accuracy: ${(summary.strictAccuracy * 100).toFixed(2)}%`);
    console.log(`Coverage: ${(summary.coverage * 100).toFixed(2)}%`);
    console.log(`Classified accuracy: ${(summary.classifiedAccuracy * 100).toFixed(2)}%`);
    if (precision !== null) console.log(`Precision: ${(precision * 100).toFixed(2)}%`);
    if (recall !== null) console.log(`Recall: ${(recall * 100).toFixed(2)}%`);
    if (f1 !== null) console.log(`F1: ${(f1 * 100).toFixed(2)}%`);
    console.log(`Avg processing: ${summary.avgProcessingMs.toFixed(1)} ms/image`);
    console.log(`Total elapsed: ${(totalMs / 1000).toFixed(1)} s`);
    console.log(`Mistakes: ${incorrect.length}`);
    console.log(`Summary written to ${path.relative(ROOT_DIR, SUMMARY_PATH)}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
