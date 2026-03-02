import type { AnalysisMethod } from "../../types";
import { gray } from "../pixelUtils";

/**
 * Signal 22: Power Spectral Density (PSD) Slope
 * Field (JOSA 1987) - Natural images follow 1/f^Î² power law
 * Î² â‰ˆ 2 for natural images, deviations indicate AI generation
 */
export function analyzePowerSpectralDensity(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const size = Math.min(128, Math.min(width, height));
    const ox = Math.floor((width - size) / 2);
    const oy = Math.floor((height - size) / 2);

    // Extract grayscale patch
    const patch = new Float64Array(size * size);
    for (let y = 0; y < size; y++)
        for (let x = 0; x < size; x++)
            patch[y * size + x] = gray(pixels, ((oy + y) * width + (ox + x)) * 4);

    // Compute 1D row-wise DFT and average power spectrum
    const halfSize = Math.floor(size / 2);
    const power = new Float64Array(halfSize + 1);
    for (let row = 0; row < size; row++) {
        for (let k = 0; k <= halfSize; k++) {
            let re = 0, im = 0;
            for (let n = 0; n < size; n++) {
                const angle = -2 * Math.PI * k * n / size;
                re += patch[row * size + n] * Math.cos(angle);
                im += patch[row * size + n] * Math.sin(angle);
            }
            power[k] += (re * re + im * im) / size;
        }
    }
    for (let k = 0; k <= halfSize; k++) power[k] /= size;

    // Linear regression on log-log scale to find slope Î²
    const logF: number[] = [], logP: number[] = [];
    for (let k = 1; k <= halfSize; k++) {
        if (power[k] > 0) {
            logF.push(Math.log10(k));
            logP.push(Math.log10(power[k]));
        }
    }

    let beta = 2.0; // default
    if (logF.length > 5) {
        const n = logF.length;
        const sumX = logF.reduce((a, b) => a + b, 0);
        const sumY = logP.reduce((a, b) => a + b, 0);
        const sumXY = logF.reduce((a, b, i) => a + b * logP[i], 0);
        const sumX2 = logF.reduce((a, b) => a + b * b, 0);
        const denom = n * sumX2 - sumX * sumX;
        beta = Math.abs(denom) > 1e-10 ? -(n * sumXY - sumX * sumY) / denom : 2.0;
    }

    // Natural images: Î² â‰ˆ 1.5-2.5, AI images may have different slopes
    let score: number;
    if (beta < 1.0 || beta > 3.5) score = 78;
    else if (beta < 1.3 || beta > 3.0) score = 65;
    else if (beta < 1.5 || beta > 2.8) score = 52;
    else if (beta >= 1.8 && beta <= 2.2) score = 22;
    else score = 38;

    return {
        name: "PSD Slope Analysis", nameKey: "signal.psdSlope",
        category: "frequency", score, weight: 0.5,
        description: score > 55
            ? "Power spectral density deviates from natural 1/fÂ² law â€” potential AI generation"
            : "Power spectral density follows natural 1/fÂ² power law â€” consistent with real images",
        descriptionKey: score > 55 ? "signal.psd.ai" : "signal.psd.real",
        icon: "âˆ¿",
        details: `PSD slope Î²: ${beta.toFixed(3)} (natural range: 1.5-2.5).`,
    };
}
