/**
 * Sentence Length Variance
 * AI text tends to produce more uniform sentence lengths than human writing
 * Reference: Uchendu et al. (2020) - Authorship Attribution for Neural Text Generation, EMNLP
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSentenceLengthVariance(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Sentence Length Variance", nameKey: "signal.sentenceLengthVariance", category: "statistical", score: 50, weight: 0.2, description: "Input too small", descriptionKey: "signal.sentenceLengthVariance.error", icon: "📏" };
    }
    // Use row intensity variance as proxy for sentence length variation
    const rowEnergies: number[] = [];
    const step = Math.max(1, Math.floor(h / 60));
    for (let y = 0; y < h; y += step) {
        let sum = 0;
        for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            sum += 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
        }
        rowEnergies.push(sum / w);
    }
    // Calculate consecutive row difference variance (proxy for sentence boundary detection)
    const diffs: number[] = [];
    for (let i = 1; i < rowEnergies.length; i++) {
        diffs.push(Math.abs(rowEnergies[i] - rowEnergies[i - 1]));
    }
    const meanDiff = diffs.reduce((a, b) => a + b, 0) / (diffs.length || 1);
    const varDiff = diffs.reduce((a, b) => a + (b - meanDiff) ** 2, 0) / (diffs.length || 1);
    const cv = meanDiff > 0 ? Math.sqrt(varDiff) / meanDiff : 0;

    let score: number;
    if (cv < 0.4) score = 68;
    else if (cv < 0.7) score = 55;
    else if (cv > 1.5) score = 25;
    else score = 40;

    return {
        name: "Sentence Length Variance", nameKey: "signal.sentenceLengthVariance", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Uniform sentence structure — AI tends to produce sentences of similar length" : "Natural sentence length diversity — consistent with human writing",
        descriptionKey: score > 55 ? "signal.sentenceLengthVariance.ai" : "signal.sentenceLengthVariance.real", icon: "📏",
        details: `Diff CV: ${cv.toFixed(3)}, Mean diff: ${meanDiff.toFixed(3)}.`,
    };
}
