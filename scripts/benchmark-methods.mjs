#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";
import { pathToFileURL } from "node:url";
import { createCanvas, loadImage } from "canvas";

import { analyzeImageBuffer } from "../src/lib/serverAnalyzer.ts";

const ROOT_DIR = path.resolve(import.meta.dirname, "..");
const README_PATH = path.join(ROOT_DIR, "README.md");
const DEBUG_DIR = path.join(ROOT_DIR, "debug");
const REPORT_START = "<!-- METHOD_ACCURACY_REPORT:START -->";
const REPORT_END = "<!-- METHOD_ACCURACY_REPORT:END -->";
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".bmp"]);
const IMAGE_SAMPLES_PER_CLASS = Number.parseInt(process.env.IMAGE_SAMPLES_PER_CLASS ?? "60", 10);
const IMAGE_MAX_DIM = Number.parseInt(process.env.IMAGE_MAX_DIM ?? "320", 10);
const WRITE_README = (process.env.BENCHMARK_WRITE_README ?? "1") !== "0";
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, "-");
const LOG_PATH = path.join(DEBUG_DIR, `method-benchmark-${TIMESTAMP}.log`);
const SUMMARY_PATH = path.join(DEBUG_DIR, `method-benchmark-${TIMESTAMP}.json`);

fs.mkdirSync(DEBUG_DIR, { recursive: true });

function log(message) {
    const line = `[${new Date().toISOString()}] ${message}`;
    fs.appendFileSync(LOG_PATH, `${line}\n`, "utf8");
    console.log(message);
}

function stableHash(value) {
    return createHash("sha1").update(value).digest("hex");
}

function average(values) {
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : NaN;
}

function formatPercent(value) {
    return Number.isFinite(value) ? `${(value * 100).toFixed(1)}%` : "n/a";
}

function formatNumber(value, digits = 1) {
    return Number.isFinite(value) ? value.toFixed(digits) : "n/a";
}

function escapeMarkdown(value) {
    return String(value ?? "")
        .replace(/\|/g, "\\|")
        .replace(/\r?\n/g, " ")
        .trim();
}

function walkFiles(dir) {
    if (!fs.existsSync(dir)) {
        return [];
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...walkFiles(fullPath));
            continue;
        }
        files.push(fullPath);
    }

    return files;
}

function inferLabel(filePath) {
    const normalized = filePath.replace(/\\/g, "/").toLowerCase();
    const baseName = path.basename(normalized);

    if (normalized.includes("/ai/") || /^ai[_-]/.test(baseName)) {
        return "ai";
    }

    if (normalized.includes("/real/") || /^real[_-]/.test(baseName)) {
        return "real";
    }

    return null;
}

function collectImageCandidates() {
    const candidateRoots = [
        path.join(ROOT_DIR, "test_images"),
        path.join(ROOT_DIR, "public", "benchmark"),
    ];

    const candidates = [];

    for (const root of candidateRoots) {
        for (const filePath of walkFiles(root)) {
            const extension = path.extname(filePath).toLowerCase();
            if (!IMAGE_EXTENSIONS.has(extension)) {
                continue;
            }

            const label = inferLabel(filePath);
            if (!label) {
                continue;
            }

            const relativePath = path.relative(ROOT_DIR, filePath).replace(/\\/g, "/");
            const priority = relativePath.startsWith("test_images/") ? "0" : "1";
            candidates.push({
                filePath,
                relativePath,
                label,
                sortKey: `${priority}-${stableHash(relativePath)}`,
            });
        }
    }

    return candidates;
}

function sampleBalancedImages(candidates, perClass) {
    const grouped = { ai: [], real: [] };
    for (const candidate of candidates) {
        grouped[candidate.label].push(candidate);
    }

    for (const label of Object.keys(grouped)) {
        grouped[label].sort((left, right) => left.sortKey.localeCompare(right.sortKey));
    }

    const ai = grouped.ai.slice(0, perClass);
    const real = grouped.real.slice(0, perClass);
    return [...ai, ...real];
}

async function loadImageSample(candidate, index) {
    const image = await loadImage(candidate.filePath);

    let width = image.width;
    let height = image.height;
    const scale = IMAGE_MAX_DIM / Math.max(width, height);
    if (scale < 1) {
        width = Math.max(1, Math.round(width * scale));
        height = Math.max(1, Math.round(height * scale));
    }

    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, width, height);
    const imageData = context.getImageData(0, 0, width, height);
    const extension = path.extname(candidate.filePath).toLowerCase() || ".jpg";

    return {
        id: `${candidate.label}-${String(index + 1).padStart(4, "0")}`,
        label: candidate.label,
        relativePath: candidate.relativePath,
        originalFileName: path.basename(candidate.filePath),
        neutralFileName: `sample-${String(index + 1).padStart(4, "0")}${extension}`,
        filePath: candidate.filePath,
        width,
        height,
        pixels: new Uint8ClampedArray(imageData.data),
    };
}

async function loadImageDataset() {
    const candidates = collectImageCandidates();
    const selected = sampleBalancedImages(candidates, IMAGE_SAMPLES_PER_CLASS);

    log(`Discovered ${candidates.length} labeled local images; selected ${selected.length} samples (${IMAGE_SAMPLES_PER_CLASS} per class target).`);

    const samples = [];
    for (let index = 0; index < selected.length; index += 1) {
        try {
            samples.push(await loadImageSample(selected[index], index));
        } catch (error) {
            log(`Skipping unreadable image ${selected[index].relativePath}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    return samples;
}

function buildHumanTextSamples() {
    const openings = [
        "I left the apartment early because the plumber said he'd only be in our block for one hour.",
        "Last Tuesday I took the slow bus across town after my bike chain snapped near the market.",
        "My sister called while I was still packing lunch, so the soup ended up too salty and I noticed it only after reheating it at work.",
        "We finally cleaned the storeroom behind the clinic, which turned out to be harder than anyone admitted in the meeting.",
        "The rain started right after I had hung every sheet on the line, and I laughed because it felt painfully predictable.",
        "I spent most of Saturday fixing a loose cabinet door and only later realized the hinge had been installed upside down years ago.",
        "At the train station an older man asked whether platform three had changed, and for a minute all of us checked the wrong screen.",
        "Our team dinner ran late because the owner kept bringing out dishes we hadn't ordered, but nobody wanted to interrupt her.",
        "I rewrote the note to the landlord three times before sending it because I didn't want it to sound more dramatic than the leak actually was.",
        "By the time the mechanic found the tiny nail in the tire, I had already convinced myself the whole wheel had to be replaced.",
        "The first draft of the workshop plan looked tidy, but the real problem was that it ignored how often people arrive halfway through the first session.",
        "I kept a paper list in my pocket all week because my phone battery has been dying before lunchtime again.",
    ];

    const middles = [
        "What stuck with me was not the inconvenience itself, but the small chain of adjustments everyone had to make without saying much about it.",
        "There was a faint smell of wet cardboard in the hallway, the sort of detail that makes a place feel lived in rather than designed.",
        "I wrote down the exact numbers in a notebook, crossed two of them out, then added a question mark because I no longer trusted my own memory.",
        "Nobody used polished language; people interrupted each other, doubled back, and filled gaps with specifics like times, prices, or half-remembered names.",
        "The conversation drifted from the main topic to side issues and then snapped back when someone remembered the original reason we were there.",
        "A few details contradicted one another, which honestly made the account feel more believable than a perfect summary ever would.",
        "I noticed how often we relied on gestures, shorthand, and local references that would make no sense to anyone outside the room.",
        "Even the final decision felt provisional, the kind of agreement people make when they know reality will force a few revisions.",
        "Some sentences in my notes are fragments because I was writing while standing up and trying not to miss what happened next.",
        "The useful part was a concrete example someone offered offhand, not the neat explanation we tried to assemble afterward.",
        "There were pauses, corrections, and one oddly specific complaint about the coffee machine that somehow clarified the whole mood.",
        "When I reread it later, the paragraph sounded uneven, but the unevenness matched how the afternoon actually unfolded.",
    ];

    const endings = [
        "By evening I had a workable plan, though it was messier and more conditional than the version I would have written for a report.",
        "I came home tired, still unsure about one detail, yet certain about the part that mattered most in practice.",
        "Nothing about it felt optimized, but that was exactly why the story seemed true when I told it back to myself.",
        "The final note in my notebook is just a reminder to call again on Thursday if the patch still holds.",
        "I wouldn't describe the day as productive, but it did leave me with a clearer sense of what was broken and what could wait.",
        "If I polish the wording too much, it starts sounding unlike the people involved, so I left some of the rough edges in place.",
        "That is probably why the memory stayed with me: it was specific, slightly awkward, and impossible to summarize cleanly.",
        "The result was useful enough, even if the route there was full of detours, second guesses, and one unnecessary argument about keys.",
        "In retrospect the details matter more than the lesson, which is usually a sign that the account comes from actual experience.",
        "I saved the receipt, circled the date, and promised myself not to rely on guesswork the next time the same issue shows up.",
        "The written version still misses the tone of voice people used, but it keeps the concrete facts that made the exchange memorable.",
        "I ended the page with two arrows and a grocery reminder, because real notes rarely stop where a formal conclusion would.",
    ];

    const samples = [];
    for (let index = 0; index < 24; index += 1) {
        samples.push({
            id: `human-${String(index + 1).padStart(2, "0")}`,
            label: "real",
            text: `${openings[index % openings.length]} ${middles[(index * 3) % middles.length]} ${endings[(index * 5) % endings.length]}`,
        });
    }
    return samples;
}

function buildAiTextSamples() {
    const topics = [
        "renewable energy planning",
        "remote team productivity",
        "customer support optimization",
        "healthy workplace culture",
        "digital marketing strategy",
        "personal finance habits",
        "urban mobility innovation",
        "cybersecurity awareness",
        "lifelong learning systems",
        "small business resilience",
        "project management discipline",
        "sustainable supply chains",
    ];

    const openings = [
        "In today's rapidly evolving landscape, {topic} has become an essential priority for organizations and individuals alike.",
        "As expectations continue to rise, {topic} offers a valuable framework for achieving durable and measurable progress.",
        "A thoughtful approach to {topic} can help stakeholders align goals, reduce friction, and unlock long-term value.",
        "Because modern environments are increasingly complex, {topic} should be addressed through a structured and scalable strategy.",
    ];

    const bodies = [
        "First, it is important to establish clear objectives, define relevant metrics, and create a repeatable process that supports consistent execution.",
        "Second, leaders should encourage collaboration, leverage data-driven insights, and maintain flexibility so that improvements can be sustained over time.",
        "Third, successful implementation depends on communication, accountability, and an ongoing commitment to refinement across every stage of the workflow.",
        "In addition, organizations benefit when they combine best practices, practical training, and continuous review in order to maximize outcomes.",
        "When these elements are integrated effectively, teams are better positioned to improve efficiency, strengthen confidence, and adapt to changing conditions.",
        "By focusing on alignment, visibility, and iterative learning, decision-makers can transform complexity into a manageable and strategic advantage.",
    ];

    const conclusions = [
        "Ultimately, {topic} is most effective when it is treated not as a one-time initiative, but as a continuous cycle of assessment, execution, and optimization.",
        "In conclusion, a balanced investment in planning, measurement, and communication allows {topic} to generate reliable benefits at scale.",
        "Taken together, these practices demonstrate that {topic} can serve as a practical foundation for resilience, performance, and sustainable growth.",
        "For this reason, adopting a comprehensive perspective on {topic} remains one of the most actionable steps for future-ready organizations.",
    ];

    const samples = [];
    for (let index = 0; index < 24; index += 1) {
        const topic = topics[index % topics.length];
        const opening = openings[index % openings.length].replaceAll("{topic}", topic);
        const bodyOne = bodies[(index * 2) % bodies.length];
        const bodyTwo = bodies[(index * 2 + 1) % bodies.length];
        const conclusion = conclusions[index % conclusions.length].replaceAll("{topic}", topic);
        samples.push({
            id: `ai-text-${String(index + 1).padStart(2, "0")}`,
            label: "ai",
            text: `${opening} ${bodyOne} ${bodyTwo} ${conclusion}`,
        });
    }
    return samples;
}

function buildTextDataset() {
    return [...buildHumanTextSamples(), ...buildAiTextSamples()];
}

async function discoverMethods(mediaType) {
    const directory = path.join(ROOT_DIR, "src", "lib", "methods", mediaType);
    const files = fs.readdirSync(directory)
        .filter((fileName) => fileName.endsWith(".ts"))
        .sort((left, right) => left.localeCompare(right));

    const methods = [];

    for (const fileName of files) {
        const modulePath = path.join(directory, fileName);
        const relativeFile = path.relative(ROOT_DIR, modulePath).replace(/\\/g, "/");
        const moduleId = `${mediaType}/${path.basename(fileName, ".ts")}`;

        try {
            const imported = await import(pathToFileURL(modulePath).href);
            const exports = Object.entries(imported)
                .filter(([exportName, value]) => exportName.startsWith("analyze") && typeof value === "function");

            if (!exports.length) {
                methods.push({
                    id: moduleId,
                    mediaType,
                    file: relativeFile,
                    exportName: "n/a",
                    fn: null,
                    status: "no_export",
                    importError: "No analyze* export found",
                });
                continue;
            }

            for (const [exportName, fn] of exports) {
                const suffix = exports.length > 1 ? `#${exportName}` : "";
                methods.push({
                    id: `${moduleId}${suffix}`,
                    mediaType,
                    file: relativeFile,
                    exportName,
                    fn,
                    status: "ready",
                    importError: null,
                });
            }
        } catch (error) {
            methods.push({
                id: moduleId,
                mediaType,
                file: relativeFile,
                exportName: "import_failed",
                fn: null,
                status: "import_error",
                importError: error instanceof Error ? error.message : String(error),
            });
        }
    }

    return methods;
}

function createEmptyStats() {
    return {
        evaluated: 0,
        classified: 0,
        correct: 0,
        classifiedCorrect: 0,
        uncertain: 0,
        errors: 0,
        aiTp: 0,
        aiFp: 0,
        aiFn: 0,
        aiScores: [],
        realScores: [],
        durations: [],
        firstError: null,
        displayName: null,
    };
}

function updateStats(stats, sample, result, durationMs) {
    stats.evaluated += 1;
    stats.durations.push(durationMs);
    stats.displayName ??= result?.name ?? null;

    if (!result || typeof result.score !== "number") {
        stats.errors += 1;
        stats.firstError ??= "Invalid AnalysisMethod result";
        return;
    }

    if (sample.label === "ai") {
        stats.aiScores.push(result.score);
    } else {
        stats.realScores.push(result.score);
    }

    let predicted = "uncertain";
    if (result.score > 50) {
        predicted = "ai";
    } else if (result.score < 50) {
        predicted = "real";
    }

    if (predicted === "uncertain") {
        stats.uncertain += 1;
    } else {
        stats.classified += 1;
        if (predicted === sample.label) {
            stats.classifiedCorrect += 1;
        }
    }

    if (predicted === sample.label) {
        stats.correct += 1;
    }

    if (sample.label === "ai") {
        if (predicted === "ai") {
            stats.aiTp += 1;
        } else {
            stats.aiFn += 1;
        }
    } else if (predicted === "ai") {
        stats.aiFp += 1;
    }
}

function finalizeStats(method, stats, sampleCount, corpusLabel) {
    const precisionDenominator = stats.aiTp + stats.aiFp;
    const recallDenominator = stats.aiTp + stats.aiFn;
    const precision = precisionDenominator > 0 ? stats.aiTp / precisionDenominator : NaN;
    const recall = recallDenominator > 0 ? stats.aiTp / recallDenominator : NaN;
    const f1 = Number.isFinite(precision) && Number.isFinite(recall) && (precision + recall) > 0
        ? (2 * precision * recall) / (precision + recall)
        : NaN;
    const avgAiScore = average(stats.aiScores);
    const avgRealScore = average(stats.realScores);

    return {
        id: method.id,
        mediaType: method.mediaType,
        file: method.file,
        exportName: method.exportName,
        name: stats.displayName ?? method.exportName,
        status: method.status === "ready" && stats.errors === 0
            ? "ok"
            : method.status === "ready" && stats.errors > 0
                ? "runtime_errors"
                : method.status,
        importError: method.importError,
        firstError: stats.firstError,
        corpus: corpusLabel,
        samples: sampleCount,
        evaluated: stats.evaluated,
        classified: stats.classified,
        uncertain: stats.uncertain,
        errors: stats.errors,
        strictAccuracy: stats.evaluated > 0 ? stats.correct / stats.evaluated : NaN,
        classifiedAccuracy: stats.classified > 0 ? stats.classifiedCorrect / stats.classified : NaN,
        coverage: stats.evaluated > 0 ? stats.classified / stats.evaluated : NaN,
        precision,
        recall,
        f1,
        avgAiScore,
        avgRealScore,
        scoreGap: Number.isFinite(avgAiScore) && Number.isFinite(avgRealScore) ? avgAiScore - avgRealScore : NaN,
        avgMs: average(stats.durations),
    };
}

async function benchmarkMethods(methods, samples, invoke, corpusLabel) {
    const results = [];

    for (const method of methods) {
        if (method.status !== "ready" || typeof method.fn !== "function") {
            results.push({
                id: method.id,
                mediaType: method.mediaType,
                file: method.file,
                exportName: method.exportName,
                name: method.exportName,
                status: method.status,
                importError: method.importError,
                firstError: method.importError,
                corpus: corpusLabel,
                samples: samples.length,
                evaluated: 0,
                classified: 0,
                uncertain: 0,
                errors: samples.length,
                strictAccuracy: NaN,
                classifiedAccuracy: NaN,
                coverage: NaN,
                precision: NaN,
                recall: NaN,
                f1: NaN,
                avgAiScore: NaN,
                avgRealScore: NaN,
                scoreGap: NaN,
                avgMs: NaN,
            });
            continue;
        }

        log(`Benchmarking ${method.id} on ${samples.length} samples...`);
        const stats = createEmptyStats();

        for (const sample of samples) {
            const started = performance.now();
            try {
                const result = await invoke(method.fn, sample);
                updateStats(stats, sample, result, performance.now() - started);
            } catch (error) {
                stats.errors += 1;
                stats.firstError ??= error instanceof Error ? error.message : String(error);
                stats.durations.push(performance.now() - started);
            }
        }

        results.push(finalizeStats(method, stats, samples.length, corpusLabel));
    }

    return results;
}

function updateBinaryStats(stats, label, predicted, score, durationMs) {
    stats.evaluated += 1;
    stats.durations.push(durationMs);

    if (label === "ai") {
        stats.aiScores.push(score);
    } else {
        stats.realScores.push(score);
    }

    if (predicted === "uncertain") {
        stats.uncertain += 1;
    } else {
        stats.classified += 1;
        if (predicted === label) {
            stats.classifiedCorrect += 1;
        }
    }

    if (predicted === label) {
        stats.correct += 1;
    }

    if (label === "ai") {
        if (predicted === "ai") {
            stats.aiTp += 1;
        } else {
            stats.aiFn += 1;
        }
    } else if (predicted === "ai") {
        stats.aiFp += 1;
    }
}

async function benchmarkServerAnalyzer(samples) {
    log(`Benchmarking server analyzer on ${samples.length} images with neutral file names...`);

    const verdictStats = createEmptyStats();
    verdictStats.displayName = "Server Analyzer Verdict";

    const signalStats = new Map();

    for (const sample of samples) {
        const buffer = fs.readFileSync(sample.filePath);
        const started = performance.now();
        let result;

        try {
            result = await analyzeImageBuffer(buffer, sample.neutralFileName);
        } catch (error) {
            verdictStats.errors += 1;
            verdictStats.firstError ??= error instanceof Error ? error.message : String(error);
            continue;
        }

        const durationMs = performance.now() - started;
        updateBinaryStats(verdictStats, sample.label, result.verdict, result.aiScore, durationMs);

        for (const signal of result.signals) {
            if (!signalStats.has(signal.name)) {
                const stats = createEmptyStats();
                stats.displayName = signal.name;
                signalStats.set(signal.name, stats);
            }
            const predicted = signal.score > 50 ? "ai" : signal.score < 50 ? "real" : "uncertain";
            updateBinaryStats(signalStats.get(signal.name), sample.label, predicted, signal.score, durationMs);
        }
    }

    const verdictResult = finalizeStats({
        id: "server/verdict",
        mediaType: "server",
        file: "src/lib/serverAnalyzer.ts",
        exportName: "analyzeImageBuffer",
        status: "ready",
        importError: null,
    }, verdictStats, samples.length, "image-neutral-filename");

    const signalResults = [...signalStats.entries()]
        .map(([name, stats]) => finalizeStats({
            id: `server/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
            mediaType: "server",
            file: "src/lib/serverAnalyzer.ts",
            exportName: name,
            status: "ready",
            importError: null,
        }, stats, samples.length, "image-neutral-filename"))
        .sort((left, right) => left.name.localeCompare(right.name));

    return { verdictResult, signalResults };
}

function renderTable(results) {
    const header = "| Method | ID | Strict Acc | Classified Acc | Coverage | Score Gap | Errors | Avg ms | Status |";
    const separator = "|---|---|---:|---:|---:|---:|---:|---:|---|";
    const rows = results.map((result) => {
        const statusNote = result.firstError
            ? `${result.status}: ${result.firstError.slice(0, 80)}`
            : result.status;
        return [
            escapeMarkdown(result.name),
            `\`${escapeMarkdown(result.id)}\``,
            formatPercent(result.strictAccuracy),
            formatPercent(result.classifiedAccuracy),
            formatPercent(result.coverage),
            formatNumber(result.scoreGap),
            String(result.errors),
            formatNumber(result.avgMs),
            escapeMarkdown(statusNote),
        ].join(" | ");
    }).map((row) => `| ${row} |`);

    return [header, separator, ...rows].join("\n");
}

function sortResults(results) {
    return [...results].sort((left, right) => {
        const leftScore = Number.isFinite(left.strictAccuracy) ? left.strictAccuracy : -1;
        const rightScore = Number.isFinite(right.strictAccuracy) ? right.strictAccuracy : -1;
        if (rightScore !== leftScore) {
            return rightScore - leftScore;
        }

        const leftCoverage = Number.isFinite(left.coverage) ? left.coverage : -1;
        const rightCoverage = Number.isFinite(right.coverage) ? right.coverage : -1;
        if (rightCoverage !== leftCoverage) {
            return rightCoverage - leftCoverage;
        }

        return left.id.localeCompare(right.id);
    });
}

function generateMarkdownReport(report) {
    const imageResults = sortResults(report.imageResults);
    const videoResults = sortResults(report.videoResults);
    const textResults = sortResults(report.textResults);
    const serverSignals = sortResults(report.server.signalResults);

    return [
        "## Method Accuracy Benchmark",
        "",
        `Generated on **${new Date().toISOString()}** by \`npm run benchmark:methods\`.`,
        "",
        "### Benchmark Rules",
        "",
        "- `strict accuracy`: correct / total evaluated, and `score = 50` counts as incorrect because the method stayed uncertain.",
        "- `classified accuracy`: correct / classified, excluding `score = 50` outputs.",
        "- `coverage`: classified / evaluated. Higher coverage means the method avoided the neutral `50` score more often.",
        `- Image and video-frame benchmarks use a balanced local dataset of **${report.imageDataset.realCount} real** + **${report.imageDataset.aiCount} AI** images, resized to max **${IMAGE_MAX_DIM}px** for repeatability.`,
        "- Video methods are measured as **single-frame proxy accuracy** because the repository currently has no labeled local video dataset.",
        "- Text methods are measured on a **synthetic local corpus** of human-like vs AI-like paragraphs because the repository currently has no labeled local text corpus.",
        "- Server-side API benchmarking uses **neutral file names** (`sample-0001.jpg`) to avoid filename label leakage inside `Metadata Analysis`.",
        "",
        "### Coverage Summary",
        "",
        "| Group | Methods | Corpus | Notes |",
        "|---|---:|---|---|",
        `| Image runtime methods | ${imageResults.length} | balanced local image set | direct pixel benchmark |`,
        `| Video runtime methods | ${videoResults.length} | balanced local image set | frame proxy only, no temporal ground truth |`,
        `| Text runtime methods | ${textResults.length} | synthetic balanced text set | provisional accuracy only |`,
        `| Server API signals | ${serverSignals.length + 1} | balanced local image set | includes final verdict + internal signals |`,
        "",
        "### Top-Level Findings",
        "",
        `- Best image method strict accuracy: **${escapeMarkdown(imageResults[0]?.name ?? "n/a")}** at **${formatPercent(imageResults[0]?.strictAccuracy)}**.`,
        `- Best video frame-proxy method strict accuracy: **${escapeMarkdown(videoResults[0]?.name ?? "n/a")}** at **${formatPercent(videoResults[0]?.strictAccuracy)}**.`,
        `- Best text method strict accuracy: **${escapeMarkdown(textResults[0]?.name ?? "n/a")}** at **${formatPercent(textResults[0]?.strictAccuracy)}**.`,
        `- Server analyzer final verdict strict accuracy: **${formatPercent(report.server.verdictResult.strictAccuracy)}** with **${formatPercent(report.server.verdictResult.coverage)}** coverage.`,
        "",
        "<details>",
        `<summary>Image Methods (${imageResults.length})</summary>`,
        "",
        renderTable(imageResults),
        "",
        "</details>",
        "",
        "<details>",
        `<summary>Video Methods - Frame Proxy (${videoResults.length})</summary>`,
        "",
        renderTable(videoResults),
        "",
        "</details>",
        "",
        "<details>",
        `<summary>Text Methods (${textResults.length})</summary>`,
        "",
        renderTable(textResults),
        "",
        "</details>",
        "",
        "<details>",
        `<summary>Server Analyzer Verdict + Signals (${serverSignals.length + 1})</summary>`,
        "",
        renderTable([report.server.verdictResult, ...serverSignals]),
        "",
        "</details>",
        "",
        "### Caveats",
        "",
        "- Image/video numbers are only as representative as the local benchmark images currently present in this repository.",
        "- Video results are **not** full video accuracy; they only measure how each frame-based method separates AI vs real on still frames.",
        "- Text results are **provisional** because the benchmark corpus is synthetic and intentionally balanced.",
        "- `Metadata Analysis` in the server pipeline is effectively a file-name heuristic, so its accuracy changes drastically if filenames contain source hints.",
        "",
    ].join("\n");
}

function updateReadme(markdownSection) {
    const readme = fs.readFileSync(README_PATH, "utf8");
    const replacement = `${REPORT_START}\n${markdownSection}\n${REPORT_END}`;

    if (readme.includes(REPORT_START) && readme.includes(REPORT_END)) {
        const updated = readme.replace(
            new RegExp(`${REPORT_START}[\\s\\S]*?${REPORT_END}`, "m"),
            replacement,
        );
        fs.writeFileSync(README_PATH, updated, "utf8");
        return;
    }

    fs.writeFileSync(README_PATH, `${readme.trimEnd()}\n\n${replacement}\n`, "utf8");
}

async function main() {
    log("Starting method accuracy benchmark...");

    const imageSamples = await loadImageDataset();
    if (!imageSamples.length) {
        throw new Error("No labeled image samples available.");
    }

    const imageCounts = imageSamples.reduce((accumulator, sample) => {
        accumulator[sample.label] += 1;
        return accumulator;
    }, { ai: 0, real: 0 });

    log(`Loaded ${imageSamples.length} image samples (${imageCounts.real} real / ${imageCounts.ai} AI).`);

    const textSamples = buildTextDataset();
    log(`Prepared ${textSamples.length} synthetic text samples.`);

    const [imageMethods, videoMethods, textMethods] = await Promise.all([
        discoverMethods("image"),
        discoverMethods("video"),
        discoverMethods("text"),
    ]);

    log(`Discovered ${imageMethods.length} image methods, ${videoMethods.length} video methods, ${textMethods.length} text methods.`);

    const imageResults = await benchmarkMethods(
        imageMethods,
        imageSamples,
        (fn, sample) => fn(sample.pixels, sample.width, sample.height),
        "image-balanced-local",
    );

    const videoResults = await benchmarkMethods(
        videoMethods,
        imageSamples,
        (fn, sample) => fn(sample.pixels, sample.width, sample.height),
        "video-frame-proxy",
    );

    const textResults = await benchmarkMethods(
        textMethods,
        textSamples,
        (fn, sample) => fn(sample.text),
        "text-synthetic-balanced",
    );

    const server = await benchmarkServerAnalyzer(imageSamples);

    const report = {
        generatedAt: new Date().toISOString(),
        config: {
            imageSamplesPerClass: IMAGE_SAMPLES_PER_CLASS,
            imageMaxDim: IMAGE_MAX_DIM,
            writeReadme: WRITE_README,
        },
        imageDataset: {
            total: imageSamples.length,
            aiCount: imageCounts.ai,
            realCount: imageCounts.real,
        },
        textDataset: {
            total: textSamples.length,
            aiCount: textSamples.filter((sample) => sample.label === "ai").length,
            realCount: textSamples.filter((sample) => sample.label === "real").length,
        },
        imageResults,
        videoResults,
        textResults,
        server,
    };

    fs.writeFileSync(SUMMARY_PATH, JSON.stringify(report, null, 2), "utf8");
    log(`Wrote structured summary to ${path.relative(ROOT_DIR, SUMMARY_PATH).replace(/\\/g, "/")}.`);

    if (WRITE_README) {
        updateReadme(generateMarkdownReport(report));
        log("Updated README.md benchmark section.");
    } else {
        log("Skipped README.md update because BENCHMARK_WRITE_README=0.");
    }

    log(`Benchmark completed successfully. Detailed log: ${path.relative(ROOT_DIR, LOG_PATH).replace(/\\/g, "/")}`);
}

main().catch((error) => {
    log(`Benchmark failed: ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
    process.exitCode = 1;
});
