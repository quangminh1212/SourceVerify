import type { AnalysisMethod } from "../types";
import { gray } from "./pixelUtils";

/**
 * Signal 34: Error Level Analysis (ELA)
 * Krawetz (2007) - Differential compression forensics
 * Re-saved regions show different error levels than original
 */
export function analyzeErrorLevel(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    // ELA: Compare original with simulated re-compression
    // Approximate by comparing each pixel to its low-pass filtered version
    const blockSize = 4;
    const errors: number[] = [];
    const step = Math.max(2, Math.floor(Math.min(width, height) / 200));

    for (let y = blockSize; y < height - blockSize; y += step) {
        for (let x = blockSize; x < width - blockSize; x += step) {
            // Original pixel
            const orig = gray(pixels, (y * width + x) * 4);

            // 5x5 average (simulates lossy re-compression)
            let sum = 0, count = 0;
            for (let dy = -2; dy <= 2; dy++) {
                for (let dx = -2; dx <= 2; dx++) {
                    sum += gray(pixels, ((y + dy) * width + (x + dx)) * 4);
                    count++;
                }
            }
            const avgVal = sum / count;
            errors.push(Math.abs(orig - avgVal));
        }
    }

    if (errors.length < 50) {
        return {
            name: "Error Level Analysis", nameKey: "signal.errorLevel",
            category: "compression", score: 50, weight: 0.4,
            description: "Insufficient data for ELA",
            descriptionKey: "signal.ela.error", icon: "âŠ¿",
        };
    }

    const mean = errors.reduce((a, b) => a + b, 0) / errors.length;
    const variance = errors.reduce((a, b) => a + (b - mean) ** 2, 0) / errors.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

    // AI images: more uniform error levels (lower CV, lower mean)
    let score: number;
    if (mean < 2 && cv < 0.8) score = 78;
    else if (mean < 4) score = 65;
    else if (mean < 8) score = 50;
    else if (mean < 15) score = 35;
    else score = 18;

    return {
        name: "Error Level Analysis", nameKey: "signal.errorLevel",
        category: "compression", score, weight: 0.4,
        description: score > 55
            ? "Error levels are unusually uniform â€” AI images lack compression-induced variation"
            : "Error levels vary naturally â€” consistent with real camera compression",
        descriptionKey: score > 55 ? "signal.ela.ai" : "signal.ela.real",
        icon: "âŠ¿",
        details: `Mean error: ${mean.toFixed(2)}, CV: ${cv.toFixed(3)}, Samples: ${errors.length}.`,
    };
}