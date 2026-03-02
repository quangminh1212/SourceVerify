/**
 * Perplexity Analysis
 * Measures text predictability using character-level n-gram entropy as a proxy for LLM perplexity.
 * AI-generated text tends to be more predictable (lower perplexity) because models optimize
 * for high token probability. We approximate this via character trigram cross-entropy.
 *
 * Reference: Mitchell et al. (2023) - DetectGPT: Zero-Shot Machine-Generated Text Detection
 *            using Probability Curvature, ICML
 * Reference: Gehrmann et al. (2019) - GLTR: Statistical Detection of Generated Text, ACL Demo
 */

import type { AnalysisMethod } from "../../types";

export function analyzePerplexityAnalysis(text: string): AnalysisMethod {
    if (text.length < 100) {
        return {
            name: "Perplexity Analysis", nameKey: "signal.perplexityAnalysis",
            category: "statistical", score: 50, weight: 0.3,
            description: "Text too short for perplexity analysis (min 100 chars)",
            descriptionKey: "signal.perplexityAnalysis.error", icon: "📊",
        };
    }

    const normalized = text.toLowerCase().replace(/\s+/g, " ");

    // Build character trigram model and compute cross-entropy
    const trigramCounts = new Map<string, number>();
    const bigramCounts = new Map<string, number>();
    for (let i = 0; i < normalized.length - 2; i++) {
        const trigram = normalized.substring(i, i + 3);
        const bigram = normalized.substring(i, i + 2);
        trigramCounts.set(trigram, (trigramCounts.get(trigram) || 0) + 1);
        bigramCounts.set(bigram, (bigramCounts.get(bigram) || 0) + 1);
    }

    // Cross-entropy: H = -1/N * Σ log2(P(c_i | c_{i-2}, c_{i-1}))
    let totalLogProb = 0;
    let count = 0;
    for (let i = 2; i < normalized.length; i++) {
        const trigram = normalized.substring(i - 2, i + 1);
        const bigram = normalized.substring(i - 2, i);
        const triCount = trigramCounts.get(trigram) || 0;
        const biCount = bigramCounts.get(bigram) || 0;
        if (biCount > 0 && triCount > 0) {
            totalLogProb += Math.log2(triCount / biCount);
            count++;
        }
    }
    const crossEntropy = count > 0 ? -totalLogProb / count : 0;

    // Analyze local entropy variance across windows
    // AI text has more uniform perplexity; human text varies more
    const windowSize = 50;
    const windowEntropies: number[] = [];
    for (let start = 0; start < normalized.length - windowSize; start += windowSize) {
        const window = normalized.substring(start, start + windowSize);
        // Character unigram entropy for this window
        const charCounts = new Map<string, number>();
        for (const ch of window) charCounts.set(ch, (charCounts.get(ch) || 0) + 1);
        let winEntropy = 0;
        for (const c of charCounts.values()) {
            const p = c / window.length;
            winEntropy -= p * Math.log2(p);
        }
        windowEntropies.push(winEntropy);
    }

    const meanWinE = windowEntropies.length > 0
        ? windowEntropies.reduce((a, b) => a + b, 0) / windowEntropies.length : 0;
    const varWinE = windowEntropies.length > 1
        ? windowEntropies.reduce((a, b) => a + (b - meanWinE) ** 2, 0) / windowEntropies.length : 0;
    const cvWinE = meanWinE > 0 ? Math.sqrt(varWinE) / meanWinE : 0;

    // AI text: low cross-entropy (very predictable) + low variability
    let score: number;
    if (crossEntropy < 2.5 && cvWinE < 0.1) score = 78;
    else if (crossEntropy < 3.0 && cvWinE < 0.15) score = 68;
    else if (crossEntropy < 3.5) score = 58;
    else if (crossEntropy > 4.5 && cvWinE > 0.2) score = 25;
    else if (crossEntropy > 4.0) score = 35;
    else score = 45;

    return {
        name: "Perplexity Analysis", nameKey: "signal.perplexityAnalysis",
        category: "statistical", score, weight: 0.3,
        description: score > 55
            ? "Low perplexity detected — text is highly predictable, consistent with AI generation"
            : "Natural perplexity variation — consistent with human-authored content",
        descriptionKey: score > 55 ? "signal.perplexityAnalysis.ai" : "signal.perplexityAnalysis.real",
        icon: "📊",
        details: `Cross-entropy: ${crossEntropy.toFixed(3)}, Window entropy CV: ${cvWinE.toFixed(3)}, Windows: ${windowEntropies.length}.`,
    };
}
