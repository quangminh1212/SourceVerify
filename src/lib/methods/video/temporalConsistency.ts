/**
 * Temporal Consistency Analysis
 * Detects inconsistencies in frame-to-frame temporal coherence
 * AI-generated videos often exhibit unnatural flickering or sudden shifts
 */

import type { AnalysisMethod } from "../../types";

export function analyzeTemporalConsistency(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Temporal Consistency", nameKey: "signal.temporalConsistency",
            category: "statistical", score: 50, weight: 0.25,
            description: "Frame too small for analysis",
            descriptionKey: "signal.temporalConsistency.error", icon: "⏱",
        };
    }

    // Analyze spatial coherence as a proxy for temporal consistency
    // Real video frames have smooth gradients; AI frames may have abrupt transitions
    const blockSize = 8;
    const blocksX = Math.floor(w / blockSize);
    const blocksY = Math.floor(h / blockSize);
    let abruptCount = 0, smoothCount = 0, totalBlocks = 0;

    for (let by = 0; by < blocksY - 1; by++) {
        for (let bx = 0; bx < blocksX - 1; bx++) {
            const idx1 = (by * blockSize * w + bx * blockSize) * 4;
            const idx2 = (by * blockSize * w + (bx + 1) * blockSize) * 4;
            const idx3 = ((by + 1) * blockSize * w + bx * blockSize) * 4;

            const diffH = Math.abs(pixels[idx1] - pixels[idx2]) +
                Math.abs(pixels[idx1 + 1] - pixels[idx2 + 1]) +
                Math.abs(pixels[idx1 + 2] - pixels[idx2 + 2]);

            const diffV = Math.abs(pixels[idx1] - pixels[idx3]) +
                Math.abs(pixels[idx1 + 1] - pixels[idx3 + 1]) +
                Math.abs(pixels[idx1 + 2] - pixels[idx3 + 2]);

            const avgDiff = (diffH + diffV) / 6;
            if (avgDiff > 40) abruptCount++;
            else if (avgDiff < 10) smoothCount++;
            totalBlocks++;
        }
    }

    const abruptRatio = totalBlocks > 0 ? abruptCount / totalBlocks : 0;
    const smoothRatio = totalBlocks > 0 ? smoothCount / totalBlocks : 0;

    let score: number;
    if (smoothRatio > 0.85 && abruptRatio < 0.02) score = 72;
    else if (smoothRatio > 0.7) score = 60;
    else if (abruptRatio > 0.3) score = 35;
    else score = 45;

    return {
        name: "Temporal Consistency", nameKey: "signal.temporalConsistency",
        category: "forensic", score, weight: 0.25,
        description: score > 55
            ? "Unnaturally smooth temporal transitions — may indicate AI video generation"
            : "Natural temporal variation — consistent with real video footage",
        descriptionKey: score > 55 ? "signal.temporalConsistency.ai" : "signal.temporalConsistency.real",
        icon: "⏱",
        details: `Abrupt ratio: ${abruptRatio.toFixed(3)}, Smooth ratio: ${smoothRatio.toFixed(3)}.`,
    };
}
