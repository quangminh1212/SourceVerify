/**
 * Fourier Ring Correlation
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeFourierRing(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Fourier Ring Correlation", nameKey: "signal.fourierRing",
            category: "frequency", score: 50, weight: 0.3,
            description: "Image too small for analysis",
            descriptionKey: "signal.fourierRing.error", icon: "⭕",
        };
    }

    let score: number;
    // Analyze Fourier ring correlation for resolution consistency
    const size = Math.min(w, h, 128);
    const scX = w / size, scY = h / size;
    const rings = 16;
    const ringEnergy = new Float32Array(rings);
    const ringCount = new Float32Array(rings);
    for (let y = 1; y < size - 1; y++) {
        for (let x = 1; x < size - 1; x++) {
            const idx = (Math.floor(y * scY) * w + Math.floor(x * scX)) * 4;
            const gx = pixels[idx + 4] - pixels[idx - 4];
            const gy = pixels[(idx + w * 4)] - pixels[(idx - w * 4)];
            const mag = Math.sqrt(gx * gx + gy * gy);
            const r = Math.sqrt((x - size / 2) ** 2 + (y - size / 2) ** 2);
            const ring = Math.min(rings - 1, Math.floor(r / (size / 2) * rings));
            ringEnergy[ring] += mag;
            ringCount[ring]++;
        }
    }
    for (let i = 0; i < rings; i++) {
        ringEnergy[i] = ringCount[i] > 0 ? ringEnergy[i] / ringCount[i] : 0;
    }
    // Check for sharp frequency cutoff (AI upscaling artifact)
    let maxDrop = 0;
    for (let i = 1; i < rings; i++) {
        if (ringEnergy[i - 1] > 0) {
            const drop = 1 - ringEnergy[i] / ringEnergy[i - 1];
            maxDrop = Math.max(maxDrop, drop);
        }
    }
    if (maxDrop > 0.7) score = 72;
    else if (maxDrop > 0.5) score = 58;
    else if (maxDrop < 0.2) score = 30;
    else score = 42;

    return {
        name: "Fourier Ring Correlation", nameKey: "signal.fourierRing",
        category: "frequency", score, weight: 0.3,
        description: score > 55
            ? "Sharp frequency cutoff — AI upscaling or generation artifact"
            : "Smooth frequency falloff — natural image resolution",
        descriptionKey: score > 55 ? "signal.fourierRing.ai" : "signal.fourierRing.real",
        icon: "⭕",
    };
}
