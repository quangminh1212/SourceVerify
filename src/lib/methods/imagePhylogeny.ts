/**
 * Image Phylogeny Analysis
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeImagePhylogeny(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Image Phylogeny Analysis", nameKey: "signal.imagePhylogeny",
            category: "statistical", score: 50, weight: 0.25,
            description: "Image too small for analysis",
            descriptionKey: "signal.imagePhylogeny.error", icon: "🌳",
        };
    }

    let score: number;
    
    // Analyze image degradation patterns to estimate processing chain depth
    // Multiple compressions / edits leave cumulative artifacts
    const blockSize = 8;
    let totalBlockVar = 0, totalBoundaryDisc = 0, blocks = 0;
    for (let by = 0; by < Math.min(h, 200) - blockSize; by += blockSize) {
        for (let bx = 0; bx < Math.min(w, 200) - blockSize; bx += blockSize) {
            let mean = 0;
            for (let dy = 0; dy < blockSize; dy++) {
                for (let dx = 0; dx < blockSize; dx++) {
                    mean += pixels[((by+dy)*w+bx+dx)*4];
                }
            }
            mean /= blockSize * blockSize;
            let var_ = 0;
            for (let dy = 0; dy < blockSize; dy++) {
                for (let dx = 0; dx < blockSize; dx++) {
                    var_ += (pixels[((by+dy)*w+bx+dx)*4] - mean) ** 2;
                }
            }
            totalBlockVar += var_ / (blockSize * blockSize);
            blocks++;
            // Boundary discontinuity
            if (bx + blockSize < w) {
                for (let dy = 0; dy < blockSize; dy++) {
                    const i1 = ((by+dy)*w+bx+blockSize-1)*4;
                    const i2 = ((by+dy)*w+bx+blockSize)*4;
                    totalBoundaryDisc += Math.abs(pixels[i1] - pixels[i2]);
                }
            }
        }
    }
    const avgBlockVar = blocks > 0 ? totalBlockVar / blocks : 0;
    const avgBoundaryDisc = blocks > 0 ? totalBoundaryDisc / (blocks * blockSize) : 0;
    // Multiple processing steps increase boundary discontinuity relative to block variance
    const ratio = avgBlockVar > 0 ? avgBoundaryDisc / Math.sqrt(avgBlockVar) : 0;
    if (ratio > 1.5) score = 68;
    else if (ratio > 0.8) score = 55;
    else if (ratio < 0.3) score = 62;
    else score = 35;

    return {
        name: "Image Phylogeny Analysis", nameKey: "signal.imagePhylogeny",
        category: "statistical", score, weight: 0.25,
        description: score > 55
            ? "Multiple processing generations detected — image has complex editing history"
            : "Minimal processing artifacts — consistent with single-generation capture",
        descriptionKey: score > 55 ? "signal.imagePhylogeny.ai" : "signal.imagePhylogeny.real",
        icon: "🌳",
    };
}
