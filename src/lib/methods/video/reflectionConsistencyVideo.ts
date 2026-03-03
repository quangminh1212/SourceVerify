/**
 * Reflection Consistency Video Analysis
 * Detects unnatural reflections in video frames
 */
import type { AnalysisMethod } from "../../types";

export function analyzeReflectionConsistencyVideo(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Reflection Consistency Video", nameKey: "signal.reflectionConsistencyVideo", category: "pixel", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.reflectionConsistencyVideo.error", icon: "🪞" };
    }
    // Detect specular highlights (very bright spots) and their distribution
    let brightCount = 0, totalPx = 0, brightSum = 0; const brightVals: number[] = [];
    for (let y = 0; y < h; y += 2)for (let x = 0; x < w; x += 2) {
        const i = (y * w + x) * 4; const g = pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
        totalPx++; if (g > 230) { brightCount++; brightSum += g; brightVals.push(g); }
    }
    const brightRatio = brightCount / totalPx; const brightMean = brightVals.length > 0 ? brightSum / brightVals.length : 0;
    let brightVar = 0; if (brightVals.length > 1) brightVar = brightVals.reduce((a, b) => a + (b - brightMean) ** 2, 0) / brightVals.length;
    let score: number;
    if (brightRatio > 0.05 && brightVar < 5) score = 66; else if (brightRatio < 0.005) score = 45; else score = 47;
    return {
        name: "Reflection Consistency Video", nameKey: "signal.reflectionConsistencyVideo", category: "pixel", score, weight: 0.3,
        description: score > 55 ? "Reflection anomaly — possible AI artifact" : "Natural reflection patterns — authentic",
        descriptionKey: score > 55 ? "signal.reflectionConsistencyVideo.ai" : "signal.reflectionConsistencyVideo.real", icon: "🪞",
        details: `Bright ratio: ${brightRatio.toFixed(4)}, Bright var: ${brightVar.toFixed(2)}`,
    };
}
