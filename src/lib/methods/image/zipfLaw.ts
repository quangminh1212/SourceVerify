import type { AnalysisMethod } from "../../types";
import { gray } from "../pixelUtils";

/**
 * Signal 28: Zipf's Law Compliance
 * Zipf (1949) - Rank-frequency distribution in images
 * Natural images follow Zipf-like intensity distributions
 */
export function analyzeZipfLaw(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const histogram = new Array(256).fill(0);
    const totalPixels = width * height;
    const step = Math.max(1, Math.floor(totalPixels / 100000));

    for (let i = 0; i < totalPixels * 4; i += step * 4) {
        const g = Math.floor(gray(pixels, i));
        histogram[Math.min(255, Math.max(0, g))]++;
    }

    // Sort by frequency (descending)
    const sorted = histogram.filter(v => v > 0).sort((a, b) => b - a);
    if (sorted.length < 10) {
        return {
            name: "Zipf's Law", nameKey: "signal.zipfLaw",
            category: "statistical", score: 50, weight: 0.3,
            description: "Insufficient data for Zipf analysis",
            descriptionKey: "signal.zipf.error", icon: "ℤ",
        };
    }

    // Linear regression on log(rank) vs log(frequency)
    const logRank: number[] = [], logFreq: number[] = [];
    for (let r = 0; r < sorted.length; r++) {
        logRank.push(Math.log10(r + 1));
        logFreq.push(Math.log10(sorted[r]));
    }

    const n = logRank.length;
    const sumX = logRank.reduce((a, b) => a + b, 0);
    const sumY = logFreq.reduce((a, b) => a + b, 0);
    const sumXY = logRank.reduce((a, b, i) => a + b * logFreq[i], 0);
    const sumX2 = logRank.reduce((a, b) => a + b * b, 0);

    const denom = n * sumX2 - sumX * sumX;
    const slope = Math.abs(denom) > 1e-10 ? (n * sumXY - sumX * sumY) / denom : -1;
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R² (goodness of fit)
    const meanY = sumY / n;
    let ssTot = 0, ssRes = 0;
    for (let i = 0; i < n; i++) {
        ssTot += (logFreq[i] - meanY) ** 2;
        const predicted = slope * logRank[i] + intercept;
        ssRes += (logFreq[i] - predicted) ** 2;
    }
    const rSquared = ssTot > 0 ? 1 - ssRes / ssTot : 0;

    // Natural images: slope ≈ -1 to -1.5, high R²
    // AI images: deviation from Zipf distribution
    let score: number;
    if (rSquared < 0.7) score = 75;
    else if (rSquared < 0.85 || slope > -0.3) score = 62;
    else if (rSquared > 0.95 && slope < -0.8 && slope > -1.8) score = 22;
    else if (rSquared > 0.90) score = 35;
    else score = 48;

    return {
        name: "Zipf's Law", nameKey: "signal.zipfLaw",
        category: "statistical", score, weight: 0.3,
        description: score > 55
            ? "Intensity distribution deviates from Zipf's law — potential AI generation artifact"
            : "Intensity distribution follows natural Zipf-like pattern",
        descriptionKey: score > 55 ? "signal.zipf.ai" : "signal.zipf.real",
        icon: "ℤ",
        details: `Zipf slope: ${slope.toFixed(3)}, R²: ${rSquared.toFixed(4)}.`,
    };
}
