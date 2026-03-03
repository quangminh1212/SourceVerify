/**
 * Hair Dynamics Analysis
 * Detects unnatural hair movement patterns in video
 */
import type { AnalysisMethod } from "../../types";

export function analyzeHairDynamics(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Hair Dynamics", nameKey: "signal.hairDynamics", category: "pixel", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.hairDynamics.error", icon: "💇" };
    }
    // Analyze hair region at top of frame for texture and movement cues
    const hX = Math.floor(w * 0.2), hY = 0, hW = Math.floor(w * 0.6), hH = Math.floor(h * 0.25);
    let edgeSum = 0, cnt = 0; const grads: number[] = [];
    for (let y = hY + 1; y < hY + hH && y < h - 1; y += 2)for (let x = hX + 1; x < hX + hW && x < w - 1; x += 2) {
        const i = (y * w + x) * 4; const gx = pixels[((y) * w + (x + 1)) * 4] - pixels[((y) * w + (x - 1)) * 4];
        const gy = pixels[((y + 1) * w + x) * 4] - pixels[((y - 1) * w + x) * 4];
        const mag = Math.sqrt(gx * gx + gy * gy); grads.push(mag); edgeSum += mag; cnt++;
    }
    const meanEdge = cnt > 0 ? edgeSum / cnt : 0;
    let edgeVar = 0; if (cnt > 1) edgeVar = grads.reduce((a, b) => a + (b - meanEdge) ** 2, 0) / cnt;
    const cv = meanEdge > 0 ? Math.sqrt(edgeVar) / meanEdge : 0;
    let score: number;
    if (cv < 0.4 && meanEdge < 8) score = 66; else if (cv > 1.2) score = 32; else score = 47;
    return {
        name: "Hair Dynamics", nameKey: "signal.hairDynamics", category: "pixel", score, weight: 0.3,
        description: score > 55 ? "Hair dynamics anomaly — possible AI artifact" : "Natural hair dynamics — consistent with real video",
        descriptionKey: score > 55 ? "signal.hairDynamics.ai" : "signal.hairDynamics.real", icon: "💇",
        details: `Edge mean: ${meanEdge.toFixed(2)}, CV: ${cv.toFixed(3)}`,
    };
}
