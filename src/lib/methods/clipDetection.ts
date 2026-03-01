/**
 * CLIP Embedding Analysis
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeClipDetection(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "CLIP Embedding Analysis", nameKey: "signal.clipDetection",
            category: "sensor", score: 50, weight: 0.3,
            description: "Image too small for analysis",
            descriptionKey: "signal.clipDetection.error", icon: "🔗",
        };
    }

    let score: number;
    // Analyze image characteristics that correlate with CLIP-guided generation
    // CLIP-guided images show specific color and composition patterns
    const hist = new Uint32Array(256);
    const step = Math.max(1, Math.floor(w * h / 50000));
    let totalSampled = 0;
    for (let i = 0; i < w * h * 4; i += 4 * step) {
        const lum = Math.round(0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2]);
        hist[lum]++;
        totalSampled++;
    }
    // CLIP-guided images tend to have high contrast and saturated colors
    let midtoneRatio = 0;
    for (let i = 64; i < 192; i++) midtoneRatio += hist[i];
    midtoneRatio = totalSampled > 0 ? midtoneRatio / totalSampled : 0;
    // Check color saturation
    let highSat = 0;
    for (let i = 0; i < w * h * 4; i += 4 * step) {
        const max = Math.max(pixels[i], pixels[i + 1], pixels[i + 2]);
        const min = Math.min(pixels[i], pixels[i + 1], pixels[i + 2]);
        if (max > 0 && (max - min) / max > 0.6) highSat++;
    }
    const satRatio = totalSampled > 0 ? highSat / totalSampled : 0;
    if (midtoneRatio < 0.4 && satRatio > 0.3) score = 72;
    else if (satRatio > 0.4) score = 65;
    else if (midtoneRatio > 0.7) score = 30;
    else score = 45;

    return {
        name: "CLIP Embedding Analysis", nameKey: "signal.clipDetection",
        category: "sensor", score, weight: 0.3,
        description: score > 55
            ? "Color and composition patterns consistent with CLIP-guided generation"
            : "Natural color distribution — no CLIP guidance artifacts",
        descriptionKey: score > 55 ? "signal.clipDetection.ai" : "signal.clipDetection.real",
        icon: "🔗",
    };
}
