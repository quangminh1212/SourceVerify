/**
 * Signal 7: Benford's Law
 * First-digit distribution of pixel gradients
 */

import type { AnalysisMethod } from "../types";

export function analyzeBenfordsLaw(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const benford = [0, 0.301, 0.176, 0.125, 0.097, 0.079, 0.067, 0.058, 0.051, 0.046];
    const digitCount = new Array(10).fill(0);
    let totalDigits = 0;

    const step = Math.max(1, Math.floor(Math.min(width, height) / 400));

    for (let y = 0; y < height - 1; y += step) {
        for (let x = 0; x < width - 1; x += step) {
            const idx = (y * width + x) * 4;
            const idxR = (y * width + x + 1) * 4;
            const idxD = ((y + 1) * width + x) * 4;

            const mag = Math.abs(pixels[idx] - pixels[idxR]) + Math.abs(pixels[idx + 1] - pixels[idxR + 1]) + Math.abs(pixels[idx + 2] - pixels[idxR + 2])
                + Math.abs(pixels[idx] - pixels[idxD]) + Math.abs(pixels[idx + 1] - pixels[idxD + 1]) + Math.abs(pixels[idx + 2] - pixels[idxD + 2]);

            if (mag > 0) {
                const firstDigit = parseInt(String(mag).charAt(0));
                if (firstDigit >= 1 && firstDigit <= 9) {
                    digitCount[firstDigit]++;
                    totalDigits++;
                }
            }
        }
    }

    let chiSquared = 0;
    if (totalDigits > 0) {
        for (let d = 1; d <= 9; d++) {
            const observed = digitCount[d] / totalDigits;
            chiSquared += ((observed - benford[d]) ** 2) / benford[d];
        }
    }

    let score: number;
    if (chiSquared < 0.01) score = 22;
    else if (chiSquared < 0.03) score = 35;
    else if (chiSquared < 0.08) score = 48;
    else if (chiSquared < 0.15) score = 65;
    else score = 78;

    return {
        name: "Benford's Law", nameKey: "signal.benfordsLaw",
        category: "statistical", score, weight: 0.3,
        description: score > 55
            ? "Pixel gradients deviate from Benford's Law — characteristic of AI generation"
            : "Pixel gradients follow natural statistical distribution",
        descriptionKey: score > 55 ? "signal.benford.ai" : "signal.benford.real",
        icon: "∑",
        details: `Chi-squared: ${chiSquared.toFixed(4)}, Samples: ${totalDigits}. Natural images: χ² < 0.03.`,
    };
}
