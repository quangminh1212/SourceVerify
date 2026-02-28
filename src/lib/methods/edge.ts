/**
 * Signal 5: Edge Coherence
 * Sobel edge distribution and direction entropy analysis
 * v4: Wider scoring range for better separation
 */

import type { AnalysisMethod } from "../types";

export function analyzeEdgeCoherence(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const edgeMagnitudes: number[] = [];
    const edgeDirections: number[] = [];
    const step = Math.max(1, Math.floor(Math.min(width, height) / 300));

    for (let y = 1; y < height - 1; y += step) {
        for (let x = 1; x < width - 1; x += step) {
            const getGray = (px: number, py: number) => {
                const i = (py * width + px) * 4;
                return pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
            };

            const gx = -getGray(x - 1, y - 1) - 2 * getGray(x - 1, y) - getGray(x - 1, y + 1) + getGray(x + 1, y - 1) + 2 * getGray(x + 1, y) + getGray(x + 1, y + 1);
            const gy = -getGray(x - 1, y - 1) - 2 * getGray(x, y - 1) - getGray(x + 1, y - 1) + getGray(x - 1, y + 1) + 2 * getGray(x, y + 1) + getGray(x + 1, y + 1);

            const mag = Math.sqrt(gx * gx + gy * gy);
            edgeMagnitudes.push(mag);
            if (mag > 5) edgeDirections.push(Math.atan2(gy, gx));
        }
    }

    const sorted = [...edgeMagnitudes].sort((a, b) => a - b);
    const p10 = sorted[Math.floor(sorted.length * 0.1)];
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p90 = sorted[Math.floor(sorted.length * 0.9)];
    const edgeRange = p90 - p10;

    const dirBins = new Float64Array(36);
    for (const dir of edgeDirections) {
        const bin = Math.floor(((dir + Math.PI) / (2 * Math.PI)) * 36) % 36;
        dirBins[bin]++;
    }
    let dirEntropy = 0;
    const totalEdges = edgeDirections.length;
    for (let i = 0; i < 36; i++) {
        if (dirBins[i] > 0) {
            const p = dirBins[i] / totalEdges;
            dirEntropy -= p * Math.log2(p);
        }
    }
    const maxEntropy = Math.log2(36);
    const normalizedEntropy = dirEntropy / maxEntropy;

    const sharpnessRatio = p50 > 0 ? p90 / p50 : 1;

    let score = 50;

    // Edge magnitude — AI tends to have smoother edges
    if (p50 < 4 && edgeRange < 25) score += 28;
    else if (p50 < 6) score += 18;
    else if (p50 < 10) score += 8;
    else if (p50 > 25) score -= 20;
    else if (p50 > 18) score -= 10;

    // Sharpness ratio
    if (sharpnessRatio < 2.5) score += 12;
    else if (sharpnessRatio < 4) score += 5;
    else if (sharpnessRatio > 10) score -= 12;
    else if (sharpnessRatio > 7) score -= 5;

    // Direction entropy
    if (normalizedEntropy > 0.92) score += 10;
    else if (normalizedEntropy > 0.85) score += 4;
    else if (normalizedEntropy < 0.6) score -= 12;
    else if (normalizedEntropy < 0.7) score -= 5;

    score = Math.max(5, Math.min(95, score));

    return {
        name: "Edge Coherence", nameKey: "signal.edgeCoherence",
        category: "structure", score, weight: 1.5,
        description: score > 55
            ? "Edges are unusually smooth with uniform directions — common in AI generation"
            : "Edge patterns show natural variation — consistent with real content",
        descriptionKey: score > 55 ? "signal.edge.ai" : "signal.edge.real",
        icon: "▣",
        details: `Median edge: ${p50.toFixed(1)}, Range: ${edgeRange.toFixed(1)}, Sharpness ratio: ${sharpnessRatio.toFixed(1)}, Dir entropy: ${normalizedEntropy.toFixed(3)}.`,
    };
}
