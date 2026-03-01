import type { AnalysisMethod } from "../types";
import { gray } from "./pixelUtils";

/**
 * Signal 21: Gabor Filter Response Analysis
 * Multi-scale, multi-orientation texture analysis
 * AI images show different Gabor energy distribution patterns
 */
export function analyzeGaborResponse(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const orientations = 4; // 0, 45, 90, 135 degrees
    const energies: number[] = [];
    const step = Math.max(3, Math.floor(Math.min(width, height) / 120));
    const sigma = 2.0;
    const lambda = 8.0;

    for (let o = 0; o < orientations; o++) {
        const theta = (o * Math.PI) / orientations;
        let energy = 0;
        let count = 0;

        for (let y = 3; y < height - 3; y += step) {
            for (let x = 3; x < width - 3; x += step) {
                let realPart = 0;
                // Simplified 5x5 Gabor convolution
                for (let ky = -2; ky <= 2; ky++) {
                    for (let kx = -2; kx <= 2; kx++) {
                        const xPrime = kx * Math.cos(theta) + ky * Math.sin(theta);
                        const yPrime = -kx * Math.sin(theta) + ky * Math.cos(theta);
                        const gaussian = Math.exp(-(xPrime * xPrime + yPrime * yPrime) / (2 * sigma * sigma));
                        const sinusoidal = Math.cos((2 * Math.PI * xPrime) / lambda);
                        const kernel = gaussian * sinusoidal;
                        const g = gray(pixels, ((y + ky) * width + (x + kx)) * 4);
                        realPart += g * kernel;
                    }
                }
                energy += realPart * realPart;
                count++;
            }
        }
        if (count > 0) energies.push(energy / count);
    }

    if (energies.length < orientations) {
        return {
            name: "Gabor Response", nameKey: "signal.gaborResponse",
            category: "frequency", score: 50, weight: 0.5,
            description: "Insufficient data for Gabor analysis",
            descriptionKey: "signal.gabor.error", icon: "â‰ˆ",
        };
    }

    // Compute anisotropy: ratio of max to min Gabor energy
    const maxE = Math.max(...energies);
    const minE = Math.min(...energies);
    const meanE = energies.reduce((a, b) => a + b, 0) / energies.length;
    const anisotropy = minE > 0 ? maxE / minE : maxE > 0 ? 10 : 1;
    const cv = meanE > 0 ? Math.sqrt(energies.reduce((a, b) => a + (b - meanE) ** 2, 0) / energies.length) / meanE : 0;

    // AI images: more isotropic Gabor response (lower anisotropy)
    let score: number;
    if (anisotropy < 1.2 && cv < 0.08) score = 80;
    else if (anisotropy < 1.5) score = 68;
    else if (anisotropy < 2.0) score = 52;
    else if (anisotropy < 3.0) score = 38;
    else if (anisotropy < 5.0) score = 25;
    else score = 12;

    return {
        name: "Gabor Response", nameKey: "signal.gaborResponse",
        category: "frequency", score, weight: 0.5,
        description: score > 55
            ? "Gabor filter shows isotropic response â€” AI images lack directional texture variation"
            : "Gabor filter response shows natural directional variation in texture",
        descriptionKey: score > 55 ? "signal.gabor.ai" : "signal.gabor.real",
        icon: "â‰ˆ",
        details: `Anisotropy: ${anisotropy.toFixed(3)}, CV: ${cv.toFixed(3)}, Energies: ${energies.map(e => e.toFixed(1)).join(", ")}.`,
    };
}
