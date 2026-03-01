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

/**
 * Signal 40: Lighting Direction Consistency
 * Johnson & Farid (2005) - Analyzing light source direction consistency
 * AI images may have physically impossible lighting
 */
export function analyzeLightingConsistency(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    // Estimate local lighting direction from intensity gradients across regions
    const regionSize = Math.min(64, Math.floor(Math.min(width, height) / 4));
    const positions = [
        [0, 0], [width - regionSize, 0],
        [0, height - regionSize], [width - regionSize, height - regionSize],
        [Math.floor(width / 2 - regionSize / 2), Math.floor(height / 2 - regionSize / 2)],
        [Math.floor(width / 4), Math.floor(height / 4)],
        [Math.floor(width * 3 / 4 - regionSize), Math.floor(height * 3 / 4 - regionSize)],
    ];

    const lightDirections: number[] = [];

    for (const [sx, sy] of positions) {
        let sumGx = 0, sumGy = 0, count = 0;
        for (let y = sy + 1; y < sy + regionSize - 1; y += 2) {
            for (let x = sx + 1; x < sx + regionSize - 1; x += 2) {
                if (x >= width - 1 || y >= height - 1) continue;
                const gx = gray(pixels, (y * width + x + 1) * 4) - gray(pixels, (y * width + x - 1) * 4);
                const gy = gray(pixels, ((y + 1) * width + x) * 4) - gray(pixels, ((y - 1) * width + x) * 4);
                sumGx += gx;
                sumGy += gy;
                count++;
            }
        }
        if (count > 0) {
            lightDirections.push(Math.atan2(sumGy / count, sumGx / count));
        }
    }

    if (lightDirections.length < 3) {
        return {
            name: "Lighting Consistency", nameKey: "signal.lightingConsistency",
            category: "geometric", score: 50, weight: 0.4,
            description: "Not enough regions for lighting analysis",
            descriptionKey: "signal.lighting.error", icon: "☼",
        };
    }

    // Calculate circular variance of light directions
    let sumCos = 0, sumSin = 0;
    for (const dir of lightDirections) {
        sumCos += Math.cos(dir);
        sumSin += Math.sin(dir);
    }
    const R = Math.sqrt(sumCos * sumCos + sumSin * sumSin) / lightDirections.length;
    const circularVariance = 1 - R; // 0 = all same direction, 1 = uniform distribution

    // Natural photos: consistent lighting direction (low circular variance)
    // AI images: may have inconsistent lighting (higher variance)
    let score: number;
    if (circularVariance > 0.7) score = 78;
    else if (circularVariance > 0.5) score = 65;
    else if (circularVariance > 0.35) score = 52;
    else if (circularVariance > 0.2) score = 38;
    else score = 20;

    return {
        name: "Lighting Consistency", nameKey: "signal.lightingConsistency",
        category: "geometric", score, weight: 0.4,
        description: score > 55
            ? "Lighting direction varies significantly across regions — physically inconsistent"
            : "Lighting direction is consistent across regions — natural illumination pattern",
        descriptionKey: score > 55 ? "signal.lighting.ai" : "signal.lighting.real",
        icon: "☼",
        details: `Circular variance: ${circularVariance.toFixed(3)}, Resultant length R: ${R.toFixed(3)}, Regions: ${lightDirections.length}.`,
    };
}
