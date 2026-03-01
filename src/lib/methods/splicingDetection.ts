/**
 * Splicing Detection
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeSplicingDetection(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Splicing Detection", nameKey: "signal.splicingDetection",
            category: "forensic", score: 50, weight: 0.35,
            description: "Image too small for analysis",
            descriptionKey: "signal.splicingDetection.error", icon: "✂️",
        };
    }

    let score: number;
    // Detect image splicing via boundary artifact analysis and noise inconsistency
    const blockSize = 16;
    const blocksX = Math.min(Math.floor(w / blockSize), 16);
    const blocksY = Math.min(Math.floor(h / blockSize), 16);
    const noiseEstimates: number[] = [];
    for (let by = 0; by < blocksY; by++) {
        for (let bx = 0; bx < blocksX; bx++) {
            let sum = 0, sum2 = 0, cnt = 0;
            for (let dy = 1; dy < blockSize - 1; dy++) {
                for (let dx = 1; dx < blockSize - 1; dx++) {
                    const y = by * blockSize + dy, x = bx * blockSize + dx;
                    const idx = (y * w + x) * 4;
                    const laplacian = Math.abs(4 * pixels[idx] - pixels[idx - 4] - pixels[idx + 4] - pixels[idx - w * 4] - pixels[idx + w * 4]);
                    sum += laplacian; sum2 += laplacian * laplacian; cnt++;
                }
            }
            const mean = cnt > 0 ? sum / cnt : 0;
            const variance = cnt > 0 ? sum2 / cnt - mean * mean : 0;
            noiseEstimates.push(Math.sqrt(Math.max(0, variance)));
        }
    }
    const avgNoise = noiseEstimates.reduce((a, b) => a + b, 0) / noiseEstimates.length;
    let noiseVar = 0;
    for (const n of noiseEstimates) noiseVar += (n - avgNoise) ** 2;
    noiseVar = Math.sqrt(noiseVar / noiseEstimates.length);
    const cv = avgNoise > 0 ? noiseVar / avgNoise : 0;
    if (cv > 0.6) score = 75;
    else if (cv > 0.4) score = 62;
    else if (cv > 0.25) score = 50;
    else score = 30;

    return {
        name: "Splicing Detection", nameKey: "signal.splicingDetection",
        category: "forensic", score, weight: 0.35,
        description: score > 55
            ? "Noise inconsistency across regions — possible image splicing"
            : "Consistent noise levels — no splicing artifacts detected",
        descriptionKey: score > 55 ? "signal.splicingDetection.ai" : "signal.splicingDetection.real",
        icon: "✂️",
    };
}
