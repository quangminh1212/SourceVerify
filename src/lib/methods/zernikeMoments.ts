/**
 * Zernike Moment Analysis
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeZernikeMoments(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Zernike Moment Analysis", nameKey: "signal.zernikeMoments",
            category: "statistical", score: 50, weight: 0.3,
            description: "Image too small for analysis",
            descriptionKey: "signal.zernikeMoments.error", icon: "🎯",
        };
    }

    let score: number;
    
    // Compute simplified Zernike-like rotation-invariant moments for block matching
    const blockSize = 16;
    const blocksX = Math.min(Math.floor(w / blockSize), 16);
    const blocksY = Math.min(Math.floor(h / blockSize), 16);
    const descriptors = [];
    for (let by = 0; by < blocksY; by++) {
        for (let bx = 0; bx < blocksX; bx++) {
            let mean = 0, var_ = 0;
            for (let dy = 0; dy < blockSize; dy++) {
                for (let dx = 0; dx < blockSize; dx++) {
                    const idx = ((by*blockSize+dy)*w + bx*blockSize+dx) * 4;
                    mean += pixels[idx];
                }
            }
            mean /= blockSize * blockSize;
            for (let dy = 0; dy < blockSize; dy++) {
                for (let dx = 0; dx < blockSize; dx++) {
                    const idx = ((by*blockSize+dy)*w + bx*blockSize+dx) * 4;
                    var_ += (pixels[idx] - mean) ** 2;
                }
            }
            var_ /= blockSize * blockSize;
            descriptors.push({ mean, var: var_ });
        }
    }
    // Find similar blocks (potential copy-move)
    let matchCount = 0;
    for (let i = 0; i < descriptors.length; i++) {
        for (let j = i + 2; j < descriptors.length; j++) {
            const dist = Math.abs(descriptors[i].mean - descriptors[j].mean) + Math.abs(descriptors[i].var - descriptors[j].var);
            if (dist < 5) matchCount++;
        }
    }
    const matchRatio = descriptors.length > 1 ? matchCount / (descriptors.length * (descriptors.length - 1) / 2) : 0;
    if (matchRatio > 0.15) score = 75;
    else if (matchRatio > 0.08) score = 62;
    else if (matchRatio > 0.03) score = 50;
    else score = 30;

    return {
        name: "Zernike Moment Analysis", nameKey: "signal.zernikeMoments",
        category: "statistical", score, weight: 0.3,
        description: score > 55
            ? "High block similarity detected — possible duplication or AI texture repetition"
            : "Natural block diversity — no suspicious duplication patterns",
        descriptionKey: score > 55 ? "signal.zernikeMoments.ai" : "signal.zernikeMoments.real",
        icon: "🎯",
    };
}
