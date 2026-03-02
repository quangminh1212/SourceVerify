import type { AnalysisMethod } from "../../types";
import { gray } from "../pixelUtils";

/**
 * Signal 23: Phase Congruency Analysis
 * Morrone & Owens (1987) - Phase-based feature detection
 * Measures alignment of Fourier components at edges
 */
export function analyzePhaseCongruency(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const step = Math.max(3, Math.floor(Math.min(width, height) / 120));
    const phaseValues: number[] = [];

    // Simplified phase congruency using multi-scale gradient analysis
    const scales = [1, 2, 4];
    for (let y = 4; y < height - 4; y += step) {
        for (let x = 4; x < width - 4; x += step) {
            let sumEnergy = 0;
            let sumAmplitude = 0;

            for (const s of scales) {
                const left = gray(pixels, (y * width + (x - s)) * 4);
                const right = gray(pixels, (y * width + (x + s)) * 4);
                const up = gray(pixels, ((y - s) * width + x) * 4);
                const down = gray(pixels, ((y + s) * width + x) * 4);

                const ex = right - left;
                const ey = down - up;
                const amplitude = Math.sqrt(ex * ex + ey * ey);
                const center = gray(pixels, (y * width + x) * 4);
                const energy = Math.abs(2 * center - left - right) + Math.abs(2 * center - up - down);

                sumEnergy += energy;
                sumAmplitude += amplitude;
            }

            if (sumAmplitude > 0) {
                phaseValues.push(sumEnergy / sumAmplitude);
            }
        }
    }

    if (phaseValues.length < 10) {
        return {
            name: "Phase Congruency", nameKey: "signal.phaseCongruency",
            category: "frequency", score: 50, weight: 0.4,
            description: "Insufficient data for phase congruency analysis",
            descriptionKey: "signal.phase.error", icon: "âˆ ",
        };
    }

    const mean = phaseValues.reduce((a, b) => a + b, 0) / phaseValues.length;
    const variance = phaseValues.reduce((a, b) => a + (b - mean) ** 2, 0) / phaseValues.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

    // AI images: more uniform phase congruency (lower CV)
    let score: number;
    if (cv < 0.25) score = 80;
    else if (cv < 0.40) score = 65;
    else if (cv < 0.60) score = 50;
    else if (cv < 0.85) score = 35;
    else score = 18;

    return {
        name: "Phase Congruency", nameKey: "signal.phaseCongruency",
        category: "frequency", score, weight: 0.4,
        description: score > 55
            ? "Phase congruency is overly uniform â€” AI images have artificial edge structure"
            : "Phase congruency varies naturally â€” consistent with real scene geometry",
        descriptionKey: score > 55 ? "signal.phase.ai" : "signal.phase.real",
        icon: "âˆ ",
        details: `Mean PC: ${mean.toFixed(3)}, CV: ${cv.toFixed(3)}, Samples: ${phaseValues.length}.`,
    };
}
