/**
 * Resampling Detection
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeResampling(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Resampling Detection", nameKey: "signal.resampling",
            category: "forensic", score: 50, weight: 0.35,
            description: "Image too small for analysis",
            descriptionKey: "signal.resampling.error", icon: "📐",
        };
    }

    let score: number;
    
    // Detect resampling via periodic correlation in pixel derivatives
    const size = Math.min(w, h, 256);
    const scaleX = w / size, scaleY = h / size;
    const deriv = new Float32Array(size * size);
    for (let y = 0; y < size; y++) {
        for (let x = 1; x < size; x++) {
            const sx1 = Math.floor(x * scaleX), sy = Math.floor(y * scaleY);
            const sx0 = Math.floor((x-1) * scaleX);
            const i1 = (sy * w + sx1) * 4, i0 = (sy * w + sx0) * 4;
            deriv[y * size + x] = (0.299*pixels[i1] + 0.587*pixels[i1+1] + 0.114*pixels[i1+2])
                                 -(0.299*pixels[i0] + 0.587*pixels[i0+1] + 0.114*pixels[i0+2]);
        }
    }
    // Compute autocorrelation of derivatives to find periodic patterns
    const maxLag = Math.min(32, Math.floor(size / 4));
    let mean = 0;
    for (let i = 0; i < deriv.length; i++) mean += deriv[i];
    mean /= deriv.length;
    let variance = 0;
    for (let i = 0; i < deriv.length; i++) variance += (deriv[i] - mean) ** 2;
    variance /= deriv.length;
    let periodicPeaks = 0, maxPeakVal = 0;
    if (variance > 0.01) {
        const ac = new Float32Array(maxLag);
        for (let lag = 2; lag < maxLag; lag++) {
            let sum = 0, cnt = 0;
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size - lag; x++) {
                    sum += (deriv[y*size+x]-mean) * (deriv[y*size+x+lag]-mean);
                    cnt++;
                }
            }
            ac[lag] = cnt > 0 ? sum / (cnt * variance) : 0;
        }
        for (let i = 3; i < maxLag - 1; i++) {
            if (ac[i] > ac[i-1] && ac[i] > ac[i+1] && ac[i] > 0.05) {
                periodicPeaks++;
                maxPeakVal = Math.max(maxPeakVal, ac[i]);
            }
        }
    }
    if (periodicPeaks >= 3 && maxPeakVal > 0.15) score = 78;
    else if (periodicPeaks >= 2) score = 65;
    else if (periodicPeaks >= 1) score = 55;
    else if (variance < 1) score = 45;
    else score = 30;

    return {
        name: "Resampling Detection", nameKey: "signal.resampling",
        category: "forensic", score, weight: 0.35,
        description: score > 55
            ? "Periodic resampling artifacts detected — image has been geometrically transformed"
            : "No resampling periodicity — consistent with original capture",
        descriptionKey: score > 55 ? "signal.resampling.ai" : "signal.resampling.real",
        icon: "📐",
    };
}
