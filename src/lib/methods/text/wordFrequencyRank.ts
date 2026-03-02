/**
 * Word Frequency Rank Analysis
 * Checks whether word frequency distribution follows Zipf's law.
 * AI text deviates from natural Zipf word frequency distributions because
 * LLMs sample from truncated probability distributions (top-k, nucleus).
 *
 * We compute the Zipf exponent via least-squares fit on log-log rank-frequency
 * and measure the R² goodness of fit.
 *
 * Reference: Jawahar et al. (2020) - Automatic Detection of Machine Generated Text: A Critical Survey
 * Reference: Zipf, G. K. (1949) - Human Behavior and the Principle of Least Effort
 */
import type { AnalysisMethod } from "../../types";

export function analyzeWordFrequencyRank(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Word Frequency Rank", nameKey: "signal.wordFrequencyRank", category: "statistical", score: 50, weight: 0.25, description: "Text too short", descriptionKey: "signal.wordFrequencyRank.error", icon: "📊" };
    }

    const words = text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(w => w.length > 0);
    if (words.length < 50) {
        return { name: "Word Frequency Rank", nameKey: "signal.wordFrequencyRank", category: "statistical", score: 50, weight: 0.25, description: "Too few words", descriptionKey: "signal.wordFrequencyRank.error", icon: "📊" };
    }

    // Word frequency distribution
    const freq = new Map<string, number>();
    for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
    const sortedFreqs = Array.from(freq.values()).sort((a, b) => b - a);

    // Log-log linear regression: log(freq) = -α * log(rank) + C
    // Where α is the Zipf exponent (should be ~1.0 for natural language)
    const n = Math.min(sortedFreqs.length, 50);
    let sumX = 0, sumY = 0, sumXX = 0, sumXY = 0;
    for (let i = 0; i < n; i++) {
        const x = Math.log(i + 1); // log(rank)
        const y = Math.log(sortedFreqs[i]); // log(frequency)
        sumX += x; sumY += y; sumXX += x * x; sumXY += x * y;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const zipfExponent = -slope; // α = -slope

    // R² (goodness of fit)
    const meanY = sumY / n;
    let ssRes = 0, ssTot = 0;
    for (let i = 0; i < n; i++) {
        const x = Math.log(i + 1);
        const y = Math.log(sortedFreqs[i]);
        const predicted = slope * x + intercept;
        ssRes += (y - predicted) ** 2;
        ssTot += (y - meanY) ** 2;
    }
    const rSquared = ssTot > 0 ? 1 - ssRes / ssTot : 0;

    // Vocabulary uniqueness
    const uniqueRatio = freq.size / words.length;

    // Natural text: Zipf exponent ≈ 1.0, high R²
    // AI text: exponent deviates from 1.0, lower R² (less Zipfian)
    const zipfDeviation = Math.abs(zipfExponent - 1.0);

    let score: number;
    if (zipfDeviation > 0.5 && rSquared < 0.85) score = 72;
    else if (zipfDeviation > 0.3 && rSquared < 0.9) score = 60;
    else if (zipfDeviation > 0.2) score = 52;
    else if (zipfDeviation < 0.1 && rSquared > 0.95) score = 22;
    else if (zipfDeviation < 0.15) score = 32;
    else score = 42;

    return {
        name: "Word Frequency Rank", nameKey: "signal.wordFrequencyRank", category: "statistical", score, weight: 0.25,
        description: score > 55 ? "Abnormal frequency ranking — deviates from natural Zipf distribution" : "Natural frequency distribution — follows expected Zipf's law pattern",
        descriptionKey: score > 55 ? "signal.wordFrequencyRank.ai" : "signal.wordFrequencyRank.real", icon: "📊",
        details: `Zipf exponent: ${zipfExponent.toFixed(3)}, R²: ${rSquared.toFixed(3)}, Deviation: ${zipfDeviation.toFixed(3)}, Unique ratio: ${uniqueRatio.toFixed(3)}, Words: ${words.length}.`,
    };
}
