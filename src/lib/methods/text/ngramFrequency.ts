/**
 * N-gram Frequency Analysis
 * Detects abnormal n-gram distribution patterns
 * AI text often has flattened n-gram frequency curves
 * Reference: Lavergne et al. (2008) - Detecting Fake Content with Relative Entropy
 */

import type { AnalysisMethod } from "../../types";

export function analyzeNgramFrequency(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "N-gram Frequency", nameKey: "signal.ngramFrequency",
            category: "statistical", score: 50, weight: 0.25,
            description: "Input too small for analysis",
            descriptionKey: "signal.ngramFrequency.error", icon: "📈",
        };
    }

    // Use pixel-level bigrams (consecutive pixel pair distributions) as proxy
    // Natural content follows Zipf's law; AI content has more uniform distributions
    const bigramCounts = new Map<number, number>();
    const step = Math.max(1, Math.floor(w * h / 5000));
    let totalBigrams = 0;

    for (let i = 0; i < w * h - 1; i += step) {
        const idx = i * 4;
        const g1 = Math.floor((0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2]) / 16);
        const g2 = Math.floor((0.299 * pixels[idx + 4] + 0.587 * pixels[idx + 5] + 0.114 * pixels[idx + 6]) / 16);

        const key = g1 * 16 + g2;
        bigramCounts.set(key, (bigramCounts.get(key) || 0) + 1);
        totalBigrams++;
    }

    if (totalBigrams === 0) {
        return {
            name: "N-gram Frequency", nameKey: "signal.ngramFrequency",
            category: "statistical", score: 50, weight: 0.25,
            description: "Could not compute n-gram distribution",
            descriptionKey: "signal.ngramFrequency.error", icon: "📈",
        };
    }

    // Calculate entropy of bigram distribution
    let bigramEntropy = 0;
    for (const count of bigramCounts.values()) {
        const p = count / totalBigrams;
        if (p > 0) bigramEntropy -= p * Math.log2(p);
    }

    // Max possible entropy for 16x16=256 bigram types
    const maxEntropy = Math.log2(256);
    const normalizedEntropy = bigramEntropy / maxEntropy;

    // Check Zipf's law compliance: sort frequencies and check log-log linearity
    const freqs = Array.from(bigramCounts.values()).sort((a, b) => b - a);
    let zipfDeviation = 0;
    const topN = Math.min(freqs.length, 20);
    for (let i = 1; i < topN; i++) {
        const expected = freqs[0] / (i + 1);
        zipfDeviation += Math.abs(freqs[i] - expected) / Math.max(expected, 1);
    }
    zipfDeviation /= topN;

    let score: number;
    if (normalizedEntropy > 0.85 && zipfDeviation > 0.5) score = 68;
    else if (normalizedEntropy > 0.75) score = 58;
    else if (normalizedEntropy < 0.5) score = 30;
    else score = 42;

    return {
        name: "N-gram Frequency", nameKey: "signal.ngramFrequency",
        category: "statistical", score, weight: 0.25,
        description: score > 55
            ? "Flattened n-gram distribution — deviates from natural Zipf's law pattern"
            : "Natural n-gram frequency distribution — follows expected statistical patterns",
        descriptionKey: score > 55 ? "signal.ngramFrequency.ai" : "signal.ngramFrequency.real",
        icon: "📈",
        details: `Bigram entropy: ${bigramEntropy.toFixed(3)} (${(normalizedEntropy * 100).toFixed(1)}%), Zipf deviation: ${zipfDeviation.toFixed(3)}.`,
    };
}
