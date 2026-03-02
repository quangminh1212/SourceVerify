/**
 * N-gram Frequency Analysis
 * Detects abnormal word/character n-gram distributions.
 * AI text often has flattened n-gram frequency curves compared to natural Zipf distribution.
 * We compute character bigram and word bigram frequencies, then check Zipf compliance
 * and relative entropy (KL-divergence proxy).
 *
 * Reference: Lavergne et al. (2008) - Detecting Fake Content with Relative Entropy
 * Reference: Zipf, G. K. (1949) - Human Behavior and the Principle of Least Effort
 */

import type { AnalysisMethod } from "../../types";

export function analyzeNgramFrequency(text: string): AnalysisMethod {
    if (text.length < 100) {
        return {
            name: "N-gram Frequency", nameKey: "signal.ngramFrequency",
            category: "statistical", score: 50, weight: 0.25,
            description: "Text too short for n-gram analysis",
            descriptionKey: "signal.ngramFrequency.error", icon: "📈",
        };
    }

    const normalized = text.toLowerCase();
    const words = normalized.replace(/[^\w\s]/g, "").split(/\s+/).filter(w => w.length > 0);

    // Character bigram distribution
    const charBigrams = new Map<string, number>();
    for (let i = 0; i < normalized.length - 1; i++) {
        const bg = normalized.substring(i, i + 2);
        charBigrams.set(bg, (charBigrams.get(bg) || 0) + 1);
    }

    // Word bigram distribution
    const wordBigrams = new Map<string, number>();
    for (let i = 0; i < words.length - 1; i++) {
        const bg = words[i] + " " + words[i + 1];
        wordBigrams.set(bg, (wordBigrams.get(bg) || 0) + 1);
    }

    // Check Zipf compliance for word bigrams
    const wordBiFreqs = Array.from(wordBigrams.values()).sort((a, b) => b - a);
    let zipfDeviation = 0;
    const topN = Math.min(wordBiFreqs.length, 20);
    if (topN > 1 && wordBiFreqs[0] > 0) {
        for (let i = 1; i < topN; i++) {
            const expected = wordBiFreqs[0] / (i + 1);
            zipfDeviation += Math.abs(wordBiFreqs[i] - expected) / Math.max(expected, 1);
        }
        zipfDeviation /= (topN - 1);
    }

    // Character bigram entropy
    const totalCharBi = Array.from(charBigrams.values()).reduce((a, b) => a + b, 0);
    let charBiEntropy = 0;
    for (const count of charBigrams.values()) {
        const p = count / totalCharBi;
        if (p > 0) charBiEntropy -= p * Math.log2(p);
    }
    // Normalize by max possible entropy
    const maxCharBiEntropy = Math.log2(Math.min(charBigrams.size, 676)); // 26*26 max
    const normalizedEntropy = maxCharBiEntropy > 0 ? charBiEntropy / maxCharBiEntropy : 0;

    // AI text: higher normalized entropy (flatter distribution), higher Zipf deviation
    // Natural text: follows Zipf's law more closely
    let score: number;
    if (normalizedEntropy > 0.92 && zipfDeviation > 1.5) score = 72;
    else if (normalizedEntropy > 0.88 && zipfDeviation > 1.0) score = 62;
    else if (normalizedEntropy > 0.85) score = 52;
    else if (normalizedEntropy < 0.75 && zipfDeviation < 0.5) score = 25;
    else if (normalizedEntropy < 0.8) score = 35;
    else score = 42;

    return {
        name: "N-gram Frequency", nameKey: "signal.ngramFrequency",
        category: "statistical", score, weight: 0.25,
        description: score > 55
            ? "Flattened n-gram distribution — deviates from natural Zipf's law pattern"
            : "Natural n-gram frequency distribution — follows expected statistical patterns",
        descriptionKey: score > 55 ? "signal.ngramFrequency.ai" : "signal.ngramFrequency.real",
        icon: "📈",
        details: `Char bigram entropy: ${charBiEntropy.toFixed(3)} (${(normalizedEntropy * 100).toFixed(1)}%), Zipf deviation: ${zipfDeviation.toFixed(3)}, Word bigrams: ${wordBigrams.size}.`,
    };
}
