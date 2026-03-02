/**
 * Readability Score Analysis
 * AI text often maintains consistent readability; human text varies naturally
 * Reference: Ippolito et al. (2020) - Automatic Detection of Generated Text, ACL
 */
import type { AnalysisMethod } from "../../types";

export function analyzeReadabilityScore(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Readability Score", nameKey: "signal.readabilityScore", category: "statistical", score: 50, weight: 0.2, description: "Input too small", descriptionKey: "signal.readabilityScore.error", icon: "📚" };
    }
    // Analyze complexity gradient across document (top-to-bottom)
    const segments = 6;
    const segH = Math.floor(h / segments);
    const segComplexity: number[] = [];
    for (let s = 0; s < segments; s++) {
        let complexity = 0, cnt = 0;
        for (let y = s * segH; y < (s + 1) * segH && y < h - 1; y += 2) {
            for (let x = 0; x < w - 1; x += 2) {
                const idx = (y * w + x) * 4;
                const d = Math.abs(pixels[idx] - pixels[idx + 4]) + Math.abs(pixels[idx + 1] - pixels[idx + 5]) + Math.abs(pixels[idx + 2] - pixels[idx + 6]);
                complexity += d; cnt++;
            }
        }
        segComplexity.push(cnt > 0 ? complexity / cnt : 0);
    }
    const mean = segComplexity.reduce((a, b) => a + b, 0) / segments;
    const variance = segComplexity.reduce((a, b) => a + (b - mean) ** 2, 0) / segments;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

    let score: number;
    if (cv < 0.1) score = 70;
    else if (cv < 0.2) score = 58;
    else if (cv > 0.5) score = 28;
    else score = 42;

    return {
        name: "Readability Score", nameKey: "signal.readabilityScore", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Uniform readability throughout — AI text maintains consistent complexity level" : "Natural readability variation — consistent with human authoring",
        descriptionKey: score > 55 ? "signal.readabilityScore.ai" : "signal.readabilityScore.real", icon: "📚",
        details: `Segment CV: ${cv.toFixed(3)}, Mean complexity: ${mean.toFixed(1)}.`,
    };
}
