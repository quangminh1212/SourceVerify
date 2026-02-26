"use client";

import { useState, useCallback, useRef } from "react";
import { analyzeMedia, type AnalysisResult } from "@/lib/analyzer";

const TOTAL_IMAGES = 100;

interface TestResult {
    file: string;
    verdict: string;
    aiScore: number;
    confidence: number;
    timeMs: number;
    signals: { name: string; score: number; weight: number }[];
}

export default function BenchmarkPage() {
    const [running, setRunning] = useState(false);
    const [results, setResults] = useState<TestResult[]>([]);
    const [current, setCurrent] = useState(0);
    const [log, setLog] = useState<string[]>([]);
    const abortRef = useRef(false);

    const addLog = useCallback((msg: string) => {
        setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    }, []);

    const runBenchmark = useCallback(async () => {
        setRunning(true);
        setResults([]);
        setLog([]);
        setCurrent(0);
        abortRef.current = false;

        const allResults: TestResult[] = [];
        addLog(`Starting benchmark with ${TOTAL_IMAGES} AI-generated images...`);

        for (let i = 1; i <= TOTAL_IMAGES; i++) {
            if (abortRef.current) { addLog("Aborted by user."); break; }

            const fileName = `ai_face_${String(i).padStart(3, "0")}.jpg`;
            setCurrent(i);

            try {
                const resp = await fetch(`/benchmark/${fileName}`);
                if (!resp.ok) { addLog(`SKIP ${fileName}: HTTP ${resp.status}`); continue; }
                const blob = await resp.blob();
                const file = new File([blob], fileName, { type: "image/jpeg" });

                const result: AnalysisResult = await analyzeMedia(file);

                const testResult: TestResult = {
                    file: fileName,
                    verdict: result.verdict,
                    aiScore: result.aiScore,
                    confidence: result.confidence,
                    timeMs: result.processingTimeMs,
                    signals: result.signals.map(s => ({ name: s.name, score: s.score, weight: s.weight })),
                };

                allResults.push(testResult);
                setResults([...allResults]);

                const emoji = result.verdict === "ai" ? "✅" : result.verdict === "uncertain" ? "⚠️" : "❌";
                if (i % 10 === 0 || result.verdict !== "ai") {
                    addLog(`${emoji} #${i} ${fileName}: ${result.verdict} (score=${result.aiScore}, conf=${result.confidence}%)`);
                }
            } catch (err) {
                addLog(`ERROR ${fileName}: ${err}`);
            }
        }

        // Summary
        const aiCount = allResults.filter(r => r.verdict === "ai").length;
        const uncertainCount = allResults.filter(r => r.verdict === "uncertain").length;
        const realCount = allResults.filter(r => r.verdict === "real").length;
        const total = allResults.length;
        const detectionRate = total > 0 ? ((aiCount / total) * 100).toFixed(1) : "0";
        const avgScore = total > 0 ? (allResults.reduce((a, r) => a + r.aiScore, 0) / total).toFixed(1) : "0";
        const avgTime = total > 0 ? (allResults.reduce((a, r) => a + r.timeMs, 0) / total).toFixed(0) : "0";

        addLog(`\n========== RESULTS ==========`);
        addLog(`Total tested: ${total}`);
        addLog(`Detected as AI: ${aiCount} (${detectionRate}%)`);
        addLog(`Uncertain: ${uncertainCount}`);
        addLog(`Detected as Real (FALSE NEGATIVE): ${realCount}`);
        addLog(`Average AI Score: ${avgScore}`);
        addLog(`Average Processing Time: ${avgTime}ms`);
        addLog(`Detection Rate: ${detectionRate}%`);

        // Signal breakdown
        if (total > 0) {
            addLog(`\n--- Signal Averages ---`);
            const signalNames = allResults[0].signals.map(s => s.name);
            for (const name of signalNames) {
                const avgSig = allResults.reduce((a, r) => {
                    const sig = r.signals.find(s => s.name === name);
                    return a + (sig ? sig.score : 0);
                }, 0) / total;
                addLog(`  ${name}: ${avgSig.toFixed(1)}`);
            }
        }

        // Export results as JSON
        const jsonStr = JSON.stringify({ summary: { total, aiCount, uncertainCount, realCount, detectionRate: parseFloat(detectionRate), avgScore: parseFloat(avgScore) }, results: allResults }, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `benchmark_results_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);

        setRunning(false);
    }, [addLog]);

    const aiCount = results.filter(r => r.verdict === "ai").length;
    const uncertainCount = results.filter(r => r.verdict === "uncertain").length;
    const realCount = results.filter(r => r.verdict === "real").length;
    const detectionRate = results.length > 0 ? ((aiCount / results.length) * 100).toFixed(1) : "—";

    return (
        <main style={{ fontFamily: "monospace", padding: "20px", maxWidth: "1200px", margin: "0 auto", background: "#1a1a2e", color: "#e0e0e0", minHeight: "100vh" }}>
            <h1 style={{ color: "#4285f4", marginBottom: 8 }}>🔬 SourceVerify Benchmark</h1>
            <p style={{ color: "#888", marginBottom: 20 }}>Testing {TOTAL_IMAGES} AI-generated images from thispersondoesnotexist.com</p>

            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <button
                    onClick={runBenchmark}
                    disabled={running}
                    style={{ padding: "10px 24px", background: running ? "#333" : "#4285f4", color: "#fff", border: "none", borderRadius: 8, cursor: running ? "default" : "pointer", fontFamily: "monospace", fontSize: 14 }}
                >
                    {running ? `Running... ${current}/${TOTAL_IMAGES}` : "▶ Start Benchmark"}
                </button>
                {running && (
                    <button
                        onClick={() => { abortRef.current = true; }}
                        style={{ padding: "10px 24px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "monospace", fontSize: 14 }}
                    >
                        ⏹ Stop
                    </button>
                )}
            </div>

            {/* Live Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
                <StatBox label="Tested" value={results.length} color="#4285f4" />
                <StatBox label="AI ✅" value={aiCount} color="#0f9d58" />
                <StatBox label="Uncertain ⚠️" value={uncertainCount} color="#f4b400" />
                <StatBox label="Real ❌" value={realCount} color="#e74c3c" />
                <StatBox label="Detection %" value={detectionRate} color={parseFloat(detectionRate) >= 90 ? "#0f9d58" : "#e74c3c"} />
            </div>

            {/* Progress */}
            {running && (
                <div style={{ background: "#222", borderRadius: 8, height: 6, marginBottom: 20 }}>
                    <div style={{ width: `${(current / TOTAL_IMAGES) * 100}%`, height: "100%", background: "#4285f4", borderRadius: 8, transition: "width 0.3s" }} />
                </div>
            )}

            {/* Results Table */}
            {results.length > 0 && (
                <div style={{ maxHeight: 400, overflow: "auto", marginBottom: 20, border: "1px solid #333", borderRadius: 8 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                        <thead>
                            <tr style={{ background: "#222", position: "sticky", top: 0 }}>
                                <th style={{ padding: "8px", textAlign: "left" }}>#</th>
                                <th style={{ padding: "8px", textAlign: "left" }}>File</th>
                                <th style={{ padding: "8px", textAlign: "center" }}>Verdict</th>
                                <th style={{ padding: "8px", textAlign: "center" }}>AI Score</th>
                                <th style={{ padding: "8px", textAlign: "center" }}>Confidence</th>
                                <th style={{ padding: "8px", textAlign: "center" }}>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((r, i) => (
                                <tr key={r.file} style={{ borderTop: "1px solid #333", background: r.verdict === "real" ? "rgba(231,76,60,0.1)" : r.verdict === "uncertain" ? "rgba(244,180,0,0.1)" : "transparent" }}>
                                    <td style={{ padding: "6px 8px" }}>{i + 1}</td>
                                    <td style={{ padding: "6px 8px" }}>{r.file}</td>
                                    <td style={{ padding: "6px 8px", textAlign: "center" }}>
                                        <span style={{ color: r.verdict === "ai" ? "#0f9d58" : r.verdict === "uncertain" ? "#f4b400" : "#e74c3c", fontWeight: "bold" }}>
                                            {r.verdict === "ai" ? "✅ AI" : r.verdict === "uncertain" ? "⚠️ UNC" : "❌ REAL"}
                                        </span>
                                    </td>
                                    <td style={{ padding: "6px 8px", textAlign: "center", fontWeight: "bold" }}>{r.aiScore}</td>
                                    <td style={{ padding: "6px 8px", textAlign: "center" }}>{r.confidence}%</td>
                                    <td style={{ padding: "6px 8px", textAlign: "center" }}>{r.timeMs}ms</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Log */}
            <div style={{ background: "#111", border: "1px solid #333", borderRadius: 8, padding: 12, maxHeight: 300, overflow: "auto", fontSize: 12, whiteSpace: "pre-wrap" }}>
                {log.length === 0 ? "Press 'Start Benchmark' to begin testing..." : log.join("\n")}
            </div>
        </main>
    );
}

function StatBox({ label, value, color }: { label: string; value: string | number; color: string }) {
    return (
        <div style={{ background: "#222", borderRadius: 8, padding: "12px 16px", textAlign: "center" }}>
            <div style={{ color, fontSize: 24, fontWeight: "bold" }}>{value}</div>
            <div style={{ color: "#888", fontSize: 11, marginTop: 4 }}>{label}</div>
        </div>
    );
}
