import type { AnalysisMethod } from "../../types";
import { gray } from "../pixelUtils";

/**
 * Signal 19: Weber Local Descriptor (WLD)
 * Chen et al. (IEEE PAMI 2010) - Robust local image descriptor
 * Combines differential excitation and gradient orientation
 */
export function analyzeWeberDescriptor(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const excitations: number[] = [];
    const step = Math.max(2, Math.floor(Math.min(width, height) / 200));

    for (let y = 1; y < height - 1; y += step) {
        for (let x = 1; x < width - 1; x += step) {
            const center = gray(pixels, (y * width + x) * 4);
            if (center < 1) continue; // avoid division by zero

            // Sum of differences with 8-neighbors
            let diffSum = 0;
            const neighbors = [
                [-1, -1], [-1, 0], [-1, 1], [0, -1],
                [0, 1], [1, -1], [1, 0], [1, 1]
            ];
            for (const [dy, dx] of neighbors) {
                const neighbor = gray(pixels, ((y + dy) * width + (x + dx)) * 4);
                diffSum += neighbor - center;
            }

            // Weber's differential excitation
            const excitation = Math.atan(diffSum / center);
            excitations.push(Math.abs(excitation));
        }
    }

    if (excitations.length < 10) {
        return {
            name: "Weber Descriptor", nameKey: "signal.weberDescriptor",
            category: "pixel", score: 50, weight: 0.4,
            description: "Insufficient data for Weber analysis",
            descriptionKey: "signal.weber.error", icon: "⊗",
        };
    }

    const mean = excitations.reduce((a, b) => a + b, 0) / excitations.length;
    const variance = excitations.reduce((a, b) => a + (b - mean) ** 2, 0) / excitations.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

    // AI images: lower mean excitation and lower variance (smoother)
    let score: number;
    if (mean < 0.05 && cv < 0.8) score = 82;
    else if (mean < 0.10) score = 70;
    else if (mean < 0.20) score = 55;
    else if (mean < 0.35) score = 40;
    else if (mean < 0.55) score = 25;
    else score = 12;

    return {
        name: "Weber Descriptor", nameKey: "signal.weberDescriptor",
        category: "spatial", score, weight: 0.4,
        description: score > 55
            ? "Weber excitation is unusually low — AI images lack natural intensity transitions"
            : "Weber excitation shows natural variation — consistent with real image detail",
        descriptionKey: score > 55 ? "signal.weber.ai" : "signal.weber.real",
        icon: "⊗",
        details: `Mean excitation: ${mean.toFixed(4)}, CV: ${cv.toFixed(3)}, Samples: ${excitations.length}.`,
    };
}