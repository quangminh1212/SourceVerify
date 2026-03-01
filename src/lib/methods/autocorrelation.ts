/**
 * Method 46: Autocorrelation Regularity
 * Popescu & Farid, "Exposing Digital Forgeries Through Inconsistencies in CFA Interpolation", IEEE SP 2005
 * Detects periodic resampling artifacts via spatial autocorrelation peaks
 */

import type { AnalysisMethod } from "../types";

export function analyzeAutocorrelation(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    if (width < 32 || height < 32) {
        return {
            name: "Autocorrelation Regularity", nameKey: "signal.autocorrelation",
            category: "forensic", score: 50, weight: 0.35,
            description: "Image too small for autocorrelation analysis",
            descriptionKey: "signal.autocorr.error", icon: "⊕",
        };
    }

    const grayW = Math.min(width, 256);
    const grayH = Math.min(height, 256);
    const scaleX = width / grayW;
    const scaleY = height / grayH;
    const gray = new Float32Array(grayW * grayH);

    for (let y = 0; y < grayH; y++) {
        for (let x = 0; x < grayW; x++) {
            const sx = Math.floor(x * scaleX);
            const sy = Math.floor(y * scaleY);
            const idx = (sy * width + sx) * 4;
            gray[y * grayW + x] = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
        }
    }

    const maxLag = 16;
    const autocorr = new Float32Array(maxLag);
    let mean = 0;
    for (let i = 0; i < gray.length; i++) mean += gray[i];
    mean /= gray.length;

    let var0 = 0;
    for (let i = 0; i < gray.length; i++) var0 += (gray[i] - mean) ** 2;
    var0 /= gray.length;

    if (var0 < 0.01) {
        return {
            name: "Autocorrelation Regularity", nameKey: "signal.autocorrelation",
            category: "forensic", score: 70, weight: 0.35,
            description: "Nearly uniform image — suspicious for natural photography",
            descriptionKey: "signal.autocorr.ai", icon: "⊕",
        };
    }

    for (let lag = 1; lag < maxLag; lag++) {
        let sum = 0, count = 0;
        for (let y = 0; y < grayH; y++) {
            for (let x = 0; x < grayW - lag; x++) {
                sum += (gray[y * grayW + x] - mean) * (gray[y * grayW + x + lag] - mean);
                count++;
            }
        }
        autocorr[lag] = count > 0 ? sum / (count * var0) : 0;
    }

    let peakCount = 0;
    let maxPeak = 0;
    for (let i = 2; i < maxLag - 1; i++) {
        if (autocorr[i] > autocorr[i - 1] && autocorr[i] > autocorr[i + 1] && autocorr[i] > 0.1) {
            peakCount++;
            maxPeak = Math.max(maxPeak, autocorr[i]);
        }
    }

    const decayRate = autocorr[1] > 0.01 ? autocorr[maxLag - 1] / autocorr[1] : 0;

    let score: number;
    if (peakCount >= 3 && maxPeak > 0.3) score = 78;
    else if (peakCount >= 2 && maxPeak > 0.2) score = 65;
    else if (peakCount >= 1 && maxPeak > 0.15) score = 55;
    else if (decayRate < 0.3) score = 35;
    else score = 25;

    return {
        name: "Autocorrelation Regularity", nameKey: "signal.autocorrelation",
        category: "forensic", score, weight: 0.35,
        description: score > 55
            ? "Periodic autocorrelation peaks detected — suggests resampling or AI upsampling artifacts"
            : "Smooth autocorrelation decay — consistent with natural image structure",
        descriptionKey: score > 55 ? "signal.autocorr.ai" : "signal.autocorr.real",
        icon: "⊕",
        details: `Peaks: ${peakCount}, Max peak: ${maxPeak.toFixed(4)}, Decay rate: ${decayRate.toFixed(4)}.`,
    };
}
