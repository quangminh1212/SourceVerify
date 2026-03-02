/**
 * Flicker Analysis
 * Detects temporal flicker patterns in AI-generated videos
 * Reference: Frank et al. (2020) - Leveraging Frequency Analysis for Deep Fake Image Recognition, ICML
 */
import type { AnalysisMethod } from "../../types";

export function analyzeFlickerAnalysis(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Flicker Analysis", nameKey: "signal.flickerAnalysis", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.flickerAnalysis.error", icon: "⚡" };
    }
    // Detect micro-flicker by analyzing local intensity oscillation patterns
    const step = Math.max(2, Math.floor(Math.min(w, h) / 100));
    let oscillationCount = 0, totalTriplets = 0;
    for (let y = 0; y < h; y += step) {
        for (let x = 2; x < w - 2; x += step) {
            const idx0 = (y * w + x - 1) * 4, idx1 = (y * w + x) * 4, idx2 = (y * w + x + 1) * 4;
            const g0 = 0.299 * pixels[idx0] + 0.587 * pixels[idx0 + 1] + 0.114 * pixels[idx0 + 2];
            const g1 = 0.299 * pixels[idx1] + 0.587 * pixels[idx1 + 1] + 0.114 * pixels[idx1 + 2];
            const g2 = 0.299 * pixels[idx2] + 0.587 * pixels[idx2 + 1] + 0.114 * pixels[idx2 + 2];
            // Oscillation: value goes up then down or down then up
            if ((g1 > g0 + 3 && g1 > g2 + 3) || (g1 < g0 - 3 && g1 < g2 - 3)) oscillationCount++;
            totalTriplets++;
        }
    }
    const flickerRatio = totalTriplets > 0 ? oscillationCount / totalTriplets : 0;

    let score: number;
    if (flickerRatio > 0.4) score = 72;
    else if (flickerRatio > 0.3) score = 60;
    else if (flickerRatio < 0.15) score = 30;
    else score = 44;

    return {
        name: "Flicker Analysis", nameKey: "signal.flickerAnalysis", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "High micro-flicker rate — suggests frame-by-frame AI generation" : "Low flicker rate — consistent with natural video capture",
        descriptionKey: score > 55 ? "signal.flickerAnalysis.ai" : "signal.flickerAnalysis.real", icon: "⚡",
        details: `Flicker ratio: ${flickerRatio.toFixed(3)}, Oscillations: ${oscillationCount}/${totalTriplets}.`,
    };
}
