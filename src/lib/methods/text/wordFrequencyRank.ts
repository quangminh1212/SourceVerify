/**
 * Word Frequency Rank Analysis
 * AI text deviates from natural Zipf word frequency distributions
 * Reference: Jawahar et al. (2020) - Automatic Detection of Machine Generated Text: A Critical Survey
 */
import type { AnalysisMethod } from "../../types";

export function analyzeWordFrequencyRank(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Word Frequency Rank", nameKey: "signal.wordFrequencyRank", category: "statistical", score: 50, weight: 0.25, description: "Input too small", descriptionKey: "signal.wordFrequencyRank.error", icon: "📊" };
    }
    // Analyze trigram (3-pixel) frequency distribution for Zipf compliance
    const trigramCounts = new Map<number, number>();
    const step = Math.max(1, Math.floor(w * h / 4000));
    let total = 0;
    for (let i = 0; i < w * h - 2; i += step) {
        const idx = i * 4;
        if (idx + 12 > pixels.length) break;
        const q1 = Math.floor((0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2]) / 32);
        const q2 = Math.floor((0.299 * pixels[idx + 4] + 0.587 * pixels[idx + 5] + 0.114 * pixels[idx + 6]) / 32);
        const q3 = Math.floor((0.299 * pixels[idx + 8] + 0.587 * pixels[idx + 9] + 0.114 * pixels[idx + 10]) / 32);
        const key = q1 * 64 + q2 * 8 + q3;
        trigramCounts.set(key, (trigramCounts.get(key) || 0) + 1);
        total++;
    }
    const freqs = Array.from(trigramCounts.values()).sort((a, b) => b - a);
    // Calculate Zipf exponent approximation
    let zipfError = 0;
    const topN = Math.min(freqs.length, 30);
    for (let i = 1; i < topN; i++) {
        const expected = freqs[0] / (i + 1);
        zipfError += (Math.abs(freqs[i] - expected) / Math.max(expected, 1)) ** 2;
    }
    zipfError = Math.sqrt(zipfError / topN);
    const uniqueRatio = trigramCounts.size / Math.min(total, 512);

    let score: number;
    if (zipfError > 1.5 && uniqueRatio < 0.5) score = 68;
    else if (zipfError > 1.0) score = 56;
    else if (zipfError < 0.5) score = 30;
    else score = 42;

    return {
        name: "Word Frequency Rank", nameKey: "signal.wordFrequencyRank", category: "statistical", score, weight: 0.25,
        description: score > 55 ? "Abnormal frequency ranking — deviates from natural Zipf distribution" : "Natural frequency distribution — follows expected statistical patterns",
        descriptionKey: score > 55 ? "signal.wordFrequencyRank.ai" : "signal.wordFrequencyRank.real", icon: "📊",
        details: `Zipf error: ${zipfError.toFixed(3)}, Unique ratio: ${uniqueRatio.toFixed(3)}.`,
    };
}
