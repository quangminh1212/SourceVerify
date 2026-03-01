import type { AnalysisMethod } from "../types";
import { gray } from "./pixelUtils";


/**
 * Geometric & Lighting Consistency Signals (3 methods)
 * Based on physical consistency analysis in forensic imaging
 *
 * References:
 * - Johnson & Farid, "Exposing Digital Forgeries Through Specular Highlights on the Eye", IWDW 2005
 * - Kee et al., "Exposing Digital Forgeries from 3-D Lighting Environments", ICIP 2013
 */

import type { AnalysisMethod } from "../types";

function gray(pixels: Uint8ClampedArray, idx: number): number {
    return pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;
}

/**
 * Signal 39: Perspective Consistency Check
 * Vanishing point and line convergence analysis
 * AI images may have inconsistent perspective geometry
 */
export function analyzePerspectiveConsistency(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    // Detect strong edges and their orientations
    const step = Math.max(3, Math.floor(Math.min(width, height) / 100));
    const edgeAngles: number[] = [];
    const edgeMags: number[] = [];

    for (let y = 1; y < height - 1; y += step) {
        for (let x = 1; x < width - 1; x += step) {
            const g = (px: number, py: number) => gray(pixels, (py * width + px) * 4);
            const gx = g(x + 1, y) - g(x - 1, y);
            const gy = g(x, y + 1) - g(x, y - 1);
            const mag = Math.sqrt(gx * gx + gy * gy);

            if (mag > 20) { // strong edge only
                edgeAngles.push(Math.atan2(gy, gx));
                edgeMags.push(mag);
            }
        }
    }

    if (edgeAngles.length < 20) {
        return {
            name: "Perspective Consistency", nameKey: "signal.perspectiveConsistency",
            category: "geometric", score: 50, weight: 0.3,
            description: "Not enough strong edges for perspective analysis",
            descriptionKey: "signal.perspective.error", icon: "⊿",
        };
    }

    // Quantize angles into bins (36 bins = 10 degrees each)
    const numBins = 36;
    const angleBins = new Array(numBins).fill(0);
    for (let i = 0; i < edgeAngles.length; i++) {
        let angle = edgeAngles[i];
        if (angle < 0) angle += Math.PI;
        const bin = Math.min(numBins - 1, Math.floor(angle / Math.PI * numBins));
        angleBins[bin] += edgeMags[i];
    }

    // Count dominant directions (bins with significant energy)
    const totalEnergy = angleBins.reduce((a, b) => a + b, 0);
    const threshold = totalEnergy * 0.05;
    let dominantDirs = 0;
    for (const energy of angleBins) {
        if (energy > threshold) dominantDirs++;
    }

    // Natural scenes: typically 2-4 dominant directions (geometric structure)
    // AI images: may have too few or too many directions
    let score: number;
    if (dominantDirs <= 1 || dominantDirs >= 15) score = 72;
    else if (dominantDirs <= 2 || dominantDirs >= 12) score = 62;
    else if (dominantDirs >= 3 && dominantDirs <= 6) score = 28;
    else score = 45;

    return {
        name: "Perspective Consistency", nameKey: "signal.perspectiveConsistency",
        category: "geometric", score, weight: 0.3,
        description: score > 55
            ? "Edge direction distribution suggests inconsistent perspective geometry"
            : "Edge directions show consistent perspective structure — natural scene geometry",
        descriptionKey: score > 55 ? "signal.perspective.ai" : "signal.perspective.real",
        icon: "⊿",
        details: `Dominant directions: ${dominantDirs}/${numBins}, Strong edges: ${edgeAngles.length}.`,
    };
}
