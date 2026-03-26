import type { AnalysisMethod } from "../../types";
import { gray } from "../pixelUtils";

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