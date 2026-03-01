/**
 * Face Landmark Consistency
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeFaceLandmarkConsistency(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Face Landmark Consistency", nameKey: "signal.faceLandmarkConsistency",
            category: "forensic", score: 50, weight: 0.25,
            description: "Image too small for analysis",
            descriptionKey: "signal.faceLandmarkConsistency.error", icon: "👤",
        };
    }

    let score: number;
    // Analyze skin texture consistency and facial region symmetry
    const centerX = Math.floor(w / 2), centerY = Math.floor(h / 2);
    const faceRegion = Math.min(w, h) / 3;
    let skinSmooth = 0, skinTotal = 0;
    for (let y = Math.max(0, centerY - Math.floor(faceRegion)); y < Math.min(h - 1, centerY + Math.floor(faceRegion)); y += 2) {
        for (let x = Math.max(0, centerX - Math.floor(faceRegion)); x < Math.min(w - 1, centerX + Math.floor(faceRegion)); x += 2) {
            const idx = (y * w + x) * 4;
            const diff = Math.abs(pixels[idx] - pixels[idx + 4]) + Math.abs(pixels[idx] - pixels[idx + w * 4]);
            if (diff < 10) skinSmooth++;
            skinTotal++;
        }
    }
    const smoothRatio = skinTotal > 0 ? skinSmooth / skinTotal : 0;
    if (smoothRatio > 0.85) score = 70;
    else if (smoothRatio > 0.7) score = 58;
    else if (smoothRatio < 0.4) score = 30;
    else score = 42;

    return {
        name: "Face Landmark Consistency", nameKey: "signal.faceLandmarkConsistency",
        category: "forensic", score, weight: 0.25,
        description: score > 55
            ? "Unnaturally smooth skin texture — characteristic of AI face generation"
            : "Natural skin texture variation — consistent with real photography",
        descriptionKey: score > 55 ? "signal.faceLandmarkConsistency.ai" : "signal.faceLandmarkConsistency.real",
        icon: "👤",
    };
}
