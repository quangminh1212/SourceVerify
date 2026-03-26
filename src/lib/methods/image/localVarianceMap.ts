import type { AnalysisMethod } from "../../types";
import { gray } from "../pixelUtils";

/**
 * Signal 17: Local Variance Map Analysis
 * Measures consistency of local pixel variance across image regions
 * AI images exhibit more homogeneous variance maps
 */
export function analyzeLocalVarianceMap(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const blockSize = 16;
    const blocksX = Math.floor(width / blockSize);
    const blocksY = Math.floor(height / blockSize);
    const variances: number[] = [];
    const step = Math.max(1, Math.floor(blocksX * blocksY / 400));

    for (let by = 0; by < blocksY; by += step) {
        for (let bx = 0; bx < blocksX; bx += step) {
            let sum = 0, sum2 = 0, count = 0;
            for (let y = by * blockSize; y < (by + 1) * blockSize; y++) {
                for (let x = bx * blockSize; x < (bx + 1) * blockSize; x++) {
                    const g = gray(pixels, (y * width + x) * 4);
                    sum += g;
                    sum2 += g * g;
                    count++;
                }
            }
            if (count > 0) {
                const mean = sum / count;
                const variance = sum2 / count - mean * mean;
                variances.push(variance);
            }
        }
    }

    if (variances.length < 4) {
        return {
            name: "Local Variance Map", nameKey: "signal.localVarianceMap",
            category: "spatial", score: 50, weight: 0.5,
            description: "Insufficient data for local variance analysis",
            descriptionKey: "signal.localVariance.error", icon: "◈",
        };
    }

    const avgVar = variances.reduce((a, b) => a + b, 0) / variances.length;
    const varOfVar = variances.reduce((a, b) => a + (b - avgVar) ** 2, 0) / variances.length;
    const cvOfVar = avgVar > 0 ? Math.sqrt(varOfVar) / avgVar : 0;

    // AI images: more uniform variance (lower CV)
    let score: number;
    if (cvOfVar < 0.3) score = 82;
    else if (cvOfVar < 0.5) score = 68;
    else if (cvOfVar < 0.8) score = 52;
    else if (cvOfVar < 1.2) score = 38;
    else if (cvOfVar < 1.8) score = 25;
    else score = 12;

    return {
        name: "Local Variance Map", nameKey: "signal.localVarianceMap",
        category: "spatial", score, weight: 0.5,
        description: score > 55
            ? "Local variance is unusually uniform — AI images lack natural variance variation"
            : "Local variance varies naturally across the image — consistent with real capture",
        descriptionKey: score > 55 ? "signal.localVariance.ai" : "signal.localVariance.real",
        icon: "◈",
        details: `Avg variance: ${avgVar.toFixed(2)}, CV of variance: ${cvOfVar.toFixed(3)}, Blocks: ${variances.length}.`,
    };
}
