/**
 * Reflection Consistency
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeReflectionConsistency(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Reflection Consistency", nameKey: "signal.reflectionConsistency",
            category: "forensic", score: 50, weight: 0.25,
            description: "Image too small for analysis",
            descriptionKey: "signal.reflectionConsistency.error", icon: "🪞",
        };
    }

    let score: number;
    // Analyze specular highlight consistency across image
    let highlights = 0, highlightIntensity = 0, totalChecked = 0;
    const step = Math.max(1, Math.floor(w * h / 40000));
    for (let i = 0; i < w * h * 4; i += 4 * step) {
        const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
        const maxC = Math.max(r, g, b);
        const minC = Math.min(r, g, b);
        if (maxC > 240 && (maxC - minC) < 30) {
            highlights++;
            highlightIntensity += maxC;
        }
        totalChecked++;
    }
    const highlightRatio = totalChecked > 0 ? highlights / totalChecked : 0;
    const avgIntensity = highlights > 0 ? highlightIntensity / highlights : 0;
    if (highlightRatio > 0.05 && avgIntensity > 250) score = 35;
    else if (highlightRatio < 0.001) score = 60;
    else if (highlightRatio > 0.02) score = 40;
    else score = 48;

    return {
        name: "Reflection Consistency", nameKey: "signal.reflectionConsistency",
        category: "forensic", score, weight: 0.25,
        description: score > 55
            ? "Unnatural specular patterns — AI-generated reflections lack physical accuracy"
            : "Natural specular highlights — consistent with real light sources",
        descriptionKey: score > 55 ? "signal.reflectionConsistency.ai" : "signal.reflectionConsistency.real",
        icon: "🪞",
    };
}
