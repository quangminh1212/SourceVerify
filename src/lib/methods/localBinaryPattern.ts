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
