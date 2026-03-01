/**
 * Steganalysis Detection
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeSteganalysis(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Steganalysis Detection", nameKey: "signal.steganalysis",
            category: "forensic", score: 50, weight: 0.25,
            description: "Image too small for analysis",
            descriptionKey: "signal.steganalysis.error", icon: "🔍",
        };
    }

    let score: number;
    
    // Detect steganography via LSB statistical analysis
    let lsbPairs = 0, totalPairs = 0;
    const step = Math.max(1, Math.floor(w * h / 30000));
    for (let i = 0; i < w * h * 4 - 8; i += 4 * step) {
        const r1 = pixels[i] & 1, r2 = pixels[i+4] & 1;
        const g1 = pixels[i+1] & 1, g2 = pixels[i+5] & 1;
        if (r1 === r2) lsbPairs++;
        if (g1 === g2) lsbPairs++;
        totalPairs += 2;
    }
    const lsbRatio = totalPairs > 0 ? lsbPairs / totalPairs : 0.5;
    // Chi-square test on LSB pairs
    let chiSq = 0;
    const hist = new Uint32Array(256);
    for (let i = 0; i < w * h * 4; i += 4 * step) hist[pixels[i]]++;
    for (let i = 0; i < 256; i += 2) {
        const expected = (hist[i] + hist[i+1]) / 2;
        if (expected > 0) {
            chiSq += ((hist[i] - expected) ** 2) / expected;
            chiSq += ((hist[i+1] - expected) ** 2) / expected;
        }
    }
    const chiNorm = chiSq / 128;
    if (chiNorm < 0.5 && Math.abs(lsbRatio - 0.5) < 0.02) score = 68;
    else if (chiNorm < 1.0) score = 55;
    else if (chiNorm > 5.0) score = 30;
    else score = 42;

    return {
        name: "Steganalysis Detection", nameKey: "signal.steganalysis",
        category: "forensic", score, weight: 0.25,
        description: score > 55
            ? "LSB distribution anomaly detected — possible hidden data or AI artifacts"
            : "Normal LSB distribution — no steganographic traces found",
        descriptionKey: score > 55 ? "signal.steganalysis.ai" : "signal.steganalysis.real",
        icon: "🔍",
    };
}
