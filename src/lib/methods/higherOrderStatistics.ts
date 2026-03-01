import type { AnalysisMethod } from "../types";
import { gray } from "./pixelUtils";


/**
 * Statistical Analysis Signals (6 methods)
 * Based on information theory and statistical forensics
 *
 * References:
 * - Shannon, "A Mathematical Theory of Communication", BSTJ 1948
 * - Lyu & Farid, "Detecting Hidden Messages Using Higher-Order Statistical Models", ICIP 2002
 * - Zipf, "Human Behavior and the Principle of Least Effort", 1949
 */

import type { AnalysisMethod } from "../types";

function gray(pixels: Uint8ClampedArray, idx: number): number {
    return pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;
}

/**
 * Signal 26: Entropy Map Analysis
 * Shannon (1948) - Regional entropy distribution
 * AI images have less entropy variation across regions
 */
export function analyzeEntropyMap(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const blockSize = 32;
    const blocksX = Math.floor(width / blockSize);
    const blocksY = Math.floor(height / blockSize);
    const entropies: number[] = [];
    const step = Math.max(1, Math.floor(blocksX * blocksY / 300));

    for (let by = 0; by < blocksY; by += step) {
        for (let bx = 0; bx < blocksX; bx += step) {
            const hist = new Array(256).fill(0);
            let count = 0;
            for (let y = by * blockSize; y < (by + 1) * blockSize; y++) {
                for (let x = bx * blockSize; x < (bx + 1) * blockSize; x++) {
                    const g = Math.floor(gray(pixels, (y * width + x) * 4));
                    hist[Math.min(255, Math.max(0, g))]++;
                    count++;
                }
            }
            if (count > 0) {
                let entropy = 0;
                for (let i = 0; i < 256; i++) {
                    const p = hist[i] / count;
                    if (p > 0) entropy -= p * Math.log2(p);
                }
                entropies.push(entropy);
            }
        }
    }

    if (entropies.length < 4) {
        return {
            name: "Entropy Map", nameKey: "signal.entropyMap",
            category: "statistical", score: 50, weight: 0.5,
            description: "Insufficient data for entropy analysis",
            descriptionKey: "signal.entropy.error", icon: "Ⓗ",
        };
    }

    const mean = entropies.reduce((a, b) => a + b, 0) / entropies.length;
    const variance = entropies.reduce((a, b) => a + (b - mean) ** 2, 0) / entropies.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

    // AI images: more uniform entropy (lower CV)
    let score: number;
    if (cv < 0.08) score = 82;
    else if (cv < 0.15) score = 68;
    else if (cv < 0.25) score = 52;
    else if (cv < 0.40) score = 38;
    else if (cv < 0.60) score = 22;
    else score = 10;

    return {
        name: "Entropy Map", nameKey: "signal.entropyMap",
        category: "statistical", score, weight: 0.5,
        description: score > 55
            ? "Entropy distribution is too uniform — AI images lack natural information variation"
            : "Entropy distribution varies naturally — consistent with real scene content",
        descriptionKey: score > 55 ? "signal.entropy.ai" : "signal.entropy.real",
        icon: "Ⓗ",
        details: `Mean entropy: ${mean.toFixed(3)} bits, CV: ${cv.toFixed(3)}, Blocks: ${entropies.length}.`,
    };
}

/**
 * Signal 27: Higher-Order Statistics (Kurtosis & Skewness)
 * Lyu & Farid (ICIP 2002) - Higher-order statistical models
 * AI images have different kurtosis/skewness profiles in gradient domain
 */
export function analyzeHigherOrderStatistics(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const gradients: number[] = [];
    const step = Math.max(2, Math.floor(Math.min(width, height) / 250));

    for (let y = 0; y < height - 1; y += step) {
        for (let x = 0; x < width - 1; x += step) {
            const g1 = gray(pixels, (y * width + x) * 4);
            const g2 = gray(pixels, (y * width + x + 1) * 4);
            gradients.push(g2 - g1);
        }
    }

    if (gradients.length < 100) {
        return {
            name: "Higher-Order Statistics", nameKey: "signal.higherOrderStats",
            category: "statistical", score: 50, weight: 0.5,
            description: "Insufficient data for HOS analysis",
            descriptionKey: "signal.hos.error", icon: "μ",
        };
    }

    const n = gradients.length;
    const mean = gradients.reduce((a, b) => a + b, 0) / n;
    const m2 = gradients.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
    const m3 = gradients.reduce((a, b) => a + (b - mean) ** 3, 0) / n;
    const m4 = gradients.reduce((a, b) => a + (b - mean) ** 4, 0) / n;

    const std = Math.sqrt(m2);
    const skewness = std > 0 ? m3 / (std ** 3) : 0;
    const kurtosis = m2 > 0 ? m4 / (m2 * m2) : 3;

    // Natural images: gradient kurtosis >> 3 (heavy tails), skewness ≈ 0
    // AI images: kurtosis closer to 3 (more Gaussian)
    let score = 50;
    if (kurtosis < 5) score += 20;
    else if (kurtosis < 10) score += 10;
    else if (kurtosis > 50) score -= 20;
    else if (kurtosis > 25) score -= 12;
    else if (kurtosis > 15) score -= 5;

    // High absolute skewness is unusual
    if (Math.abs(skewness) > 2.0) score += 8;
    else if (Math.abs(skewness) > 1.0) score += 3;
    else if (Math.abs(skewness) < 0.1) score -= 5;

    score = Math.max(5, Math.min(95, score));

    return {
        name: "Higher-Order Statistics", nameKey: "signal.higherOrderStats",
        category: "statistical", score, weight: 0.5,
        description: score > 55
            ? "Gradient statistics are too Gaussian — natural images have heavier-tailed distributions"
            : "Gradient statistics show natural heavy-tailed distribution",
        descriptionKey: score > 55 ? "signal.hos.ai" : "signal.hos.real",
        icon: "μ",
        details: `Kurtosis: ${kurtosis.toFixed(2)}, Skewness: ${skewness.toFixed(3)}, Std: ${std.toFixed(2)}.`,
    };
}
