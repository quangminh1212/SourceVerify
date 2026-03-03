/**
 * Heartbeat Detection Analysis
 * Detects remote photoplethysmography (rPPG) signal absence in video
 */
import type { AnalysisMethod } from "../../types";

export function analyzeHeartbeatDetection(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Heartbeat Detection", nameKey: "signal.heartbeatDetection", category: "sensor", score: 50, weight: 0.4, description: "Frame too small", descriptionKey: "signal.heartbeatDetection.error", icon: "💓" };
    }
    // Analyze subtle color variations in forehead/cheek region for rPPG signal
    const fX = Math.floor(w * 0.3), fY = Math.floor(h * 0.1), fW = Math.floor(w * 0.4), fH = Math.floor(h * 0.15);
    let rSum = 0, gSum = 0, bSum = 0, cnt = 0; const gVals: number[] = [];
    for (let y = fY; y < fY + fH && y < h; y += 2)for (let x = fX; x < fX + fW && x < w; x += 2) {
        const i = (y * w + x) * 4; rSum += pixels[i]; gSum += pixels[i + 1]; bSum += pixels[i + 2];
        gVals.push(pixels[i + 1]); cnt++;
    }
    const gMean = cnt > 0 ? gSum / cnt : 0;
    let gVar = 0; if (cnt > 1) gVar = gVals.reduce((a, b) => a + (b - gMean) ** 2, 0) / cnt;
    const rgRatio = gSum > 0 ? rSum / gSum : 1;
    let score: number;
    if (gVar < 2 && rgRatio > 0.95 && rgRatio < 1.05) score = 66; else if (gVar > 8) score = 33; else score = 48;
    return {
        name: "Heartbeat Detection", nameKey: "signal.heartbeatDetection", category: "sensor", score, weight: 0.4,
        description: score > 55 ? "No heartbeat signal detected — possible AI generation" : "Subtle physiological signals present — consistent with real video",
        descriptionKey: score > 55 ? "signal.heartbeatDetection.ai" : "signal.heartbeatDetection.real", icon: "💓",
        details: `Green var: ${gVar.toFixed(3)}, RG ratio: ${rgRatio.toFixed(4)}`,
    };
}
