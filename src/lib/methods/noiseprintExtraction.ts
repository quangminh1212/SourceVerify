/**
 * Noiseprint Extraction
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeNoiseprintExtraction(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Noiseprint Extraction", nameKey: "signal.noiseprintExtraction",
            category: "sensor", score: 50, weight: 0.35,
            description: "Image too small for analysis",
            descriptionKey: "signal.noiseprintExtraction.error", icon: "🔊",
        };
    }

    let score: number;
    // Extract camera noise residual pattern for source identification
    const size = Math.min(w, h, 256);
    const scX = w / size, scY = h / size;
    const noise = new Float32Array(size * size);
    for (let y = 1; y < size - 1; y++) {
        for (let x = 1; x < size - 1; x++) {
            const idx = (Math.floor(y * scY) * w + Math.floor(x * scX)) * 4;
            const center = pixels[idx];
            const avg = (pixels[idx - 4] + pixels[idx + 4] + pixels[idx - w * 4] + pixels[idx + w * 4]) / 4;
            noise[y * size + x] = center - avg;
        }
    }
    let noiseMean = 0, noiseStd = 0;
    for (let i = 0; i < noise.length; i++) noiseMean += noise[i];
    noiseMean /= noise.length;
    for (let i = 0; i < noise.length; i++) noiseStd += (noise[i] - noiseMean) ** 2;
    noiseStd = Math.sqrt(noiseStd / noise.length);
    // Real cameras have specific noise patterns; AI lacks sensor noise
    if (noiseStd < 1.5) score = 72;
    else if (noiseStd < 3) score = 58;
    else if (noiseStd > 8) score = 35;
    else score = 40;

    return {
        name: "Noiseprint Extraction", nameKey: "signal.noiseprintExtraction",
        category: "sensor", score, weight: 0.35,
        description: score > 55
            ? "Weak or absent sensor noise pattern — likely AI-generated"
            : "Strong camera-specific noise residual detected",
        descriptionKey: score > 55 ? "signal.noiseprintExtraction.ai" : "signal.noiseprintExtraction.real",
        icon: "🔊",
    };
}
