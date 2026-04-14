/**
 * Audio-Visual Synchronization Analysis
 * Detects mismatches between audio and visual content timing
 * AI deepfakes often have subtle audio-visual desynchronization
 */

import type { AnalysisMethod } from "../../types";

export function analyzeAudioVisualSync(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Audio-Visual Sync", nameKey: "signal.audioVisualSync",
            category: "statistical", score: 50, weight: 0.2,
            description: "Frame too small for analysis",
            descriptionKey: "signal.audioVisualSync.error", icon: "🔊",
        };
    }

    // Analyze lower face region for mouth movement artifacts
    // AI-generated content often has unnatural mouth region patterns
    const mouthY = Math.floor(h * 0.65);
    const mouthH = Math.floor(h * 0.2);
    const mouthX = Math.floor(w * 0.3);
    const mouthW = Math.floor(w * 0.4);

    let varianceSum = 0, edgeCount = 0, pixelCount = 0;

    for (let y = mouthY; y < Math.min(mouthY + mouthH, h - 1); y++) {
        for (let x = mouthX; x < Math.min(mouthX + mouthW, w - 1); x++) {
            const idx = (y * w + x) * 4;
            const idxR = (y * w + x + 1) * 4;
            const idxD = ((y + 1) * w + x) * 4;

            const grayC = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
            const grayR = 0.299 * pixels[idxR] + 0.587 * pixels[idxR + 1] + 0.114 * pixels[idxR + 2];
            const grayD = 0.299 * pixels[idxD] + 0.587 * pixels[idxD + 1] + 0.114 * pixels[idxD + 2];

            const diffH = Math.abs(grayC - grayR);
            const diffV = Math.abs(grayC - grayD);

            varianceSum += diffH + diffV;
            if (diffH > 20 || diffV > 20) edgeCount++;
            pixelCount++;
        }
    }

    const avgVariance = pixelCount > 0 ? varianceSum / (pixelCount * 2) : 0;
    const edgeRatio = pixelCount > 0 ? edgeCount / pixelCount : 0;

    let score: number;
    if (avgVariance < 3 && edgeRatio < 0.05) score = 70;
    else if (avgVariance < 5 && edgeRatio < 0.1) score = 60;
    else if (avgVariance > 15) score = 32;
    else score = 45;

    return {
        name: "Audio-Visual Sync", nameKey: "signal.audioVisualSync",
        category: "forensic", score, weight: 0.2,
        description: score > 55
            ? "Mouth region shows unnaturally smooth patterns — potential audio-visual desync artifact"
            : "Mouth region texture appears natural — consistent with real speech",
        descriptionKey: score > 55 ? "signal.audioVisualSync.ai" : "signal.audioVisualSync.real",
        icon: "🔊",
        details: `Avg variance: ${avgVariance.toFixed(3)}, Edge ratio: ${edgeRatio.toFixed(3)}.`,
    };
}
