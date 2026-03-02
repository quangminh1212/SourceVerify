/**
 * Motion Blur Consistency
 * AI-generated videos often lack natural motion blur or have inconsistent blur patterns
 * Reference: Verdoliva (2020) - Media Forensics and DeepFakes, IEEE SPM
 */
import type { AnalysisMethod } from "../../types";

export function analyzeMotionBlurConsistency(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Motion Blur Consistency", nameKey: "signal.motionBlurConsistency", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.motionBlurConsistency.error", icon: "💨" };
    }
    const blockSize = 16;
    const bx = Math.floor(w / blockSize), by = Math.floor(h / blockSize);
    const blurScores: number[] = [];
    for (let j = 0; j < by; j++) {
        for (let i = 0; i < bx; i++) {
            let hDiff = 0, vDiff = 0, cnt = 0;
            for (let y = j * blockSize; y < (j + 1) * blockSize && y < h - 1; y++) {
                for (let x = i * blockSize; x < (i + 1) * blockSize && x < w - 1; x++) {
                    const idx = (y * w + x) * 4;
                    hDiff += Math.abs(pixels[idx] - pixels[idx + 4]);
                    vDiff += Math.abs(pixels[idx] - pixels[idx + w * 4]);
                    cnt++;
                }
            }
            if (cnt > 0) blurScores.push(Math.abs(hDiff - vDiff) / cnt);
        }
    }
    const mean = blurScores.reduce((a, b) => a + b, 0) / (blurScores.length || 1);
    const variance = blurScores.reduce((a, b) => a + (b - mean) ** 2, 0) / (blurScores.length || 1);
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

    let score: number;
    if (cv < 0.3 && mean < 2) score = 70;
    else if (cv < 0.5) score = 58;
    else if (cv > 1.2) score = 28;
    else score = 42;

    return {
        name: "Motion Blur Consistency", nameKey: "signal.motionBlurConsistency", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Uniform blur anisotropy — AI videos often lack natural directional motion blur" : "Natural blur variation — consistent with real camera motion",
        descriptionKey: score > 55 ? "signal.motionBlurConsistency.ai" : "signal.motionBlurConsistency.real", icon: "💨",
        details: `Blur CV: ${cv.toFixed(3)}, Mean anisotropy: ${mean.toFixed(3)}.`,
    };
}
