/**
 * SIFT Keypoint Forensics
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeSiftForensics(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "SIFT Keypoint Forensics", nameKey: "signal.siftForensics",
            category: "forensic", score: 50, weight: 0.35,
            description: "Image too small for analysis",
            descriptionKey: "signal.siftForensics.error", icon: "🔑",
        };
    }

    let score: number;
    
    // Simplified keypoint-based analysis for duplicated regions
    // Extract corner-like features and check for suspicious matches
    const blockSize = 16;
    const blocksX = Math.min(Math.floor(w / blockSize), 20);
    const blocksY = Math.min(Math.floor(h / blockSize), 20);
    const features = [];
    for (let by = 0; by < blocksY; by++) {
        for (let bx = 0; bx < blocksX; bx++) {
            // Compute gradient-based descriptor (simplified SIFT)
            let gx = 0, gy = 0, mag = 0;
            for (let dy = 1; dy < blockSize - 1; dy++) {
                for (let dx = 1; dx < blockSize - 1; dx++) {
                    const y = by*blockSize+dy, x = bx*blockSize+dx;
                    if (y >= h || x >= w) continue;
                    const idx = (y*w+x)*4;
                    const lx = pixels[idx-4], rx = pixels[idx+4];
                    const uy = pixels[(idx-w*4)], dy_ = pixels[(idx+w*4)];
                    gx += rx - lx;
                    gy += dy_ - uy;
                    mag += Math.sqrt((rx-lx)**2 + (dy_-uy)**2);
                }
            }
            const n = (blockSize-2) ** 2;
            features.push({ gx: gx/n, gy: gy/n, mag: mag/n, bx, by });
        }
    }
    // Find similar features at different locations
    let matches = 0;
    for (let i = 0; i < features.length; i++) {
        for (let j = i + 3; j < features.length; j++) {
            const dist = Math.abs(features[i].mag - features[j].mag) + Math.abs(features[i].gx - features[j].gx)*0.5;
            const spatialDist = Math.abs(features[i].bx - features[j].bx) + Math.abs(features[i].by - features[j].by);
            if (dist < 3 && spatialDist > 3) matches++;
        }
    }
    const matchRatio = features.length > 1 ? matches / features.length : 0;
    if (matchRatio > 0.3) score = 78;
    else if (matchRatio > 0.15) score = 65;
    else if (matchRatio > 0.05) score = 50;
    else score = 28;

    return {
        name: "SIFT Keypoint Forensics", nameKey: "signal.siftForensics",
        category: "forensic", score, weight: 0.35,
        description: score > 55
            ? "Suspicious keypoint matches at distant locations — possible copy-move or AI duplication"
            : "Natural keypoint distribution — no suspicious duplicated features",
        descriptionKey: score > 55 ? "signal.siftForensics.ai" : "signal.siftForensics.real",
        icon: "🔑",
    };
}
