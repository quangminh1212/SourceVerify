import type { AnalysisMethod } from "../types";
import { gray } from "./pixelUtils";


/**
 * Spatial Domain Analysis Signals (6 methods)
 * Based on peer-reviewed research in image forensics
 *
 * References:
 * - Ojala et al., "Multiresolution Gray-Scale and Rotation Invariant Texture Classification with LBP", IEEE PAMI 2002
 * - Dalal & Triggs, "Histograms of Oriented Gradients for Human Detection", CVPR 2005
 * - Haralick et al., "Textural Features for Image Classification", IEEE SMC 1973
 * - Chen et al., "WLD: A Robust Local Image Descriptor", IEEE PAMI 2010
 */

import type { AnalysisMethod } from "../types";

function gray(pixels: Uint8ClampedArray, idx: number): number {
    return pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;
}

/**
 * Signal 14: Local Binary Pattern (LBP) Analysis
 * Ojala et al. (IEEE PAMI 2002) - Texture micro-patterns
 * AI images tend to have less diverse LBP patterns than natural images
 */
export function analyzeLocalBinaryPattern(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const lbpHistogram = new Array(256).fill(0);
    let totalSamples = 0;
    const step = Math.max(2, Math.floor(Math.min(width, height) / 200));

    for (let y = 1; y < height - 1; y += step) {
        for (let x = 1; x < width - 1; x += step) {
            const center = gray(pixels, (y * width + x) * 4);
            let lbp = 0;
            // 8-neighbor LBP
            const neighbors = [
                [-1, -1], [-1, 0], [-1, 1], [0, 1],
                [1, 1], [1, 0], [1, -1], [0, -1]
            ];
            for (let i = 0; i < 8; i++) {
                const ny = y + neighbors[i][0], nx = x + neighbors[i][1];
                const val = gray(pixels, (ny * width + nx) * 4);
                if (val >= center) lbp |= (1 << i);
            }
            lbpHistogram[lbp]++;
            totalSamples++;
        }
    }

    // Calculate LBP uniformity - ratio of uniform patterns (transitions <= 2)
    let uniformCount = 0;
    for (let i = 0; i < 256; i++) {
        let bits = i;
        let transitions = 0;
        for (let b = 0; b < 8; b++) {
            const curr = (bits >> b) & 1;
            const next = (bits >> ((b + 1) % 8)) & 1;
            if (curr !== next) transitions++;
        }
        if (transitions <= 2) uniformCount += lbpHistogram[i];
    }
    const uniformRatio = totalSamples > 0 ? uniformCount / totalSamples : 0;

    // Calculate entropy of LBP distribution
    let lbpEntropy = 0;
    for (let i = 0; i < 256; i++) {
        const p = totalSamples > 0 ? lbpHistogram[i] / totalSamples : 0;
        if (p > 0) lbpEntropy -= p * Math.log2(p);
    }

    // AI images: higher uniform ratio (smoother textures), lower entropy
    let score: number;
    if (uniformRatio > 0.92 && lbpEntropy < 4.5) score = 82;
    else if (uniformRatio > 0.88) score = 70;
    else if (uniformRatio > 0.82) score = 55;
    else if (uniformRatio > 0.75) score = 42;
    else if (uniformRatio > 0.65) score = 28;
    else score = 15;

    return {
        name: "Local Binary Pattern", nameKey: "signal.localBinaryPattern",
        category: "spatial", score, weight: 0.6,
        description: score > 55
            ? "LBP texture patterns lack diversity — characteristic of AI-generated surfaces"
            : "LBP texture shows natural diversity — consistent with real photography",
        descriptionKey: score > 55 ? "signal.lbp.ai" : "signal.lbp.real",
        icon: "⊞",
        details: `Uniform ratio: ${uniformRatio.toFixed(3)}, LBP entropy: ${lbpEntropy.toFixed(2)} bits, Samples: ${totalSamples}.`,
    };
}

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
            const idx = (y * width + x) * 4;
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
            ? "Gradient orientations are unusually uniform — typical of AI generation"
            : "Gradient orientations show natural variation — consistent with real scenes",
        descriptionKey: score > 55 ? "signal.hog.ai" : "signal.hog.real",
        icon: "⊠",
        details: `HOG entropy: ${hogEntropy.toFixed(3)} (norm: ${normalizedEntropy.toFixed(3)}), Peak dominance: ${peakDominance.toFixed(3)}.`,
    };
}
