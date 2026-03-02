/**
 * Entropy Distribution Analysis
 * Character-level entropy distribution differs between AI and human text.
 * AI text has more uniform local entropy across the document because LLMs
 * generate text at a consistent "temperature." Human text shows natural
 * variation in information density.
 *
 * We compute sliding-window character entropy and analyze its distribution
 * (mean, variance, skewness).
 *
 * Reference: Gehrmann et al. (2019) - GLTR: Statistical Detection of Generated Text, ACL Demo
 * Reference: Shannon, C.E. (1948) - A Mathematical Theory of Communication
 */
import type { AnalysisMethod } from "../../types";

export function analyzeEntropyDistribution(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Entropy Distribution", nameKey: "signal.entropyDistribution", category: "statistical", score: 50, weight: 0.25, description: "Text too short", descriptionKey: "signal.entropyDistribution.error", icon: "🎲" };
    }

    // Calculate sliding-window character entropy
    const windowSize = 50;
    const entropies: number[] = [];
    for (let start = 0; start <= text.length - windowSize; start += Math.max(1, Math.floor(windowSize / 2))) {
        const window = text.substring(start, start + windowSize).toLowerCase();
        const charCounts = new Map<string, number>();
        for (const ch of window) charCounts.set(ch, (charCounts.get(ch) || 0) + 1);

        let entropy = 0;
        for (const count of charCounts.values()) {
            const p = count / window.length;
            if (p > 0) entropy -= p * Math.log2(p);
        }
        entropies.push(entropy);
    }

    if (entropies.length < 3) {
        return { name: "Entropy Distribution", nameKey: "signal.entropyDistribution", category: "statistical", score: 50, weight: 0.25, description: "Insufficient data", descriptionKey: "signal.entropyDistribution.error", icon: "🎲" };
    }

    const mean = entropies.reduce((a, b) => a + b, 0) / entropies.length;
    const variance = entropies.reduce((a, b) => a + (b - mean) ** 2, 0) / entropies.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

    // Skewness — human text tends to have more right-skewed entropy
    const stdDev = Math.sqrt(variance);
    const skewness = stdDev > 0
        ? entropies.reduce((a, b) => a + ((b - mean) / stdDev) ** 3, 0) / entropies.length
        : 0;

    // IQR analysis
    const sorted = [...entropies].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;

    // AI: low CV (uniform entropy), low IQR, skewness near 0
    // Human: higher CV, wider IQR, non-zero skewness
    let score: number;
    if (cv < 0.05 && iqr < 0.3) score = 75;
    else if (cv < 0.08 && iqr < 0.5) score = 62;
    else if (cv < 0.12) score = 52;
    else if (cv > 0.2 && iqr > 1.0) score = 22;
    else if (cv > 0.15) score = 32;
    else score = 42;

    return {
        name: "Entropy Distribution", nameKey: "signal.entropyDistribution", category: "statistical", score, weight: 0.25,
        description: score > 55 ? "Uniform entropy distribution — AI-generated content shows less entropy variation" : "Natural entropy variation — consistent with human-created content",
        descriptionKey: score > 55 ? "signal.entropyDistribution.ai" : "signal.entropyDistribution.real", icon: "🎲",
        details: `CV: ${cv.toFixed(3)}, IQR: ${iqr.toFixed(3)}, Skewness: ${skewness.toFixed(3)}, Mean: ${mean.toFixed(3)}, Windows: ${entropies.length}.`,
    };
}
