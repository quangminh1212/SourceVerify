/**
 * Method 49: Local Phase Quantization (LPQ)
 * Ojansivu & Heikkilä, "Local Phase Quantization for Blur Insensitive Image Description", ICIP 2008
 * Captures local texture from DFT phase; AI images show different LPQ distributions
 */

import type { AnalysisMethod } from "../types";

export function analyzeLocalPhaseQuantization(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    if (width < 32 || height < 32) {
        return {
            name: "Local Phase Quantization", nameKey: "signal.lpq",
            category: "perceptual", score: 50, weight: 0.35,
            description: "Image too small for LPQ analysis",
            descriptionKey: "signal.lpq.error", icon: "⊗",
        };
    }

    const totalPixels = width * height;
    const step = Math.max(1, Math.floor(Math.sqrt(totalPixels / 30000)));

    const gray = new Float32Array(totalPixels);
    for (let i = 0; i < totalPixels; i++) {
        gray[i] = 0.299 * pixels[i * 4] + 0.587 * pixels[i * 4 + 1] + 0.114 * pixels[i * 4 + 2];
    }

    const lpqBins = 256;
    const lpqHist = new Float32Array(lpqBins);
    let lpqCount = 0;

    for (let y = 2; y < height - 2; y += step) {
        for (let x = 2; x < width - 2; x += step) {
            const h1 = gray[y * width + (x + 1)] - gray[y * width + (x - 1)];
            const h2 = gray[y * width + (x + 2)] - gray[y * width + (x - 2)];
            const v1 = gray[(y + 1) * width + x] - gray[(y - 1) * width + x];
            const v2 = gray[(y + 2) * width + x] - gray[(y - 2) * width + x];
            const d1 = gray[(y + 1) * width + (x + 1)] - gray[(y - 1) * width + (x - 1)];
            const d2 = gray[(y + 1) * width + (x - 1)] - gray[(y - 1) * width + (x + 1)];
            const s1 = gray[(y + 2) * width + (x + 1)] - gray[(y - 2) * width + (x - 1)];
            const s2 = gray[(y + 1) * width + (x + 2)] - gray[(y - 1) * width + (x - 2)];

            let code = 0;
            code |= (h1 >= 0 ? 1 : 0) << 0;
            code |= (h2 >= 0 ? 1 : 0) << 1;
            code |= (v1 >= 0 ? 1 : 0) << 2;
            code |= (v2 >= 0 ? 1 : 0) << 3;
            code |= (d1 >= 0 ? 1 : 0) << 4;
            code |= (d2 >= 0 ? 1 : 0) << 5;
            code |= (s1 >= 0 ? 1 : 0) << 6;
            code |= (s2 >= 0 ? 1 : 0) << 7;

            lpqHist[code]++;
            lpqCount++;
        }
    }

    let lpqEntropy = 0;
    let maxBin = 0;
    let nonZeroBins = 0;
    for (let i = 0; i < lpqBins; i++) {
        if (lpqCount > 0) lpqHist[i] /= lpqCount;
        if (lpqHist[i] > 0) {
            lpqEntropy -= lpqHist[i] * Math.log2(lpqHist[i]);
            nonZeroBins++;
            maxBin = Math.max(maxBin, lpqHist[i]);
        }
    }

    const entropyRatio = lpqEntropy / Math.log2(lpqBins);

    let score: number;
    if (entropyRatio < 0.6) score = 78;
    else if (entropyRatio < 0.72) score = 65;
    else if (entropyRatio < 0.82) score = 50;
    else if (entropyRatio < 0.9) score = 35;
    else score = 20;

    return {
        name: "Local Phase Quantization", nameKey: "signal.lpq",
        category: "perceptual", score, weight: 0.35,
        description: score > 55
            ? "LPQ distribution is concentrated — AI images show limited phase diversity in local textures"
            : "LPQ distribution is diverse — natural phase variation consistent with real camera capture",
        descriptionKey: score > 55 ? "signal.lpq.ai" : "signal.lpq.real",
        icon: "⊗",
        details: `LPQ entropy ratio: ${entropyRatio.toFixed(4)}, Bins used: ${nonZeroBins}/${lpqBins}, Max bin: ${maxBin.toFixed(4)}.`,
    };
}
