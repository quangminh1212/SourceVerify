/**
 * Semantic Density Analysis
 * AI text packs information more uniformly than human text
 * Reference: Dugan et al. (2023) - Real or Fake Text? Investigating Human Ability to Detect Boundaries
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSemanticDensity(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Semantic Density", nameKey: "signal.semanticDensity", category: "statistical", score: 50, weight: 0.25, description: "Input too small", descriptionKey: "signal.semanticDensity.error", icon: "💎" };
    }
    // Measure information density per column segment
    const cols = 8;
    const colW = Math.floor(w / cols);
    const colDensities: number[] = [];
    for (let c = 0; c < cols; c++) {
        const hist = new Float32Array(64);
        let cnt = 0;
        for (let y = 0; y < h; y += 2) {
            for (let x = c * colW; x < (c + 1) * colW && x < w; x += 2) {
                const idx = (y * w + x) * 4;
                const g = Math.floor((0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2]) / 4);
                hist[g]++; cnt++;
            }
        }
        let e = 0;
        for (let i = 0; i < 64; i++) { if (hist[i] > 0) { const p = hist[i] / cnt; e -= p * Math.log2(p); } }
        colDensities.push(e);
    }
    const mean = colDensities.reduce((a, b) => a + b, 0) / cols;
    const variance = colDensities.reduce((a, b) => a + (b - mean) ** 2, 0) / cols;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

    let score: number;
    if (cv < 0.05) score = 72;
    else if (cv < 0.1) score = 60;
    else if (cv > 0.3) score = 28;
    else score = 42;

    return {
        name: "Semantic Density", nameKey: "signal.semanticDensity", category: "statistical", score, weight: 0.25,
        description: score > 55 ? "Extremely uniform information density — AI text distributes content too evenly" : "Natural density variation — consistent with human writing patterns",
        descriptionKey: score > 55 ? "signal.semanticDensity.ai" : "signal.semanticDensity.real", icon: "💎",
        details: `Density CV: ${cv.toFixed(4)}, Mean: ${mean.toFixed(3)}.`,
    };
}
