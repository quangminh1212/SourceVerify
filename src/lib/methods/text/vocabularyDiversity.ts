/**
 * Vocabulary Diversity Analysis
 * Measures Type-Token Ratio (TTR), Hapax Legomena ratio, and Yule's K.
 * AI text often shows less lexical variety within local windows because LLMs
 * converge on high-probability tokens.
 *
 * - TTR = unique words / total words (basic diversity)
 * - MATTR = Moving Average TTR (window-based, length-independent)
 * - Hapax ratio = words appearing once / total unique words
 * - Yule's K = measure of vocabulary richness (lower K = more diverse)
 *
 * Reference: Gehrmann et al. (2019) - GLTR: Statistical Detection of Generated Text, ACL
 * Reference: Uchendu et al. (2020) - Authorship Attribution for Neural Text Generation, EMNLP
 */

import type { AnalysisMethod } from "../../types";

export function analyzeVocabularyDiversity(text: string): AnalysisMethod {
    if (text.length < 100) {
        return {
            name: "Vocabulary Diversity", nameKey: "signal.vocabularyDiversity",
            category: "statistical", score: 50, weight: 0.25,
            description: "Text too short for vocabulary analysis",
            descriptionKey: "signal.vocabularyDiversity.error", icon: "📖",
        };
    }

    const words = text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(w => w.length > 0);
    if (words.length < 20) {
        return {
            name: "Vocabulary Diversity", nameKey: "signal.vocabularyDiversity",
            category: "statistical", score: 50, weight: 0.25,
            description: "Too few words for analysis",
            descriptionKey: "signal.vocabularyDiversity.error", icon: "📖",
        };
    }

    // Word frequency distribution
    const freq = new Map<string, number>();
    for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);

    const N = words.length;
    const V = freq.size;
    const ttr = V / N;

    // Hapax legomena ratio (words appearing exactly once)
    let hapax = 0;
    for (const count of freq.values()) if (count === 1) hapax++;
    const hapaxRatio = V > 0 ? hapax / V : 0;

    // MATTR (Moving Average Type-Token Ratio) — window = 50 words
    const mattrWindow = Math.min(50, Math.floor(N / 2));
    let mattrSum = 0;
    let mattrCount = 0;
    for (let start = 0; start <= N - mattrWindow; start++) {
        const windowWords = new Set(words.slice(start, start + mattrWindow));
        mattrSum += windowWords.size / mattrWindow;
        mattrCount++;
    }
    const mattr = mattrCount > 0 ? mattrSum / mattrCount : ttr;

    // Yule's K characteristic
    const spectrum = new Map<number, number>();
    for (const count of freq.values()) spectrum.set(count, (spectrum.get(count) || 0) + 1);
    let sumI2Vi = 0;
    for (const [i, vi] of spectrum.entries()) sumI2Vi += i * i * vi;
    const yulesK = N > 0 ? 10000 * (sumI2Vi - N) / (N * N) : 0;

    // AI text: lower MATTR, lower hapax ratio, higher Yule's K
    // Human text: higher MATTR, more hapax, lower Yule's K
    let score: number;
    if (mattr < 0.6 && hapaxRatio < 0.4 && yulesK > 150) score = 75;
    else if (mattr < 0.65 && hapaxRatio < 0.45) score = 62;
    else if (mattr < 0.7) score = 52;
    else if (mattr > 0.8 && hapaxRatio > 0.6) score = 22;
    else if (mattr > 0.75 && hapaxRatio > 0.5) score = 32;
    else score = 42;

    return {
        name: "Vocabulary Diversity", nameKey: "signal.vocabularyDiversity",
        category: "statistical", score, weight: 0.25,
        description: score > 55
            ? "Low vocabulary diversity — repetitive word choice suggests AI generation"
            : "Rich vocabulary diversity — consistent with naturally written content",
        descriptionKey: score > 55 ? "signal.vocabularyDiversity.ai" : "signal.vocabularyDiversity.real",
        icon: "📖",
        details: `TTR: ${ttr.toFixed(3)}, MATTR: ${mattr.toFixed(3)}, Hapax: ${hapaxRatio.toFixed(3)}, Yule's K: ${yulesK.toFixed(1)}, Words: ${N}.`,
    };
}
