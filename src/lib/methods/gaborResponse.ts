import type { AnalysisMethod } from "../types";
import { gray } from "./pixelUtils";


/**
 * Frequency Domain Analysis Signals (6 methods)
 * Based on peer-reviewed research in image forensics
 *
 * References:
 * - Lyu & Farid, "How Realistic is Photorealistic?", IEEE TSP 2005
 * - Field, "Relations between the statistics of natural images and the response properties of cortical cells", JOSA 1987
 * - Morrone & Owens, "Feature detection from local energy", Pattern Recognition Letters 1987
 */

import type { AnalysisMethod } from "../types";

function gray(pixels: Uint8ClampedArray, idx: number): number {
    return pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;
}

/**
 * Signal 20: Wavelet Coefficient Statistics
 * Lyu & Farid (IEEE TSP 2005) - Haar wavelet decomposition
 * Natural images have specific wavelet coefficient distributions
 */
export function analyzeWaveletStatistics(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const size = Math.min(256, Math.min(width, height));
    const ox = Math.floor((width - size) / 2);
    const oy = Math.floor((height - size) / 2);

    // Extract grayscale block
    const block = new Float64Array(size * size);
    for (let y = 0; y < size; y++)
        for (let x = 0; x < size; x++)
            block[y * size + x] = gray(pixels, ((oy + y) * width + (ox + x)) * 4);

    // Simple Haar wavelet: 1 level decomposition
    const halfW = Math.floor(size / 2);
    const halfH = Math.floor(size / 2);
    const hCoeffs: number[] = []; // horizontal detail
    const vCoeffs: number[] = []; // vertical detail
    const dCoeffs: number[] = []; // diagonal detail

    for (let y = 0; y < halfH; y++) {
        for (let x = 0; x < halfW; x++) {
            const a = block[(2 * y) * size + (2 * x)];
            const b = block[(2 * y) * size + (2 * x + 1)];
            const c = block[(2 * y + 1) * size + (2 * x)];
            const d = block[(2 * y + 1) * size + (2 * x + 1)];

            hCoeffs.push((a - b + c - d) / 2); // LH
            vCoeffs.push((a + b - c - d) / 2); // HL
            dCoeffs.push((a - b - c + d) / 2); // HH
        }
    }

    // Compute statistics of detail coefficients
    const computeStats = (arr: number[]) => {
        const n = arr.length;
        if (n === 0) return { mean: 0, std: 0, kurtosis: 3 };
        const mean = arr.reduce((a, b) => a + b, 0) / n;
        const m2 = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
        const m4 = arr.reduce((a, b) => a + (b - mean) ** 4, 0) / n;
        const std = Math.sqrt(m2);
        const kurtosis = m2 > 0 ? m4 / (m2 * m2) : 3;
        return { mean, std, kurtosis };
    };

    const hStats = computeStats(hCoeffs);
    const vStats = computeStats(vCoeffs);
    const dStats = computeStats(dCoeffs);

    // Natural images: kurtosis > 3 (leptokurtic), higher detail energy
    const avgKurtosis = (hStats.kurtosis + vStats.kurtosis + dStats.kurtosis) / 3;
    const avgStd = (hStats.std + vStats.std + dStats.std) / 3;

    let score = 50;
    // Low kurtosis = more Gaussian = AI-like
    if (avgKurtosis < 4) score += 18;
    else if (avgKurtosis < 8) score += 8;
    else if (avgKurtosis > 30) score -= 18;
    else if (avgKurtosis > 15) score -= 10;

    // Low detail energy = smoother = AI-like
    if (avgStd < 3) score += 15;
    else if (avgStd < 8) score += 5;
    else if (avgStd > 25) score -= 12;
    else if (avgStd > 15) score -= 5;

    score = Math.max(5, Math.min(95, score));

    return {
        name: "Wavelet Statistics", nameKey: "signal.waveletStats",
        category: "frequency", score, weight: 0.6,
        description: score > 55
            ? "Wavelet coefficients show Gaussian distribution — AI images lack natural heavy-tailed statistics"
            : "Wavelet coefficients show natural heavy-tailed distribution — consistent with real images",
        descriptionKey: score > 55 ? "signal.wavelet.ai" : "signal.wavelet.real",
        icon: "≋",
        details: `Avg kurtosis: ${avgKurtosis.toFixed(2)}, Avg detail std: ${avgStd.toFixed(2)}.`,
    };
}

/**
 * Signal 21: Gabor Filter Response Analysis
 * Multi-scale, multi-orientation texture analysis
 * AI images show different Gabor energy distribution patterns
 */
export function analyzeGaborResponse(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const orientations = 4; // 0, 45, 90, 135 degrees
    const energies: number[] = [];
    const step = Math.max(3, Math.floor(Math.min(width, height) / 120));
    const sigma = 2.0;
    const lambda = 8.0;

    for (let o = 0; o < orientations; o++) {
        const theta = (o * Math.PI) / orientations;
        let energy = 0;
        let count = 0;

        for (let y = 3; y < height - 3; y += step) {
            for (let x = 3; x < width - 3; x += step) {
                let realPart = 0;
                // Simplified 5x5 Gabor convolution
                for (let ky = -2; ky <= 2; ky++) {
                    for (let kx = -2; kx <= 2; kx++) {
                        const xPrime = kx * Math.cos(theta) + ky * Math.sin(theta);
                        const yPrime = -kx * Math.sin(theta) + ky * Math.cos(theta);
                        const gaussian = Math.exp(-(xPrime * xPrime + yPrime * yPrime) / (2 * sigma * sigma));
                        const sinusoidal = Math.cos((2 * Math.PI * xPrime) / lambda);
                        const kernel = gaussian * sinusoidal;
                        const g = gray(pixels, ((y + ky) * width + (x + kx)) * 4);
                        realPart += g * kernel;
                    }
                }
                energy += realPart * realPart;
                count++;
            }
        }
        if (count > 0) energies.push(energy / count);
    }

    if (energies.length < orientations) {
        return {
            name: "Gabor Response", nameKey: "signal.gaborResponse",
            category: "frequency", score: 50, weight: 0.5,
            description: "Insufficient data for Gabor analysis",
            descriptionKey: "signal.gabor.error", icon: "≈",
        };
    }

    // Compute anisotropy: ratio of max to min Gabor energy
    const maxE = Math.max(...energies);
    const minE = Math.min(...energies);
    const meanE = energies.reduce((a, b) => a + b, 0) / energies.length;
    const anisotropy = minE > 0 ? maxE / minE : maxE > 0 ? 10 : 1;
    const cv = meanE > 0 ? Math.sqrt(energies.reduce((a, b) => a + (b - meanE) ** 2, 0) / energies.length) / meanE : 0;

    // AI images: more isotropic Gabor response (lower anisotropy)
    let score: number;
    if (anisotropy < 1.2 && cv < 0.08) score = 80;
    else if (anisotropy < 1.5) score = 68;
    else if (anisotropy < 2.0) score = 52;
    else if (anisotropy < 3.0) score = 38;
    else if (anisotropy < 5.0) score = 25;
    else score = 12;

    return {
        name: "Gabor Response", nameKey: "signal.gaborResponse",
        category: "frequency", score, weight: 0.5,
        description: score > 55
            ? "Gabor filter shows isotropic response — AI images lack directional texture variation"
            : "Gabor filter response shows natural directional variation in texture",
        descriptionKey: score > 55 ? "signal.gabor.ai" : "signal.gabor.real",
        icon: "≈",
        details: `Anisotropy: ${anisotropy.toFixed(3)}, CV: ${cv.toFixed(3)}, Energies: ${energies.map(e => e.toFixed(1)).join(", ")}.`,
    };
}
