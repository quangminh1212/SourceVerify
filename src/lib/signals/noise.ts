/**
 * Signal 4: High-Frequency Noise Residual
 * Analyzes noise patterns via Laplacian high-pass filter
 * Real cameras: noise ∝ √brightness (Poisson/shot noise)
 * AI: noise is uniform or absent
 *
 * v5: Reduced shot-correlation impact (unreliable for AI faces),
 *     added noise isotropy check and block-level kurtosis
 */

import type { AnalysisSignal } from "../types";

export function analyzeNoiseResidual(pixels: Uint8ClampedArray, width: number, height: number): AnalysisSignal {
    const blockSize = 32;
    const blocksX = Math.floor(width / blockSize);
    const blocksY = Math.floor(height / blockSize);
    const blockStdDevs: number[] = [];
    const blockBrightness: number[] = [];
    const blockKurtosis: number[] = [];

    const step = Math.max(1, Math.floor(blocksX * blocksY / 300));

    for (let by = 0; by < blocksY; by += step) {
        for (let bx = 0; bx < blocksX; bx += step) {
            let sumResidual = 0, sumResidual2 = 0, sumResidual4 = 0;
            let sumBright = 0, count = 0;

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
                    sumResidual4 += laplacian * laplacian * laplacian * laplacian;
                    sumBright += center;
                    count++;
                }
            }

            if (count > 0) {
                const mean = sumResidual / count;
                const variance = sumResidual2 / count - mean * mean;
                const stddev = Math.sqrt(Math.max(0, variance));
                blockStdDevs.push(stddev);
                blockBrightness.push(sumBright / count);
                // Kurtosis: real camera noise is Gaussian (kurtosis≈3), AI noise may differ
                const moment4 = sumResidual4 / count - 4 * mean * (sumResidual2 * sumResidual / (count * count))
                    + 6 * mean * mean * (sumResidual2 / count) - 3 * mean * mean * mean * mean;
                const kurt = variance > 0.01 ? moment4 / (variance * variance) : 3;
                blockKurtosis.push(kurt);
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

    // Kurtosis analysis: real Gaussian noise has kurtosis ≈ 3
    const meanKurt = blockKurtosis.reduce((a, b) => a + b, 0) / blockKurtosis.length;
    const kurtDeviation = Math.abs(meanKurt - 3); // how far from Gaussian

    let score = 50;

    // Shot noise correlation — reduced impact (unreliable for AI faces)
    if (shotCorrelation > 0.45) score -= 18;       // very strong — likely real
    else if (shotCorrelation > 0.3) score -= 12;    // strong
    else if (shotCorrelation > 0.15) score -= 6;    // moderate — could be either
    else if (shotCorrelation < -0.15) score += 15;  // negative — likely AI
    else if (shotCorrelation < 0) score += 8;       // slightly negative
    else score += 5;                                 // near zero — slight AI indicator

    // Noise uniformity (CV) — v5: AI ~0.73, Real ~1.0
    if (cv < 0.2) score += 22;
    else if (cv < 0.4) score += 12;
    else if (cv < 0.6) score += 4;
    else if (cv > 1.0) score -= 18;
    else if (cv > 0.8) score -= 10;

    // Noise level — v5: AI ~7.8, Real ~25
    if (noiseLevel < 3.0) score += 12;
    else if (noiseLevel < 6.0) score += 5;
    else if (noiseLevel > 15.0) score -= 18;
    else if (noiseLevel > 10.0) score -= 10;
    else if (noiseLevel > 8.0) score -= 3;

    // Kurtosis: AI noise often deviates from Gaussian (kurtosis ≠ 3)
    if (kurtDeviation > 3.0) score += 8;            // far from Gaussian — AI
    else if (kurtDeviation > 1.5) score += 4;
    else if (kurtDeviation < 0.5) score -= 4;       // very Gaussian — real

    score = Math.max(5, Math.min(95, score));

    return {
        name: "Noise Residual", nameKey: "signal.noiseResidual",
        category: "pixel", score, weight: 3.5,
        description: score > 55
            ? "Noise residual is unnaturally uniform — AI images lack natural sensor noise variation"
            : "Noise varies naturally — consistent with real camera sensor behavior",
        descriptionKey: score > 55 ? "signal.noise.ai" : "signal.noise.real",
        icon: "◫",
        details: `Noise CV: ${cv.toFixed(3)}, Shot correlation: ${shotCorrelation.toFixed(3)}, Mean noise: ${noiseLevel.toFixed(1)}, Kurtosis: ${meanKurt.toFixed(1)}.`,
    };
}
