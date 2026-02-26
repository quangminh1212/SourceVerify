/**
 * Signal 6: Gradient Micro-Texture
 * Second-order derivatives in smooth regions
 * v4: Enhanced separation
 */

import type { AnalysisSignal } from "../types";

export function analyzeGradientMicroTexture(pixels: Uint8ClampedArray, width: number, height: number): AnalysisSignal {
    const blockSize = 32;
    const blocksX = Math.floor(width / blockSize);
    const blocksY = Math.floor(height / blockSize);

    let smoothBlockCount = 0;
    let totalBlockCount = 0;
    let microRatioSum = 0;
    const step = Math.max(1, Math.floor(blocksX * blocksY / 200));

    for (let by = 0; by < blocksY; by += step) {
        for (let bx = 0; bx < blocksX; bx += step) {
            let gradSum = 0, microNoise = 0, count = 0;

            for (let y = by * blockSize; y < (by + 1) * blockSize - 1; y++) {
                for (let x = bx * blockSize; x < (bx + 1) * blockSize - 2; x++) {
                    const idx = (y * width + x) * 4;
                    const idxR = (y * width + x + 1) * 4;
                    const idxR2 = (y * width + x + 2) * 4;

                    const g0 = pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;
                    const g1 = pixels[idxR] * 0.299 + pixels[idxR + 1] * 0.587 + pixels[idxR + 2] * 0.114;
                    const g2 = pixels[idxR2] * 0.299 + pixels[idxR2 + 1] * 0.587 + pixels[idxR2 + 2] * 0.114;

                    gradSum += Math.abs(g1 - g0);
                    microNoise += Math.abs(2 * g1 - g0 - g2);
                    count++;
                }
            }

            totalBlockCount++;
            const avgGrad = count > 0 ? gradSum / count : 0;
            const avgMicro = count > 0 ? microNoise / count : 0;

            if (avgGrad < 5 && count > 0) {
                smoothBlockCount++;
                const ratio = avgGrad > 0.5 ? avgMicro / avgGrad : avgMicro;
                microRatioSum += ratio;
            }
        }
    }

    const smoothFraction = totalBlockCount > 0 ? smoothBlockCount / totalBlockCount : 0;
    const avgMicroRatio = smoothBlockCount > 0 ? microRatioSum / smoothBlockCount : 0;

    let score = 50;

    // Smooth block fraction — AI has more smooth areas
    if (smoothFraction > 0.6) score += 20;
    else if (smoothFraction > 0.45) score += 12;
    else if (smoothFraction > 0.3) score += 5;
    else if (smoothFraction < 0.08) score -= 15;
    else if (smoothFraction < 0.15) score -= 8;

    // Micro-texture ratio — lower = less micro-texture = AI
    if (avgMicroRatio < 0.3) score += 20;
    else if (avgMicroRatio < 0.6) score += 12;
    else if (avgMicroRatio < 1.0) score += 3;
    else if (avgMicroRatio > 2.5) score -= 18;
    else if (avgMicroRatio > 1.8) score -= 10;

    score = Math.max(5, Math.min(95, score));

    return {
        name: "Gradient Micro-Texture", nameKey: "signal.gradientSmoothness",
        category: "texture", score, weight: 1.5,
        description: score > 55
            ? "Smooth regions lack natural micro-texture — AI images miss sensor-level noise"
            : "Smooth regions contain natural micro-texture from camera sensor",
        descriptionKey: score > 55 ? "signal.gradient.ai" : "signal.gradient.real",
        icon: "▤",
        details: `Smooth blocks: ${smoothBlockCount}/${totalBlockCount} (${(smoothFraction * 100).toFixed(0)}%), Micro ratio: ${avgMicroRatio.toFixed(3)}.`,
    };
}
