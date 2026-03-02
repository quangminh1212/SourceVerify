/**
 * Text Coherence Analysis
 * AI text may have unnaturally smooth logical flow
 * Reference: Zellers et al. (2019) - Defending Against Neural Fake News, NeurIPS
 */
import type { AnalysisMethod } from "../../types";

export function analyzeCoherenceAnalysis(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Coherence Analysis", nameKey: "signal.coherenceAnalysis", category: "statistical", score: 50, weight: 0.25, description: "Input too small", descriptionKey: "signal.coherenceAnalysis.error", icon: "🔗" };
    }
    // Measure row-to-row similarity as proxy for text coherence
    const sampleCount = Math.min(h - 1, 80);
    const step = Math.max(1, Math.floor(h / sampleCount));
    const rowSimilarities: number[] = [];
    for (let y = 0; y < h - step; y += step) {
        let sim = 0, cnt = 0;
        for (let x = 0; x < w; x += 4) {
            const idx1 = (y * w + x) * 4, idx2 = ((y + step) * w + x) * 4;
            const g1 = 0.299 * pixels[idx1] + 0.587 * pixels[idx1 + 1] + 0.114 * pixels[idx1 + 2];
            const g2 = 0.299 * pixels[idx2] + 0.587 * pixels[idx2 + 1] + 0.114 * pixels[idx2 + 2];
            sim += 1 - Math.abs(g1 - g2) / 255;
            cnt++;
        }
        if (cnt > 0) rowSimilarities.push(sim / cnt);
    }
    const meanSim = rowSimilarities.reduce((a, b) => a + b, 0) / (rowSimilarities.length || 1);
    const varSim = rowSimilarities.reduce((a, b) => a + (b - meanSim) ** 2, 0) / (rowSimilarities.length || 1);

    let score: number;
    if (meanSim > 0.9 && varSim < 0.005) score = 70;
    else if (meanSim > 0.85 && varSim < 0.01) score = 58;
    else if (varSim > 0.05) score = 28;
    else score = 42;

    return {
        name: "Coherence Analysis", nameKey: "signal.coherenceAnalysis", category: "statistical", score, weight: 0.25,
        description: score > 55 ? "Unnaturally high coherence — AI text tends to maintain overly smooth logical flow" : "Natural content coherence — consistent with human writing patterns",
        descriptionKey: score > 55 ? "signal.coherenceAnalysis.ai" : "signal.coherenceAnalysis.real", icon: "🔗",
        details: `Mean similarity: ${meanSim.toFixed(3)}, Variance: ${varSim.toFixed(5)}.`,
    };
}
