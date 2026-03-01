import type { AnalysisMethod } from "../types";
import { gray } from "./pixelUtils";

/**
 * Signal 15: Histogram of Oriented Gradients (HOG) Anomaly
 * Dalal & Triggs (CVPR 2005) - Gradient orientation distribution
 * AI images exhibit more uniform gradient orientations than natural scenes
 */
export function analyzeHOGAnomaly(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const numBins = 9;
    const binSize = Math.PI / numBins;
    const globalHist = new Array(numBins).fill(0);
    let totalMag = 0;
    const step = Math.max(2, Math.floor(Math.min(width, height) / 200));

    for (let y = 1; y < height - 1; y += step) {
        for (let x = 1; x < width - 1; x += step) {
            const _idx = (y * width + x) * 4;
            const gx = gray(pixels, (y * width + x + 1) * 4) - gray(pixels, (y * width + x - 1) * 4);
            const gy = gray(pixels, ((y + 1) * width + x) * 4) - gray(pixels, ((y - 1) * width + x) * 4);
            const mag = Math.sqrt(gx * gx + gy * gy);
            let angle = Math.atan2(gy, gx);
            if (angle < 0) angle += Math.PI; // unsigned orientation [0, PI]
            const bin = Math.min(numBins - 1, Math.floor(angle / binSize));
            globalHist[bin] += mag;
            totalMag += mag;
        }
    }

    // Normalize
    if (totalMag > 0) {
        for (let i = 0; i < numBins; i++) globalHist[i] /= totalMag;
    }

    // HOG entropy - higher entropy = more uniform = more AI-like
    let hogEntropy = 0;
    for (let i = 0; i < numBins; i++) {
        if (globalHist[i] > 0) hogEntropy -= globalHist[i] * Math.log2(globalHist[i]);
    }
    const maxEntropy = Math.log2(numBins); // ~3.17
    const normalizedEntropy = hogEntropy / maxEntropy;

    // Peak dominance - real images have more dominant orientations
    const maxBin = Math.max(...globalHist);
    const peakDominance = maxBin / (1 / numBins); // ratio to uniform

    let score: number;
    if (normalizedEntropy > 0.97 && peakDominance < 1.1) score = 80;
    else if (normalizedEntropy > 0.94) score = 68;
    else if (normalizedEntropy > 0.88) score = 52;
    else if (normalizedEntropy > 0.80) score = 38;
    else if (normalizedEntropy > 0.70) score = 25;
    else score = 12;

    return {
        name: "HOG Anomaly", nameKey: "signal.hogAnomaly",
        category: "spatial", score, weight: 0.5,
        description: score > 55
            ? "Gradient orientations are unusually uniform â€” typical of AI generation"
            : "Gradient orientations show natural variation â€” consistent with real scenes",
        descriptionKey: score > 55 ? "signal.hog.ai" : "signal.hog.real",
        icon: "âŠ ",
        details: `HOG entropy: ${hogEntropy.toFixed(3)} (norm: ${normalizedEntropy.toFixed(3)}), Peak dominance: ${peakDominance.toFixed(3)}.`,
    };
}