/**
 * Method 48: Tamura Texture Features
 * Tamura et al., "Textural Features Corresponding to Visual Perception", IEEE Trans. SMC 1978
 * Measures coarseness, contrast, directionality — properties that differ between natural and AI images
 */

import type { AnalysisMethod } from "../types";

export function analyzeTamuraTexture(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    if (width < 32 || height < 32) {
        return {
            name: "Tamura Texture Features", nameKey: "signal.tamuraTexture",
            category: "perceptual", score: 50, weight: 0.35,
            description: "Image too small for Tamura analysis",
            descriptionKey: "signal.tamura.error", icon: "⊠",
        };
    }

    const totalPixels = width * height;
    const step = Math.max(1, Math.floor(Math.sqrt(totalPixels / 40000)));

    const gray = new Float32Array(totalPixels);
    for (let i = 0; i < totalPixels; i++) {
        gray[i] = 0.299 * pixels[i * 4] + 0.587 * pixels[i * 4 + 1] + 0.114 * pixels[i * 4 + 2];
    }

    // 1. Coarseness
    let coarsenessSum = 0, cCount = 0;
    const maxK = 3;
    for (let y = 4; y < height - 4; y += step) {
        for (let x = 4; x < width - 4; x += step) {
            let bestK = 0, maxDiff = 0;
            for (let k = 0; k < maxK; k++) {
                const size = 1 << k;
                if (x - size < 0 || x + size >= width || y - size < 0 || y + size >= height) continue;
                const hDiff = Math.abs(gray[y * width + (x + size)] - gray[y * width + (x - size)]);
                const vDiff = Math.abs(gray[(y + size) * width + x] - gray[(y - size) * width + x]);
                const diff = Math.max(hDiff, vDiff);
                if (diff > maxDiff) { maxDiff = diff; bestK = k; }
            }
            coarsenessSum += 1 << bestK;
            cCount++;
        }
    }
    const coarseness = cCount > 0 ? coarsenessSum / cCount : 1;

    // 2. Contrast
    let sum = 0, sum2 = 0, sum4 = 0, sCount = 0;
    for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
            const v = gray[y * width + x];
            sum += v; sum2 += v * v; sCount++;
        }
    }
    const mean = sum / sCount;
    for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
            sum4 += (gray[y * width + x] - mean) ** 4;
        }
    }
    const variance = sum2 / sCount - mean * mean;
    const stdDev = Math.sqrt(Math.max(0, variance));
    const kurtosis = sCount > 0 ? (sum4 / sCount) / Math.max(1, variance * variance) : 3;
    const contrast = stdDev / Math.max(0.01, Math.pow(kurtosis, 0.25));

    // 3. Directionality
    const dirBins = 16;
    const dirHist = new Float32Array(dirBins);
    let dirCount = 0;
    for (let y = 1; y < height - 1; y += step) {
        for (let x = 1; x < width - 1; x += step) {
            const gx = gray[y * width + x + 1] - gray[y * width + x - 1];
            const gy = gray[(y + 1) * width + x] - gray[(y - 1) * width + x];
            const mag = Math.sqrt(gx * gx + gy * gy);
            if (mag > 5) {
                const angle = Math.atan2(gy, gx) + Math.PI;
                const bin = Math.min(dirBins - 1, Math.floor(angle / (2 * Math.PI) * dirBins));
                dirHist[bin]++;
                dirCount++;
            }
        }
    }
    let dirEntropy = 0;
    if (dirCount > 0) {
        for (let i = 0; i < dirBins; i++) {
            const p = dirHist[i] / dirCount;
            if (p > 0) dirEntropy -= p * Math.log2(p);
        }
    }
    const dirRatio = dirEntropy / Math.log2(dirBins);

    let score = 50;
    if (coarseness < 1.3) score += 12;
    else if (coarseness < 1.8) score += 5;
    else if (coarseness > 3.0) score -= 8;

    if (contrast < 8) score += 8;
    else if (contrast > 30) score -= 6;

    if (dirRatio > 0.92) score += 8;
    else if (dirRatio < 0.7) score -= 8;

    score = Math.max(5, Math.min(95, score));

    return {
        name: "Tamura Texture Features", nameKey: "signal.tamuraTexture",
        category: "perceptual", score, weight: 0.35,
        description: score > 55
            ? "Tamura features show unnatural texture — low coarseness and isotropic gradients typical of AI"
            : "Tamura features indicate natural texture — coarseness and directionality consistent with real capture",
        descriptionKey: score > 55 ? "signal.tamura.ai" : "signal.tamura.real",
        icon: "⊠",
        details: `Coarseness: ${coarseness.toFixed(3)}, Contrast: ${contrast.toFixed(2)}, Dir ratio: ${dirRatio.toFixed(4)}, Kurtosis: ${kurtosis.toFixed(2)}.`,
    };
}
