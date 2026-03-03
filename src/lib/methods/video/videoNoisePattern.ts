/**
 * Video Noise Pattern Analysis
 * Detects synthetic noise patterns in video frames
 */
import type { AnalysisMethod } from "../../types";

export function analyzeVideoNoisePattern(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Video Noise Pattern", nameKey: "signal.videoNoisePattern", category: "sensor", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.videoNoisePattern.error", icon: "📡" };
    }
    // Analyze high-frequency noise residual
    let noiseSum = 0, cnt = 0; const noiseDiffs: number[] = [];
    for (let y = 1; y < h - 1; y += 2)for (let x = 1; x < w - 1; x += 2) {
        const i = (y * w + x) * 4;
        const c = pixels[i]; const n = pixels[((y - 1) * w + x) * 4]; const s2 = pixels[((y + 1) * w + x) * 4];
        const e = pixels[(y * w + x + 1) * 4]; const we = pixels[(y * w + x - 1) * 4];
        const pred = (n + s2 + e + we) / 4; const diff = Math.abs(c - pred);
        noiseDiffs.push(diff); noiseSum += diff; cnt++;
    }
    const meanNoise = cnt > 0 ? noiseSum / cnt : 0;
    let noiseVar = 0; if (cnt > 1) noiseVar = noiseDiffs.reduce((a, b) => a + (b - meanNoise) ** 2, 0) / cnt;
    const cv = meanNoise > 0 ? Math.sqrt(noiseVar) / meanNoise : 0;
    let score: number;
    if (meanNoise < 1.5 && cv < 0.5) score = 67; else if (meanNoise > 5 && cv > 1) score = 32; else score = 48;
    return {
        name: "Video Noise Pattern", nameKey: "signal.videoNoisePattern", category: "sensor", score, weight: 0.3,
        description: score > 55 ? "Synthetic noise pattern detected — possible AI generation" : "Natural noise pattern — authentic video",
        descriptionKey: score > 55 ? "signal.videoNoisePattern.ai" : "signal.videoNoisePattern.real", icon: "📡",
        details: `Noise mean: ${meanNoise.toFixed(3)}, CV: ${cv.toFixed(3)}`,
    };
}
