/**
 * Lip Sync Analysis
 * Detects lip movement inconsistencies in deepfake videos
 * AI-generated lip movements often lack natural micro-textures
 */

import type { AnalysisMethod } from "../../types";

export function analyzeLipSyncAnalysis(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Lip Sync Analysis", nameKey: "signal.lipSyncAnalysis",
            category: "forensic", score: 50, weight: 0.25,
            description: "Frame too small for analysis",
            descriptionKey: "signal.lipSyncAnalysis.error", icon: "👄",
        };
    }

    // Focus on lower-center face region for lip area analysis
    const lipY = Math.floor(h * 0.6);
    const lipH = Math.floor(h * 0.15);
    const lipX = Math.floor(w * 0.35);
    const lipW = Math.floor(w * 0.3);

    let textureVariance = 0, skinTone = 0, totalPixels = 0;
    let rSum = 0, gSum = 0, bSum = 0;

    for (let y = lipY; y < Math.min(lipY + lipH, h - 1); y += 2) {
        for (let x = lipX; x < Math.min(lipX + lipW, w - 1); x += 2) {
            const idx = (y * w + x) * 4;
            const idxR = (y * w + x + 1) * 4;

            const diff = Math.abs(pixels[idx] - pixels[idxR]) +
                Math.abs(pixels[idx + 1] - pixels[idxR + 1]) +
                Math.abs(pixels[idx + 2] - pixels[idxR + 2]);

            textureVariance += diff;
            rSum += pixels[idx];
            gSum += pixels[idx + 1];
            bSum += pixels[idx + 2];
            totalPixels++;
        }
    }

    if (totalPixels === 0) {
        return {
            name: "Lip Sync Analysis", nameKey: "signal.lipSyncAnalysis",
            category: "forensic", score: 50, weight: 0.25,
            description: "Could not analyze lip region",
            descriptionKey: "signal.lipSyncAnalysis.error", icon: "👄",
        };
    }

    const avgTexture = textureVariance / (totalPixels * 3);
    const avgR = rSum / totalPixels;
    const avgG = gSum / totalPixels;
    // Check if region has skin-like tones (reddish)
    skinTone = (avgR > avgG && avgR > 80) ? 1 : 0;

    let score: number;
    if (skinTone > 0 && avgTexture < 3) score = 72;
    else if (skinTone > 0 && avgTexture < 6) score = 58;
    else if (avgTexture > 15) score = 30;
    else score = 42;

    return {
        name: "Lip Sync Analysis", nameKey: "signal.lipSyncAnalysis",
        category: "forensic", score, weight: 0.25,
        description: score > 55
            ? "Lip region shows unnaturally smooth texture — potential deepfake lip sync"
            : "Lip region texture appears natural — consistent with real footage",
        descriptionKey: score > 55 ? "signal.lipSyncAnalysis.ai" : "signal.lipSyncAnalysis.real",
        icon: "👄",
        details: `Avg texture: ${avgTexture.toFixed(3)}, Skin tone detected: ${skinTone > 0 ? "yes" : "no"}.`,
    };
}
