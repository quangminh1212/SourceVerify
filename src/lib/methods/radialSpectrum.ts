import type { AnalysisMethod } from "../types";
import { gray } from "./pixelUtils";

/**
 * Signal 24: Radial Power Spectrum Analysis
 * Azimuthally averaged frequency analysis
 * Natural images have characteristic radial frequency profiles
 */
export function analyzeRadialSpectrum(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const size = Math.min(64, Math.min(width, height));
    const ox = Math.floor((width - size) / 2);
    const oy = Math.floor((height - size) / 2);

    // Build grayscale block
    const block = new Float64Array(size * size);
    for (let y = 0; y < size; y++)
        for (let x = 0; x < size; x++)
            block[y * size + x] = gray(pixels, ((oy + y) * width + (ox + x)) * 4);

    // 2D DFT via row-column method (simplified)
    const halfSize = Math.floor(size / 2);
    const spectrum2D = new Float64Array(size * size);

    // Row-wise DFT
    const temp = new Float64Array(size * size * 2); // real, imag interleaved
    for (let y = 0; y < size; y++) {
        for (let k = 0; k < size; k++) {
            let re = 0, im = 0;
            for (let n = 0; n < size; n++) {
                const angle = -2 * Math.PI * k * n / size;
                re += block[y * size + n] * Math.cos(angle);
                im += block[y * size + n] * Math.sin(angle);
            }
            temp[(y * size + k) * 2] = re;
            temp[(y * size + k) * 2 + 1] = im;
        }
    }

    // Column-wise DFT
    for (let x = 0; x < size; x++) {
        for (let k = 0; k < size; k++) {
            let re = 0, im = 0;
            for (let n = 0; n < size; n++) {
                const angle = -2 * Math.PI * k * n / size;
                const cos = Math.cos(angle), sin = Math.sin(angle);
                re += temp[(n * size + x) * 2] * cos - temp[(n * size + x) * 2 + 1] * sin;
                im += temp[(n * size + x) * 2] * sin + temp[(n * size + x) * 2 + 1] * cos;
            }
            spectrum2D[k * size + x] = re * re + im * im;
        }
    }

    // Radial averaging
    const maxR = halfSize;
    const radialPower = new Float64Array(maxR);
    const radialCount = new Float64Array(maxR);

    for (let ky = 0; ky < size; ky++) {
        for (let kx = 0; kx < size; kx++) {
            const dy = ky < halfSize ? ky : ky - size;
            const dx = kx < halfSize ? kx : kx - size;
            const r = Math.floor(Math.sqrt(dy * dy + dx * dx));
            if (r > 0 && r < maxR) {
                radialPower[r] += spectrum2D[ky * size + kx];
                radialCount[r]++;
            }
        }
    }

    // Compute log radial profile
    const logProfile: number[] = [];
    for (let r = 1; r < maxR; r++) {
        if (radialCount[r] > 0) {
            logProfile.push(Math.log10(radialPower[r] / radialCount[r] + 1));
        }
    }

    if (logProfile.length < 5) {
        return {
            name: "Radial Spectrum", nameKey: "signal.radialSpectrum",
            category: "frequency", score: 50, weight: 0.4,
            description: "Insufficient data for radial spectrum analysis",
            descriptionKey: "signal.radial.error", icon: "â—Ž",
        };
    }

    // Check smoothness of radial profile (natural images have smooth falloff)
    let jumpSum = 0;
    for (let i = 1; i < logProfile.length; i++) {
        jumpSum += Math.abs(logProfile[i] - logProfile[i - 1]);
    }
    const avgJump = jumpSum / (logProfile.length - 1);

    // Energy ratio: mid-frequency vs high-frequency
    const midIdx = Math.floor(logProfile.length / 3);
    const highIdx = Math.floor(logProfile.length * 2 / 3);
    const midAvg = logProfile.slice(0, midIdx).reduce((a, b) => a + b, 0) / midIdx || 1;
    const highAvg = logProfile.slice(highIdx).reduce((a, b) => a + b, 0) / (logProfile.length - highIdx) || 1;
    const freqRatio = highAvg / midAvg;

    let score: number;
    if (freqRatio > 0.8 && avgJump < 0.2) score = 78;
    else if (freqRatio > 0.6) score = 65;
    else if (freqRatio > 0.4) score = 50;
    else if (freqRatio > 0.25) score = 35;
    else score = 18;

    return {
        name: "Radial Spectrum", nameKey: "signal.radialSpectrum",
        category: "frequency", score, weight: 0.4,
        description: score > 55
            ? "Radial power spectrum shows atypical frequency distribution â€” potential AI signature"
            : "Radial power spectrum shows natural frequency falloff â€” consistent with camera optics",
        descriptionKey: score > 55 ? "signal.radial.ai" : "signal.radial.real",
        icon: "â—Ž",
        details: `Freq ratio (high/mid): ${freqRatio.toFixed(3)}, Avg jump: ${avgJump.toFixed(3)}.`,
    };
}
