/**
 * ResNet Feature Analysis
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeResnetClassifier(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "ResNet Feature Analysis", nameKey: "signal.resnetClassifier",
            category: "sensor", score: 50, weight: 0.3,
            description: "Image too small for analysis",
            descriptionKey: "signal.resnetClassifier.error", icon: "🏗️",
        };
    }

    let score: number;
    // Multi-scale feature analysis simulating ResNet-style deep features
    const scales = [2, 4, 8, 16];
    const features: number[] = [];
    for (const scale of scales) {
        const sw = Math.floor(w / scale), sh = Math.floor(h / scale);
        if (sw < 4 || sh < 4) continue;
        let energy = 0, cnt = 0;
        for (let y = 1; y < sh - 1; y++) {
            for (let x = 1; x < sw - 1; x++) {
                const idx = ((y * scale) * w + x * scale) * 4;
                const gx = pixels[idx + 4] - pixels[idx - 4];
                const gy = pixels[idx + w * 4] - pixels[idx - w * 4];
                energy += Math.sqrt(gx * gx + gy * gy);
                cnt++;
            }
        }
        features.push(cnt > 0 ? energy / cnt : 0);
    }
    // Natural images: feature energy decreases smoothly with scale
    let nonMonotonic = 0;
    for (let i = 1; i < features.length; i++) {
        if (features[i] > features[i - 1] * 1.1) nonMonotonic++;
    }
    const ratio = features.length > 1 && features[0] > 0 ? features[features.length - 1] / features[0] : 1;
    if (ratio < 0.3 && nonMonotonic === 0) score = 30;
    else if (nonMonotonic >= 2) score = 70;
    else if (ratio > 0.8) score = 65;
    else score = 45;

    return {
        name: "ResNet Feature Analysis", nameKey: "signal.resnetClassifier",
        category: "sensor", score, weight: 0.3,
        description: score > 55
            ? "Abnormal multi-scale feature progression — AI generation pattern"
            : "Natural multi-scale feature decay — real image characteristics",
        descriptionKey: score > 55 ? "signal.resnetClassifier.ai" : "signal.resnetClassifier.real",
        icon: "🏗️",
    };
}
