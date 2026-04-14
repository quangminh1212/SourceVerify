import type { AnalysisMethod } from "../../types";
import { gray } from "../pixelUtils";

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
            category: "pixel", score: 50, weight: 0.4,
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