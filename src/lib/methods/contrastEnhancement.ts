/**
 * Contrast Enhancement Detection
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeContrastEnhancement(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Contrast Enhancement Detection", nameKey: "signal.contrastEnhancement",
            category: "forensic", score: 50, weight: 0.3,
            description: "Image too small for analysis",
            descriptionKey: "signal.contrastEnhancement.error", icon: "🔆",
        };
    }

    let score: number;
    
    // Detect contrast enhancement via peak-gap analysis in histogram
    const hist = new Uint32Array(256);
    const step = Math.max(1, Math.floor(w * h / 80000));
    for (let i = 0; i < w * h * 4; i += 4 * step) {
        const lum = Math.round(0.299*pixels[i] + 0.587*pixels[i+1] + 0.114*pixels[i+2]);
        hist[lum]++;
    }
    let totalPixels = 0;
    for (let i = 0; i < 256; i++) totalPixels += hist[i];
    // Count gaps and peaks
    let gapCount = 0, peakCount = 0;
    for (let i = 2; i < 254; i++) {
        if (hist[i] === 0 && hist[i-1] > 0 && hist[i+1] > 0) gapCount++;
        if (hist[i] > hist[i-1] * 2 && hist[i] > hist[i+1] * 2 && hist[i] > totalPixels * 0.005) peakCount++;
    }
    // Alternating pattern detection (peak-gap-peak)
    let alternating = 0;
    for (let i = 1; i < 254; i++) {
        if (hist[i] === 0 && hist[i-1] > 0 && hist[i+1] > 0) alternating++;
    }
    if (alternating > 20 && gapCount > 15) score = 80;
    else if (alternating > 10) score = 68;
    else if (gapCount > 8) score = 58;
    else if (gapCount > 3) score = 45;
    else score = 30;

    return {
        name: "Contrast Enhancement Detection", nameKey: "signal.contrastEnhancement",
        category: "forensic", score, weight: 0.3,
        description: score > 55
            ? "Histogram peak-gap artifacts detected — contrast enhancement applied"
            : "Smooth histogram distribution — no contrast manipulation detected",
        descriptionKey: score > 55 ? "signal.contrastEnhancement.ai" : "signal.contrastEnhancement.real",
        icon: "🔆",
    };
}
