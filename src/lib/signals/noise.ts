/**
 * Signal 4: High-Frequency Noise Residual
 * Analyzes noise patterns via Laplacian high-pass filter
 * Real cameras: noise ∝ √brightness (Poisson/shot noise)
 * AI: noise is uniform or absent
 */

import type { AnalysisSignal } from "../types";

export function analyzeNoiseResidual(pixels: Uint8ClampedArray, width: number, height: number): AnalysisSignal {
    const blockSize = 32;
    const blocksX = Math.floor(width / blockSize);
    const blocksY = Math.floor(height / blockSize);
    const blockStdDevs: number[] = [];
    const blockBrightness: number[] = [];

    const step = Math.max(1, Math.floor(blocksX * blocksY / 300));

    for (let by = 0; by < blocksY; by += step) {
        for (let bx = 0; bx < blocksX; bx += step) {
            let sumResidual = 0, sumResidual2 = 0, sumBright = 0, count = 0;

            for (let y = by * blockSize + 1; y < (by + 1) * blockSize - 1; y++) {
                for (let x = bx * blockSize + 1; x < (bx + 1) * blockSize - 1; x++) {
                    const getGray = (px: number, py: number) => {
                        const i = (py * width + px) * 4;
                        return pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
                    };
                    const center = getGray(x, y);
                    const laplacian = 4 * center - getGray(x - 1, y) - getGray(x + 1, y) - getGray(x, y - 1) - getGray(x, y + 1);
                    sumResidual += laplacian;
                    sumResidual2 += laplacian * laplacian;
                    sumBright += center;
                    count++;
                }
            }

            if (count > 0) {
                const mean = sumResidual / count;
                const variance = sumResidual2 / count - mean * mean;
                blockStdDevs.push(Math.sqrt(Math.max(0, variance)));
                blockBrightness.push(sumBright / count);
            }
        }
    }

    if (blockStdDevs.length < 4) {
        return { name: "Noise Residual", nameKey: "signal.noiseResidual", category: "pixel", score: 50, weight: 3.5, description: "Insufficient data", descriptionKey: "signal.noise.error", icon: "◫" };
    }

    const mean = blockStdDevs.reduce((a, b) => a + b, 0) / blockStdDevs.length;
    const variance = blockStdDevs.reduce((a, b) => a + (b - mean) ** 2, 0) / blockStdDevs.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

    // Shot noise correlation
    const meanBright = blockBrightness.reduce((a, b) => a + b, 0) / blockBrightness.length;
    let covBN = 0, varB = 0, varN = 0;
    for (let i = 0; i < blockStdDevs.length; i++) {
        const db = blockBrightness[i] - meanBright;
        const dn = blockStdDevs[i] - mean;
        covBN += db * dn;
        varB += db * db;
        varN += dn * dn;
    }
    const shotCorrelation = (varB > 0 && varN > 0) ? covBN / Math.sqrt(varB * varN) : 0;
    const noiseLevel = mean;

    let score = 50;

    if (shotCorrelation > 0.3) score -= 20;
    else if (shotCorrelation > 0.1) score -= 10;
    else if (shotCorrelation < -0.1) score += 10;
    else score += 5;

    if (cv < 0.2) score += 20;
    else if (cv < 0.35) score += 10;
    else if (cv > 0.8) score -= 15;
    else if (cv > 0.5) score -= 5;

    if (noiseLevel < 2.0) score += 10;
    else if (noiseLevel > 6.0) score -= 5;

    score = Math.max(10, Math.min(90, score));

    return {
        name: "Noise Residual", nameKey: "signal.noiseResidual",
        category: "pixel", score, weight: 3.5,
        description: score > 55
            ? "Noise residual is unnaturally uniform — AI images lack natural sensor noise variation"
            : "Noise varies naturally — consistent with real camera sensor behavior",
        descriptionKey: score > 55 ? "signal.noise.ai" : "signal.noise.real",
        icon: "◫",
        details: `Noise CV: ${cv.toFixed(3)}, Shot correlation: ${shotCorrelation.toFixed(3)}, Mean noise: ${noiseLevel.toFixed(1)}. Real cameras show positive shot correlation (>0.2).`,
    };
}
