/**
 * Frame Interpolation Detection
 * Detects artifacts from AI frame interpolation/generation
 * AI-interpolated frames often show blending artifacts and ghosting
 */

import type { AnalysisMethod } from "../../types";

export function analyzeFrameInterpolation(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Frame Interpolation", nameKey: "signal.frameInterpolation",
            category: "statistical", score: 50, weight: 0.2,
            description: "Frame too small for analysis",
            descriptionKey: "signal.frameInterpolation.error", icon: "🎞",
        };
    }

    // Detect blending/ghosting artifacts common in interpolated frames
    // Ghost edges appear as double-edge patterns in high-motion areas
    const blockSize = 16;
    const blocksX = Math.floor(w / blockSize);
    const blocksY = Math.floor(h / blockSize);
    let ghostCount = 0, totalEdgeBlocks = 0;

    for (let by = 0; by < blocksY; by++) {
        for (let bx = 0; bx < blocksX; bx++) {
            let edgeStrength = 0, doubleEdge = 0, count = 0;

            for (let y = by * blockSize + 1; y < (by + 1) * blockSize - 1 && y < h - 1; y++) {
                for (let x = bx * blockSize + 1; x < (bx + 1) * blockSize - 1 && x < w - 2; x++) {
                    const idx = (y * w + x) * 4;
                    const g0 = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
                    const g1 = 0.299 * pixels[idx + 4] + 0.587 * pixels[idx + 5] + 0.114 * pixels[idx + 6];
                    const g2 = 0.299 * pixels[idx + 8] + 0.587 * pixels[idx + 9] + 0.114 * pixels[idx + 10];

                    const d1 = Math.abs(g1 - g0);
                    const d2 = Math.abs(g2 - g1);

                    if (d1 > 15) edgeStrength++;
                    // Double edge pattern: strong edge followed by another strong edge
                    if (d1 > 12 && d2 > 12 && Math.abs(d1 - d2) < 5) doubleEdge++;
                    count++;
                }
            }

            if (count > 0 && edgeStrength / count > 0.05) {
                totalEdgeBlocks++;
                if (count > 0 && doubleEdge / count > 0.02) ghostCount++;
            }
        }
    }

    const ghostRatio = totalEdgeBlocks > 0 ? ghostCount / totalEdgeBlocks : 0;

    let score: number;
    if (ghostRatio > 0.4) score = 75;
    else if (ghostRatio > 0.25) score = 62;
    else if (ghostRatio > 0.1) score = 50;
    else if (ghostRatio < 0.03) score = 28;
    else score = 40;

    return {
        name: "Frame Interpolation", nameKey: "signal.frameInterpolation",
        category: "forensic", score, weight: 0.2,
        description: score > 55
            ? "Double-edge ghosting patterns detected — suggests AI frame interpolation"
            : "No interpolation artifacts detected — frame appears naturally captured",
        descriptionKey: score > 55 ? "signal.frameInterpolation.ai" : "signal.frameInterpolation.real",
        icon: "🎞",
        details: `Ghost ratio: ${ghostRatio.toFixed(3)}, Edge blocks: ${totalEdgeBlocks}.`,
    };
}
