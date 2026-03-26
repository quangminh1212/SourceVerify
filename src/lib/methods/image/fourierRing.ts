/**
 * Fourier Ring Correlation (FRC) Analysis
 * Based on: Van Heel & Schatz (2005) - "Fourier shell correlation threshold criteria"
 * Adapted for image forensics: Measures resolution consistency via radial frequency analysis
 * 
 * Real camera images: smooth, gradual frequency rolloff determined by optics
 * AI-generated images: sharp frequency cutoff from neural network bandwidth limits
 * 
 * Instead of comparing two half-images (traditional FRC), we analyze the
 * radial power spectrum for abrupt frequency cutoffs - a hallmark of
 * AI upscaling and generation artifacts.
 */

import type { AnalysisMethod } from "../../types";
import { gray } from "../pixelUtils";

export function analyzeFourierRing(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return {
            name: "Fourier Ring Correlation", nameKey: "signal.fourierRing",
            category: "frequency", score: 50, weight: 0.3,
            description: "Image too small for analysis",
            descriptionKey: "signal.fourierRing.error", icon: "⭕",
        };
    }

    // Use a square center crop for clean DFT
    const size = Math.min(64, Math.min(w, h));
    const ox = Math.floor((w - size) / 2);
    const oy = Math.floor((h - size) / 2);

    // Extract grayscale center patch
    const patch = new Float64Array(size * size);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            patch[y * size + x] = gray(pixels, ((oy + y) * w + (ox + x)) * 4);
        }
    }

    // Apply Hann window to reduce spectral leakage
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const wy = 0.5 * (1 - Math.cos(2 * Math.PI * y / (size - 1)));
            const wx = 0.5 * (1 - Math.cos(2 * Math.PI * x / (size - 1)));
            patch[y * size + x] *= wy * wx;
        }
    }

    // Row-wise DFT
    const halfSize = Math.floor(size / 2);
    const temp = new Float64Array(size * size * 2); // real, imag interleaved

    for (let y = 0; y < size; y++) {
        for (let k = 0; k < size; k++) {
            let re = 0, im = 0;
            for (let n = 0; n < size; n++) {
                const angle = -2 * Math.PI * k * n / size;
                re += patch[y * size + n] * Math.cos(angle);
                im += patch[y * size + n] * Math.sin(angle);
            }
            temp[(y * size + k) * 2] = re;
            temp[(y * size + k) * 2 + 1] = im;
        }
    }

    // Column-wise DFT → full 2D power spectrum
    const spectrum2D = new Float64Array(size * size);
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

    // Compute azimuthal average (radial power spectrum) - the FRC approach
    const maxR = halfSize;
    const ringPower = new Float64Array(maxR);
    const ringCount = new Float64Array(maxR);

    for (let ky = 0; ky < size; ky++) {
        for (let kx = 0; kx < size; kx++) {
            const dy = ky < halfSize ? ky : ky - size;
            const dx = kx < halfSize ? kx : kx - size;
            const r = Math.floor(Math.sqrt(dy * dy + dx * dx));
            if (r > 0 && r < maxR) {
                ringPower[r] += spectrum2D[ky * size + kx];
                ringCount[r]++;
            }
        }
    }

    // Normalize rings
    for (let r = 1; r < maxR; r++) {
        if (ringCount[r] > 0) ringPower[r] /= ringCount[r];
    }

    // Convert to log scale for analysis
    const logRing: number[] = [];
    for (let r = 1; r < maxR; r++) {
        logRing.push(Math.log10(ringPower[r] + 1));
    }

    if (logRing.length < 5) {
        return {
            name: "Fourier Ring Correlation", nameKey: "signal.fourierRing",
            category: "frequency", score: 50, weight: 0.3,
            description: "Insufficient frequency data",
            descriptionKey: "signal.fourierRing.error", icon: "⭕",
        };
    }

    // Detect sharp frequency cutoff (maximum relative drop between adjacent rings)
    // AI images: abrupt drop. Real images: smooth gradual rolloff
    let maxDrop = 0;
    let maxDropPos = 0;
    for (let i = 1; i < logRing.length; i++) {
        if (logRing[i - 1] > 0.01) {  // avoid division by near-zero
            const drop = (logRing[i - 1] - logRing[i]) / logRing[i - 1];
            if (drop > maxDrop) {
                maxDrop = drop;
                maxDropPos = i;
            }
        }
    }

    // Measure overall smoothness of the radial profile
    // Real optics: smooth monotonic decay. AI: irregular or step-like drops
    let totalVariation = 0;
    for (let i = 1; i < logRing.length; i++) {
        totalVariation += Math.abs(logRing[i] - logRing[i - 1]);
    }
    const avgVariation = totalVariation / (logRing.length - 1);

    // Compute ratio of high-freq power to mid-freq power
    const midIdx = Math.floor(logRing.length / 3);
    const highIdx = Math.floor(logRing.length * 2 / 3);
    const midPower = logRing.slice(0, midIdx).reduce((a, b) => a + b, 0) / midIdx;
    const highPower = logRing.slice(highIdx).reduce((a, b) => a + b, 0) / (logRing.length - highIdx);
    const freqDropoff = midPower > 0.01 ? highPower / midPower : 1;

    let score: number;
    // Sharp cutoff = AI signature
    if (maxDrop > 0.6 && freqDropoff < 0.3) score = 78;
    else if (maxDrop > 0.4 && freqDropoff < 0.5) score = 65;
    else if (maxDrop > 0.3) score = 55;
    else if (maxDrop < 0.15 && freqDropoff > 0.4) score = 25;
    else score = 40;

    return {
        name: "Fourier Ring Correlation", nameKey: "signal.fourierRing",
        category: "frequency", score, weight: 0.3,
        description: score > 55
            ? "Sharp frequency cutoff — AI upscaling or generation artifact"
            : "Smooth frequency falloff — natural image resolution",
        descriptionKey: score > 55 ? "signal.fourierRing.ai" : "signal.fourierRing.real",
        icon: "⭕",
        details: `Max drop: ${maxDrop.toFixed(3)} at ring ${maxDropPos}, Freq dropoff: ${freqDropoff.toFixed(3)}, Avg variation: ${avgVariation.toFixed(4)}.`,
    };
}
