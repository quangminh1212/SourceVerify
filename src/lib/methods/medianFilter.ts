/**
 * Median Filtering Detection
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeMedianFilter(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Median Filtering Detection", nameKey: "signal.medianFilter",
            category: "forensic", score: 50, weight: 0.35,
            description: "Image too small for analysis",
            descriptionKey: "signal.medianFilter.error", icon: "🔲",
        };
    }

    let score: number;
    
    // Detect median filtering by analyzing pixel value histogram for streak artifacts
    const hist = new Uint32Array(256);
    const step = Math.max(1, Math.floor(w * h / 50000));
    for (let i = 0; i < w * h * 4; i += 4 * step) {
        const lum = Math.round(0.299 * pixels[i] + 0.587 * pixels[i+1] + 0.114 * pixels[i+2]);
        hist[lum]++;
    }
    // Count zero-bins (gaps) and streaks in histogram
    let gaps = 0, streaks = 0, prevZero = false;
    for (let i = 1; i < 255; i++) {
        if (hist[i] === 0 && hist[i-1] > 0 && hist[i+1] > 0) gaps++;
        if (hist[i] > 0 && hist[i-1] === 0) { if (prevZero) streaks++; }
        prevZero = hist[i] === 0;
    }
    // Analyze smoothness via neighbor differences
    let smoothCount = 0, totalChecked = 0;
    for (let y = 1; y < Math.min(h, 200) - 1; y += 2) {
        for (let x = 1; x < Math.min(w, 200) - 1; x += 2) {
            const idx = (y * w + x) * 4;
            const c = pixels[idx];
            const l = pixels[idx - 4], r = pixels[idx + 4];
            const u = pixels[idx - w * 4], d = pixels[idx + w * 4];
            const sorted = [l, u, r, d, c].sort((a,b) => a - b);
            if (Math.abs(c - sorted[2]) <= 1) smoothCount++;
            totalChecked++;
        }
    }
    const medianRatio = totalChecked > 0 ? smoothCount / totalChecked : 0;
    if (medianRatio > 0.85 && gaps < 3) score = 75;
    else if (medianRatio > 0.7) score = 62;
    else if (medianRatio > 0.5) score = 50;
    else if (medianRatio < 0.3) score = 30;
    else score = 40;

    return {
        name: "Median Filtering Detection", nameKey: "signal.medianFilter",
        category: "forensic", score, weight: 0.35,
        description: score > 55
            ? "Median filtering traces detected — possible anti-forensic processing"
            : "No median filtering artifacts — natural pixel distribution",
        descriptionKey: score > 55 ? "signal.medianFilter.ai" : "signal.medianFilter.real",
        icon: "🔲",
    };
}
