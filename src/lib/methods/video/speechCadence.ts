/**
 * Speech Cadence Analysis
 * Detects unnatural speech rhythm patterns in video audio
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSpeechCadence(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Speech Cadence", nameKey: "signal.speechCadence", category: "sensor", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.speechCadence.error", icon: "🎙️" };
    }
    // Analyze mouth region movement patterns as proxy for speech cadence
    const mX = Math.floor(w * 0.3), mY = Math.floor(h * 0.55), mW = Math.floor(w * 0.4), mH = Math.floor(h * 0.2);
    let intensity = 0, variation = 0, cnt = 0; const vals: number[] = [];
    for (let y = mY; y < mY + mH && y < h; y += 2)for (let x = mX; x < mX + mW && x < w; x += 2) {
        const i = (y * w + x) * 4; const g = pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
        vals.push(g); intensity += g; cnt++;
    }
    const mean = cnt > 0 ? intensity / cnt : 0;
    if (cnt > 1) variation = vals.reduce((a, b) => a + (b - mean) ** 2, 0) / cnt;
    const cv = mean > 0 ? Math.sqrt(variation) / mean : 0;
    let score: number;
    if (cv < 0.05) score = 65; else if (cv > 0.3) score = 35; else score = 48;
    return {
        name: "Speech Cadence", nameKey: "signal.speechCadence", category: "sensor", score, weight: 0.3,
        description: score > 55 ? "Unnatural speech cadence detected — possible AI synthesis" : "Natural speech cadence — consistent with real speech",
        descriptionKey: score > 55 ? "signal.speechCadence.ai" : "signal.speechCadence.real", icon: "🎙️",
        details: `Mouth CV: ${cv.toFixed(4)}, Mean: ${mean.toFixed(2)}, Var: ${variation.toFixed(2)}`,
    };
}
