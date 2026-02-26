/**
 * Signal 5: Edge Coherence
 * Sobel edge distribution and direction entropy analysis
 */

import type { AnalysisSignal } from "../types";

export function analyzeEdgeCoherence(pixels: Uint8ClampedArray, width: number, height: number): AnalysisSignal {
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

    if (p50 < 5 && edgeRange < 30) score += 25;
    else if (p50 < 8) score += 15;
    else if (p50 > 20) score -= 15;
    else if (p50 > 15) score -= 5;

    if (sharpnessRatio < 3) score += 10;
    else if (sharpnessRatio > 8) score -= 10;

    if (normalizedEntropy > 0.9) score += 10;
    else if (normalizedEntropy < 0.65) score -= 10;

    score = Math.max(10, Math.min(90, score));

    return {
        name: "Edge Coherence", nameKey: "signal.edgeCoherence",
        category: "structure", score, weight: 2.5,
        description: score > 55
            ? "Edges are unusually smooth with uniform directions — common in AI generation"
            : "Edge patterns show natural variation — consistent with real content",
        descriptionKey: score > 55 ? "signal.edge.ai" : "signal.edge.real",
        icon: "▣",
        details: `Median edge: ${p50.toFixed(1)}, Range: ${edgeRange.toFixed(1)}, Sharpness ratio: ${sharpnessRatio.toFixed(1)}, Dir entropy: ${normalizedEntropy.toFixed(3)}.`,
    };
}
