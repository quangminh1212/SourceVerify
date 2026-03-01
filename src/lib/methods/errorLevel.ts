import type { AnalysisMethod } from "../types";
import { gray } from "./pixelUtils";

/**
 * Signal 34: Error Level Analysis (ELA)
 * Krawetz (2007) - Differential compression forensics
 *
 * True ELA compares original vs JPEG re-compressed version.
 * Since we operate on decoded pixels (no access to raw JPEG stream),
 * we simulate DCT quantization via 8×8 block averaging which is closer
 * to actual JPEG behavior than a simple mean filter.
 *
 * Key insight: Real camera JPEGs have spatially varying error levels
 * because different regions quantize differently based on content.
 * AI images tend to have uniform error distributions since they
 * were not originally JPEG compressed.
 */
export function analyzeErrorLevel(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const blockSize = 8; // JPEG uses 8×8 DCT blocks
    const blocksX = Math.floor(width / blockSize);
    const blocksY = Math.floor(height / blockSize);

    if (blocksX < 3 || blocksY < 3) {
        return {
            name: "Error Level Analysis", nameKey: "signal.errorLevel",
            category: "compression", score: 50, weight: 0.4,
            description: "Image too small for ELA",
            descriptionKey: "signal.ela.error", icon: "⊿",
        };
    }

    // Simulate JPEG re-compression by computing per-block average
    // then measuring the error between original and block-averaged version
    // This approximates DCT quantization at low quality
    const blockErrors: number[] = [];
    const step = Math.max(1, Math.floor(blocksX * blocksY / 400));

    for (let by = 0; by < blocksY; by += step) {
        for (let bx = 0; bx < blocksX; bx += step) {
            // Compute block mean per channel (simulates heavy quantization)
            let sumR = 0, sumG = 0, sumB = 0;
            const count = blockSize * blockSize;

            for (let dy = 0; dy < blockSize; dy++) {
                for (let dx = 0; dx < blockSize; dx++) {
                    const idx = ((by * blockSize + dy) * width + (bx * blockSize + dx)) * 4;
                    sumR += pixels[idx];
                    sumG += pixels[idx + 1];
                    sumB += pixels[idx + 2];
                }
            }
            const meanR = sumR / count;
            const meanG = sumG / count;
            const meanB = sumB / count;

            // Compute mean absolute error for this block
            let blockError = 0;
            for (let dy = 0; dy < blockSize; dy++) {
                for (let dx = 0; dx < blockSize; dx++) {
                    const idx = ((by * blockSize + dy) * width + (bx * blockSize + dx)) * 4;
                    blockError += Math.abs(pixels[idx] - meanR)
                        + Math.abs(pixels[idx + 1] - meanG)
                        + Math.abs(pixels[idx + 2] - meanB);
                }
            }
            blockErrors.push(blockError / (count * 3));
        }
    }

    if (blockErrors.length < 20) {
        return {
            name: "Error Level Analysis", nameKey: "signal.errorLevel",
            category: "compression", score: 50, weight: 0.4,
            description: "Insufficient data for ELA",
            descriptionKey: "signal.ela.error", icon: "⊿",
        };
    }

    const mean = blockErrors.reduce((a, b) => a + b, 0) / blockErrors.length;
    const variance = blockErrors.reduce((a, b) => a + (b - mean) ** 2, 0) / blockErrors.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

    // AI images: more uniform error levels (lower CV and lower mean)
    // Real JPEGs: high variation because complex regions quantize differently
    let score = 50;

    // Error level magnitude
    if (mean < 3) score += 15;       // very low detail = likely AI
    else if (mean < 6) score += 8;
    else if (mean > 20) score -= 15;  // high detail variation = natural
    else if (mean > 12) score -= 8;

    // Error level spatial uniformity
    if (cv < 0.3) score += 15;       // very uniform = AI
    else if (cv < 0.5) score += 8;
    else if (cv > 1.0) score -= 12;  // highly variable = natural JPEG
    else if (cv > 0.8) score -= 5;

    score = Math.max(10, Math.min(90, score));

    return {
        name: "Error Level Analysis", nameKey: "signal.errorLevel",
        category: "compression", score, weight: 0.4,
        description: score > 55
            ? "Error levels are unusually uniform — AI images lack compression-induced variation"
            : "Error levels vary naturally — consistent with real camera compression",
        descriptionKey: score > 55 ? "signal.ela.ai" : "signal.ela.real",
        icon: "⊿",
        details: `Mean error: ${mean.toFixed(2)}, CV: ${cv.toFixed(3)}, Blocks: ${blockErrors.length}. Real JPEGs have CV > 0.6.`,
    };
}