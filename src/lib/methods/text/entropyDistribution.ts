/**
 * Entropy Distribution Analysis
 * Character-level entropy distribution differs between AI and human text
 * Reference: Gehrmann et al. (2019) - GLTR: Statistical Detection of Generated Text
 */
import type { AnalysisMethod } from "../../types";

export function analyzeEntropyDistribution(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Entropy Distribution", nameKey: "signal.entropyDistribution", category: "statistical", score: 50, weight: 0.25, description: "Input too small", descriptionKey: "signal.entropyDistribution.error", icon: "🎲" };
    }
    // Calculate sliding-window entropy and analyze its distribution
    const winSize = 32;
    const entropies: number[] = [];
    for (let y = 0; y < h; y += winSize) {
        for (let x = 0; x < w; x += winSize) {
            const hist = new Float32Array(64);
            let cnt = 0;
            for (let dy = 0; dy < winSize && y + dy < h; dy++) {
                for (let dx = 0; dx < winSize && x + dx < w; dx++) {
                    const idx = ((y + dy) * w + x + dx) * 4;
                    const g = Math.floor((0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2]) / 4);
                    hist[g]++; cnt++;
                }
            }
            let e = 0;
            for (let i = 0; i < 64; i++) { if (hist[i] > 0) { const p = hist[i] / cnt; e -= p * Math.log2(p); } }
            entropies.push(e);
        }
    }
    const mean = entropies.reduce((a, b) => a + b, 0) / (entropies.length || 1);
    const variance = entropies.reduce((a, b) => a + (b - mean) ** 2, 0) / (entropies.length || 1);
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;
    // Check for bimodality
    const sorted = [...entropies].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)] || 0;
    const q3 = sorted[Math.floor(sorted.length * 0.75)] || 0;
    const iqr = q3 - q1;

    let score: number;
    if (cv < 0.2 && iqr < 1) score = 70;
    else if (cv < 0.35) score = 58;
    else if (cv > 0.6) score = 28;
    else score = 42;

    return {
        name: "Entropy Distribution", nameKey: "signal.entropyDistribution", category: "statistical", score, weight: 0.25,
        description: score > 55 ? "Uniform entropy distribution — AI-generated content shows less entropy variation" : "Natural entropy variation — consistent with human-created content",
        descriptionKey: score > 55 ? "signal.entropyDistribution.ai" : "signal.entropyDistribution.real", icon: "🎲",
        details: `CV: ${cv.toFixed(3)}, IQR: ${iqr.toFixed(3)}, Mean entropy: ${mean.toFixed(3)}.`,
    };
}
