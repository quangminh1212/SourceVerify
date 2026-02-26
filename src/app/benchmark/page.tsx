"use client";

import { useState, useCallback, useRef } from "react";
import { analyzeMedia, type AnalysisResult } from "@/lib/analyzer";
import "./benchmark.css";

const AI_COUNT = 100;
const REAL_COUNT = 100;
const TOTAL = AI_COUNT + REAL_COUNT;

interface TestResult {
    file: string;
    category: "ai" | "real"; // ground truth
    verdict: string;
    correct: boolean;
    aiScore: number;
    confidence: number;
    timeMs: number;
    signals: { name: string; score: number; weight: number }[];
}

export default function BenchmarkPage() {
    const [running, setRunning] = useState(false);
    const [results, setResults] = useState<TestResult[]>([]);
    const [current, setCurrent] = useState(0);
    const [phase, setPhase] = useState<"idle" | "ai" | "real" | "done">("idle");
    const [log, setLog] = useState<string[]>([]);
    const abortRef = useRef(false);

    const addLog = useCallback((msg: string) => {
        setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    }, []);

    const analyzeImage = useCallback(async (
        fileName: string,
        category: "ai" | "real",
        allResults: TestResult[],
    ): Promise<TestResult | null> => {
        try {
            const resp = await fetch(`/benchmark/${fileName}`);
            if (!resp.ok) return null;
            const blob = await resp.blob();
            const file = new File([blob], fileName, { type: "image/jpeg" });
            const result: AnalysisResult = await analyzeMedia(file);

            const correct = category === "ai"
                ? result.verdict === "ai"
                : result.verdict === "real";

            return {
                file: fileName,
                category,
                verdict: result.verdict,
                correct,
                aiScore: result.aiScore,
                confidence: result.confidence,
                timeMs: result.processingTimeMs,
                signals: result.signals.map(s => ({ name: s.name, score: s.score, weight: s.weight })),
            };
        } catch {
            return null;
        }
    }, []);

    const runBenchmark = useCallback(async () => {
        setRunning(true);
        setResults([]);
        setLog([]);
        setCurrent(0);
        abortRef.current = false;

        const allResults: TestResult[] = [];

        // ============ PHASE 1: AI Images ============
        setPhase("ai");
        addLog(`🤖 Phase 1: Testing ${AI_COUNT} AI-generated images...`);

        for (let i = 1; i <= AI_COUNT; i++) {
            if (abortRef.current) { addLog("⏹ Aborted."); break; }
            const fileName = `ai_face_${String(i).padStart(3, "0")}.jpg`;
            setCurrent(i);

            const testResult = await analyzeImage(fileName, "ai", allResults);
            if (!testResult) { addLog(`SKIP ${fileName}`); continue; }

            allResults.push(testResult);
            setResults([...allResults]);


            if (i % 10 === 0 || !testResult.correct) {
                const emoji = testResult.correct ? "✅" : "❌";
                addLog(`${emoji} AI#${i}: ${testResult.verdict} (score=${testResult.aiScore})`);
                if (!testResult.correct) {
                    const sigs = testResult.signals.map(s => `${s.name.substring(0, 8)}=${s.score}`).join(', ');
                    addLog(`   Signals: ${sigs}`);
                }
            }
        }

        if (abortRef.current) { setRunning(false); setPhase("done"); return; }

        // ============ PHASE 2: Real Images ============
        setPhase("real");
        addLog(`\n📸 Phase 2: Testing ${REAL_COUNT} real photos...`);

        for (let i = 1; i <= REAL_COUNT; i++) {
            if (abortRef.current) { addLog("⏹ Aborted."); break; }
            const fileName = `real_photo_${String(i).padStart(3, "0")}.jpg`;
            setCurrent(AI_COUNT + i);

            const testResult = await analyzeImage(fileName, "real", allResults);
            if (!testResult) { addLog(`SKIP ${fileName}`); continue; }

            allResults.push(testResult);
            setResults([...allResults]);

            if (i % 10 === 0 || !testResult.correct) {
                const emoji = testResult.correct ? "✅" : "❌";
                addLog(`${emoji} REAL#${i}: ${testResult.verdict} (score=${testResult.aiScore})`);
                if (!testResult.correct) {
                    const sigs = testResult.signals.map(s => `${s.name.substring(0, 8)}=${s.score}`).join(', ');
                    addLog(`   Signals: ${sigs}`);
                }
            }
        }

        // ============ SUMMARY ============
        const aiResults = allResults.filter(r => r.category === "ai");
        const realResults = allResults.filter(r => r.category === "real");

        const tp = aiResults.filter(r => r.verdict === "ai").length;        // True Positive
        const fn = aiResults.filter(r => r.verdict === "real").length;       // False Negative
        const aiUncertain = aiResults.filter(r => r.verdict === "uncertain").length;

        const tn = realResults.filter(r => r.verdict === "real").length;     // True Negative
        const fp = realResults.filter(r => r.verdict === "ai").length;       // False Positive
        const realUncertain = realResults.filter(r => r.verdict === "uncertain").length;

        const totalTested = allResults.length;
        const totalCorrect = allResults.filter(r => r.correct).length;
        const accuracy = totalTested > 0 ? ((totalCorrect / totalTested) * 100).toFixed(1) : "0";
        const tpr = aiResults.length > 0 ? ((tp / aiResults.length) * 100).toFixed(1) : "0";
        const tnr = realResults.length > 0 ? ((tn / realResults.length) * 100).toFixed(1) : "0";
        const fpr = realResults.length > 0 ? ((fp / realResults.length) * 100).toFixed(1) : "0";
        const fnr = aiResults.length > 0 ? ((fn / aiResults.length) * 100).toFixed(1) : "0";
        const precision = (tp + fp) > 0 ? ((tp / (tp + fp)) * 100).toFixed(1) : "0";
        const recall = (tp + fn) > 0 ? ((tp / (tp + fn)) * 100).toFixed(1) : "0";
        const f1 = (parseFloat(precision) + parseFloat(recall)) > 0
            ? ((2 * parseFloat(precision) * parseFloat(recall)) / (parseFloat(precision) + parseFloat(recall))).toFixed(1) : "0";

        const avgTime = totalTested > 0 ? (allResults.reduce((a, r) => a + r.timeMs, 0) / totalTested).toFixed(0) : "0";

        addLog(`\n${"=".repeat(50)}`);
        addLog(`📊 BENCHMARK RESULTS (${totalTested} images)`);
        addLog(`${"=".repeat(50)}`);
        addLog(`✅ Overall Accuracy: ${accuracy}% (${totalCorrect}/${totalTested})`);
        addLog(``);
        addLog(`🤖 AI Detection (${aiResults.length} AI images):`);
        addLog(`   True Positive (AI→AI): ${tp} (${tpr}%)`);
        addLog(`   False Negative (AI→Real): ${fn} (${fnr}%)`);
        addLog(`   Uncertain: ${aiUncertain}`);
        addLog(``);
        addLog(`📸 Real Detection (${realResults.length} Real images):`);
        addLog(`   True Negative (Real→Real): ${tn} (${tnr}%)`);
        addLog(`   False Positive (Real→AI): ${fp} (${fpr}%)`);
        addLog(`   Uncertain: ${realUncertain}`);
        addLog(``);
        addLog(`📐 Metrics:`);
        addLog(`   Precision: ${precision}%`);
        addLog(`   Recall (Sensitivity): ${recall}%`);
        addLog(`   F1-Score: ${f1}%`);
        addLog(`   Avg Time: ${avgTime}ms/image`);

        // Export
        const jsonStr = JSON.stringify({
            timestamp: new Date().toISOString(),
            summary: {
                totalTested, totalCorrect,
                accuracy: parseFloat(accuracy),
                tp, fp, tn, fn,
                aiUncertain, realUncertain,
                tpr: parseFloat(tpr), tnr: parseFloat(tnr),
                fpr: parseFloat(fpr), fnr: parseFloat(fnr),
                precision: parseFloat(precision),
                recall: parseFloat(recall),
                f1: parseFloat(f1),
                avgTimeMs: parseFloat(avgTime),
            },
            results: allResults,
        }, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `benchmark_full_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);

        setPhase("done");
        setRunning(false);
    }, [addLog, analyzeImage]);

    // Live stats
    const aiResults = results.filter(r => r.category === "ai");
    const realResults = results.filter(r => r.category === "real");
    const tp = aiResults.filter(r => r.verdict === "ai").length;
    const tn = realResults.filter(r => r.verdict === "real").length;
    const fp = realResults.filter(r => r.verdict === "ai").length;
    const fn = aiResults.filter(r => r.verdict === "real").length;
    const totalCorrect = results.filter(r => r.correct).length;
    const accuracy = results.length > 0 ? ((totalCorrect / results.length) * 100).toFixed(1) : "—";

    return (
        <main className="bm-main">
            <h1 className="bm-title">🔬 SourceVerify Full Benchmark</h1>
            <p className="bm-subtitle">
                Testing {AI_COUNT} AI images + {REAL_COUNT} real photos = {TOTAL} total
                {phase === "ai" && " — 🤖 Phase 1: AI Images"}
                {phase === "real" && " — 📸 Phase 2: Real Photos"}
                {phase === "done" && " — ✅ Complete"}
            </p>

            <div className="bm-actions">
                <button
                    onClick={runBenchmark}
                    disabled={running}
                    className={`bm-btn ${running ? "bm-btn--running" : "bm-btn--start"}`}
                >
                    {running ? `Running... ${current}/${TOTAL}` : "▶ Start Full Benchmark"}
                </button>
                {running && (
                    <button
                        onClick={() => { abortRef.current = true; }}
                        className="bm-btn bm-btn--stop"
                    >
                        ⏹ Stop
                    </button>
                )}
            </div>

            {/* Confusion Matrix Stats */}
            <div className="bm-stats">
                <StatBox label="Tested" value={results.length} color="#4285f4" />
                <StatBox label="Accuracy" value={`${accuracy}%`} color={parseFloat(accuracy) >= 80 ? "#0f9d58" : "#e74c3c"} />
                <StatBox label="TP (AI→AI)" value={tp} color="#0f9d58" />
                <StatBox label="TN (Real→Real)" value={tn} color="#0f9d58" />
                <StatBox label="FP (Real→AI)" value={fp} color="#e74c3c" />
                <StatBox label="FN (AI→Real)" value={fn} color="#e74c3c" />
            </div>

            {/* Progress */}
            {running && (
                <div className="bm-progress-track">
                    <div className="bm-progress-fill" data-progress={`${Math.round((current / TOTAL) * 100)}`} />
                </div>
            )}

            {/* Results Table */}
            {results.length > 0 && (
                <div className="bm-table-wrap">
                    <table className="bm-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>File</th>
                                <th className="center">Truth</th>
                                <th className="center">Verdict</th>
                                <th className="center">Correct</th>
                                <th className="center">AI Score</th>
                                <th className="center">Confidence</th>
                                <th className="center">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((r, i) => (
                                <tr key={r.file} className={!r.correct ? "bm-row--wrong" : ""}>
                                    <td>{i + 1}</td>
                                    <td>{r.file}</td>
                                    <td className="center">
                                        <span className={r.category === "ai" ? "bm-tag--ai" : "bm-tag--real"}>
                                            {r.category === "ai" ? "🤖 AI" : "📸 Real"}
                                        </span>
                                    </td>
                                    <td className="center">
                                        <span className={r.verdict === "ai" ? "bm-verdict--ai" : r.verdict === "uncertain" ? "bm-verdict--uncertain" : "bm-verdict--real"}>
                                            {r.verdict === "ai" ? "AI" : r.verdict === "uncertain" ? "UNC" : "REAL"}
                                        </span>
                                    </td>
                                    <td className="center">{r.correct ? "✅" : "❌"}</td>
                                    <td className="center bold">{r.aiScore}</td>
                                    <td className="center">{r.confidence}%</td>
                                    <td className="center">{r.timeMs}ms</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Log */}
            <div className="bm-log">
                {log.length === 0 ? "Press 'Start Full Benchmark' to test 100 AI + 100 Real images..." : log.join("\n")}
            </div>
        </main>
    );
}

function StatBox({ label, value, color }: { label: string; value: string | number; color: string }) {
    const colorClass = color === "#4285f4" ? "bm-color-blue"
        : color === "#0f9d58" ? "bm-color-green"
            : color === "#f4b400" ? "bm-color-yellow"
                : "bm-color-red";
    return (
        <div className="bm-stat-box">
            <div className={`bm-stat-value ${colorClass}`}>{value}</div>
            <div className="bm-stat-label">{label}</div>
        </div>
    );
}
