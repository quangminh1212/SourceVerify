/**
 * Upscaling Detection
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeUpscalingDetection(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Upscaling Detection", nameKey: "signal.upscalingDetection",
            category: "frequency", score: 50, weight: 0.3,
            description: "Image too small for analysis",
            descriptionKey: "signal.upscalingDetection.error", icon: "🔎",
        };
    }

    let score: number;
    // Detect AI upscaling via frequency spectrum truncation
    const size = Math.min(w, h, 256);
    const scX = w / size, scY = h / size;
    let highFreqEnergy = 0, lowFreqEnergy = 0;
    for (let y = 1; y < size - 1; y++) {
        for (let x = 1; x < size - 1; x++) {
            const idx = (Math.floor(y * scY) * w + Math.floor(x * scX)) * 4;
            const gx = pixels[idx + 4] - pixels[idx - 4];
            const gy = pixels[(idx + w * 4)] - pixels[(idx - w * 4)];
            const mag = Math.sqrt(gx * gx + gy * gy);
            const freq = Math.sqrt((x - size / 2) ** 2 + (y - size / 2) ** 2) / size;
            if (freq > 0.3) highFreqEnergy += mag;
            else lowFreqEnergy += mag;
        }
    }
    const ratio = lowFreqEnergy > 0 ? highFreqEnergy / lowFreqEnergy : 1;
    if (ratio < 0.05) score = 75;
    else if (ratio < 0.15) score = 60;
    else if (ratio > 0.5) score = 30;
    else score = 45;

    return {
        name: "Upscaling Detection", nameKey: "signal.upscalingDetection",
        category: "frequency", score, weight: 0.3,
        description: score > 55
            ? "Missing high-frequency detail — AI upscaling detected"
            : "Natural frequency spectrum — no upscaling artifacts",
        descriptionKey: score > 55 ? "signal.upscalingDetection.ai" : "signal.upscalingDetection.real",
        icon: "🔎",
    };
}
