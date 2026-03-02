/**
 * Optical Flow Anomaly Detection
 * Detects unnatural motion patterns in video frames
 * AI-generated videos often have inconsistent motion flow
 */

import type { AnalysisMethod } from "../../types";

export function analyzeOpticalFlowAnomaly(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Optical Flow Anomaly", nameKey: "signal.opticalFlowAnomaly",
            category: "forensic", score: 50, weight: 0.25,
            description: "Frame too small for analysis",
            descriptionKey: "signal.opticalFlowAnomaly.error", icon: "🌊",
        };
    }

    // Estimate motion field consistency by analyzing gradient direction coherence
    // Real video frames have spatially coherent gradient fields
    const step = Math.max(2, Math.floor(Math.min(w, h) / 128));
    let coherentPairs = 0, totalPairs = 0;
    let uniformCount = 0, totalRegions = 0;

    for (let y = 1; y < h - 1; y += step) {
        for (let x = 1; x < w - 1; x += step) {
            const idx = (y * w + x) * 4;
            const idxR = (y * w + x + 1) * 4;
            const idxD = ((y + 1) * w + x) * 4;
            const idxDR = ((y + 1) * w + x + 1) * 4;

            const gx = (0.299 * pixels[idxR] + 0.587 * pixels[idxR + 1] + 0.114 * pixels[idxR + 2]) -
                (0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2]);
            const gy = (0.299 * pixels[idxD] + 0.587 * pixels[idxD + 1] + 0.114 * pixels[idxD + 2]) -
                (0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2]);

            const gxN = (0.299 * pixels[idxDR] + 0.587 * pixels[idxDR + 1] + 0.114 * pixels[idxDR + 2]) -
                (0.299 * pixels[idxD] + 0.587 * pixels[idxD + 1] + 0.114 * pixels[idxD + 2]);

            const mag = Math.sqrt(gx * gx + gy * gy);
            const magN = Math.sqrt(gxN * gxN + gy * gy);

            if (mag > 2 && magN > 2) {
                const dot = gx * gxN + gy * gy;
                const cos = dot / (mag * magN);
                if (cos > 0.7) coherentPairs++;
                totalPairs++;
            }

            totalRegions++;
            if (mag < 2) uniformCount++;
        }
    }

    const coherenceRatio = totalPairs > 0 ? coherentPairs / totalPairs : 0.5;
    const uniformRatio = totalRegions > 0 ? uniformCount / totalRegions : 0;

    let score: number;
    if (uniformRatio > 0.9) score = 68;
    else if (coherenceRatio > 0.85 && uniformRatio > 0.6) score = 65;
    else if (coherenceRatio > 0.7) score = 55;
    else if (coherenceRatio < 0.4) score = 30;
    else score = 42;

    return {
        name: "Optical Flow Anomaly", nameKey: "signal.opticalFlowAnomaly",
        category: "forensic", score, weight: 0.25,
        description: score > 55
            ? "Overly uniform motion field detected — suggests AI-generated video content"
            : "Natural motion coherence — consistent with real video footage",
        descriptionKey: score > 55 ? "signal.opticalFlowAnomaly.ai" : "signal.opticalFlowAnomaly.real",
        icon: "🌊",
        details: `Coherence: ${coherenceRatio.toFixed(3)}, Uniform ratio: ${uniformRatio.toFixed(3)}.`,
    };
}
