/**
 * Patch-level Forensics
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzePatchForensics(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Patch-level Forensics", nameKey: "signal.patchForensics",
            category: "forensic", score: 50, weight: 0.3,
            description: "Image too small for analysis",
            descriptionKey: "signal.patchForensics.error", icon: "🧩",
        };
    }

    let score: number;
    // Analyze patch-level consistency for tampering detection
    const patchSize = 32;
    const patchesX = Math.min(Math.floor(w / patchSize), 8);
    const patchesY = Math.min(Math.floor(h / patchSize), 8);
    const patchStats: number[] = [];
    for (let py = 0; py < patchesY; py++) {
        for (let px = 0; px < patchesX; px++) {
            let sum = 0, sum2 = 0, cnt = 0;
            for (let dy = 0; dy < patchSize; dy++) {
                for (let dx = 0; dx < patchSize; dx++) {
                    const idx = ((py * patchSize + dy) * w + px * patchSize + dx) * 4;
                    const v = pixels[idx];
                    sum += v; sum2 += v * v; cnt++;
                }
            }
            const mean = sum / cnt;
            patchStats.push(Math.sqrt(sum2 / cnt - mean * mean));
        }
    }
    const avgStat = patchStats.reduce((a, b) => a + b, 0) / patchStats.length;
    let patchVar = 0;
    for (const s of patchStats) patchVar += (s - avgStat) ** 2;
    patchVar = Math.sqrt(patchVar / patchStats.length);
    const cv = avgStat > 0 ? patchVar / avgStat : 0;
    if (cv > 0.5) score = 70;
    else if (cv > 0.3) score = 55;
    else if (cv < 0.1) score = 60;
    else score = 38;

    return {
        name: "Patch-level Forensics", nameKey: "signal.patchForensics",
        category: "forensic", score, weight: 0.3,
        description: score > 55
            ? "Patch-level inconsistency detected — possible tampered regions"
            : "Consistent patch statistics — no tampering indicators",
        descriptionKey: score > 55 ? "signal.patchForensics.ai" : "signal.patchForensics.real",
        icon: "🧩",
    };
}
