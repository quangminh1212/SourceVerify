import type { AnalysisMethod } from "../types";
import { gray } from "./pixelUtils";

/**
 * Signal 29: Chi-Square Uniformity Test
 * Statistical test for pixel value distribution uniformity
 * AI images may exhibit more uniform or biased distributions
 */
export function analyzeChiSquareUniformity(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    // Analyze LSB (Least Significant Bit) distribution per channel
    const lsbCountR = [0, 0]; // 0 or 1
    const lsbCountG = [0, 0];
    const lsbCountB = [0, 0];
    let totalSamples = 0;
    const totalPixels = width * height;
    const step = Math.max(1, Math.floor(totalPixels / 80000));

    for (let i = 0; i < totalPixels * 4; i += step * 4) {
        lsbCountR[pixels[i] & 1]++;
        lsbCountG[pixels[i + 1] & 1]++;
        lsbCountB[pixels[i + 2] & 1]++;
        totalSamples++;
    }

    if (totalSamples < 100) {
        return {
            name: "Chi-Square Uniformity", nameKey: "signal.chiSquareUniformity",
            category: "statistical", score: 50, weight: 0.3,
            description: "Insufficient data for chi-square test",
            descriptionKey: "signal.chiSquare.error", icon: "Ï‡Â²",
        };
    }

    // Chi-square test for LSB uniformity
    const expected = totalSamples / 2;
    const chiR = ((lsbCountR[0] - expected) ** 2 + (lsbCountR[1] - expected) ** 2) / expected;
    const chiG = ((lsbCountG[0] - expected) ** 2 + (lsbCountG[1] - expected) ** 2) / expected;
    const chiB = ((lsbCountB[0] - expected) ** 2 + (lsbCountB[1] - expected) ** 2) / expected;
    const avgChi = (chiR + chiG + chiB) / 3;

    // Very high chi-square = biased LSBs (common in AI)
    // Very low chi-square = perfectly uniform (also suspicious)
    let score: number;
    if (avgChi < 0.1) score = 72; // suspiciously uniform
    else if (avgChi < 1.0) score = 35; // natural range
    else if (avgChi < 5.0) score = 45; // mild bias
    else if (avgChi < 20.0) score = 62; // significant bias
    else score = 78; // very biased

    return {
        name: "Chi-Square Uniformity", nameKey: "signal.chiSquareUniformity",
        category: "statistical", score, weight: 0.3,
        description: score > 55
            ? "LSB distribution shows statistical anomaly â€” potential AI generation artifact"
            : "LSB distribution appears statistically natural",
        descriptionKey: score > 55 ? "signal.chiSquare.ai" : "signal.chiSquare.real",
        icon: "Ï‡Â²",
        details: `Ï‡Â² R: ${chiR.toFixed(3)}, G: ${chiG.toFixed(3)}, B: ${chiB.toFixed(3)}, Avg: ${avgChi.toFixed(3)}.`,
    };
}