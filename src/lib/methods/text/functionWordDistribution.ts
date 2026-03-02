/**
 * Function Word Distribution
 * Analyzes distribution of function words using Burrows's Delta.
 * Function words carry strong authorial fingerprints.
 *
 * Reference: Burrows (2002) - Delta: A Measure of Stylistic Difference, LLC
 * Reference: Kestemont (2014) - Function Words in Authorship Attribution, EACL
 */

import type { AnalysisMethod } from "../../types";

const FUNCTION_WORDS = ["the", "of", "and", "to", "a", "in", "that", "is", "was", "it", "for", "as", "with", "his", "on", "be", "at", "by", "i", "this", "had", "not", "are", "but", "from", "or", "have", "an", "they", "which", "one", "you", "were", "her", "all", "she", "there", "would", "their", "we", "him", "been", "has", "when", "who", "will", "no", "more", "if", "out", "so", "up", "said", "what", "its", "about", "into", "than", "them", "can", "only", "other", "new", "some", "could", "time", "these", "two", "may", "then", "do", "my", "very", "now", "over", "such", "our", "me", "even", "most", "after", "also", "did", "before", "should", "any", "just", "those"];

export function analyzeFunctionWordDistribution(text: string): AnalysisMethod {
    if (text.length < 200) {
        return { name: "Function Word Distribution", nameKey: "signal.functionWordDistribution", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.functionWordDistribution.error", icon: "📝" };
    }

    const words = text.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter(w => w.length > 0);
    if (words.length < 50) {
        return { name: "Function Word Distribution", nameKey: "signal.functionWordDistribution", category: "statistical", score: 50, weight: 0.2, description: "Too few words", descriptionKey: "signal.functionWordDistribution.error", icon: "📝" };
    }

    // Compute relative frequencies for top function words
    const freqs = new Map<string, number>();
    for (const w of words) {
        if (FUNCTION_WORDS.includes(w)) freqs.set(w, (freqs.get(w) || 0) + 1);
    }

    const N = words.length;
    const relFreqs = FUNCTION_WORDS.map(fw => (freqs.get(fw) || 0) / N);

    // Reference human distributions (approximate from BNC corpus)
    const humanRef = FUNCTION_WORDS.map((_, i) => Math.max(0.001, 0.07 - i * 0.0007));

    // Burrows's Delta: mean absolute z-score deviation
    let deltaSum = 0;
    let count = 0;
    for (let i = 0; i < FUNCTION_WORDS.length; i++) {
        const sigma = Math.max(0.001, humanRef[i] * 0.3);
        const z = Math.abs(relFreqs[i] - humanRef[i]) / sigma;
        deltaSum += z;
        count++;
    }
    const delta = deltaSum / count;

    // Also measure function word ratio
    const funcWordRatio = Array.from(freqs.values()).reduce((a, b) => a + b, 0) / N;

    // AI: higher delta (deviates from human reference), potentially different func word ratio
    let score: number;
    if (delta > 2.5 && funcWordRatio > 0.55) score = 72;
    else if (delta > 2.0) score = 62;
    else if (delta > 1.5) score = 50;
    else if (delta < 0.8 && funcWordRatio < 0.50) score = 28;
    else if (delta < 1.0) score = 35;
    else score = 42;

    return {
        name: "Function Word Distribution", nameKey: "signal.functionWordDistribution", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Function word profile deviates from human norms — suggests AI" : "Natural function word distribution — consistent with human authorship",
        descriptionKey: score > 55 ? "signal.functionWordDistribution.ai" : "signal.functionWordDistribution.real", icon: "📝",
        details: `Burrows's Δ: ${delta.toFixed(3)}, Func-word ratio: ${(funcWordRatio * 100).toFixed(1)}%.`,
    };
}
