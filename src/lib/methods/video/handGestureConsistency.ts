/**
 * Hand Gesture Consistency
 * AI videos frequently generate malformed hands with wrong finger counts
 * Reference: Yang et al. (2023) - Diffusion-Based Zero-Shot Deepfake Detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeHandGestureConsistency(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Hand Gesture Consistency", nameKey: "signal.handGestureConsistency", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.handGestureConsistency.error", icon: "✋" };
    }
    // Analyze lower frame regions where hands typically appear for texture anomalies
    const handY = Math.floor(h * 0.5), handH = Math.floor(h * 0.4);
    let complexEdge = 0, smoothRegion = 0, total = 0;
    for (let y = handY; y < Math.min(handY + handH, h - 1); y += 2) {
        for (let x = 1; x < w - 1; x += 2) {
            const idx = (y * w + x) * 4;
            const gx = Math.abs(pixels[idx] - pixels[idx + 4]) + Math.abs(pixels[idx + 1] - pixels[idx + 5]);
            const gy = Math.abs(pixels[idx] - pixels[idx + w * 4]) + Math.abs(pixels[idx + 1] - pixels[idx + w * 4 + 1]);
            const gxy = Math.abs(pixels[idx] - pixels[(y + 1) * w * 4 + (x + 1) * 4]) || 0;
            const edgeMag = gx + gy;
            if (edgeMag > 30 && gxy < edgeMag * 0.3) complexEdge++;
            if (edgeMag < 8) smoothRegion++;
            total++;
        }
    }
    const complexRatio = total > 0 ? complexEdge / total : 0;
    const smoothRatio = total > 0 ? smoothRegion / total : 0;

    let score: number;
    if (complexRatio > 0.15 && smoothRatio > 0.5) score = 70;
    else if (complexRatio > 0.1 && smoothRatio > 0.4) score = 58;
    else if (complexRatio < 0.03) score = 32;
    else score = 42;

    return {
        name: "Hand Gesture Consistency", nameKey: "signal.handGestureConsistency", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Complex edge patterns in hand regions — may indicate AI-generated hand artifacts" : "Natural hand region texture — consistent with real video",
        descriptionKey: score > 55 ? "signal.handGestureConsistency.ai" : "signal.handGestureConsistency.real", icon: "✋",
        details: `Complex edges: ${complexRatio.toFixed(3)}, Smooth ratio: ${smoothRatio.toFixed(3)}.`,
    };
}
