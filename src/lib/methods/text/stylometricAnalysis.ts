/**
 * Stylometric Analysis
 * Identifies writing style consistency markers using multiple stylometric features.
 * AI text tends to maintain overly consistent style (avg word length, function word ratio,
 * sentence complexity) across the document.
 *
 * Features extracted (per Kumarage et al.):
 * - Average word length distribution
 * - Function word frequency
 * - Sentence complexity variation (clauses per sentence approximation)
 * - Lexical density (content words / total words)
 *
 * Reference: Kumarage et al. (2023) - Stylometric Detection of AI-Generated Text
 * Reference: Zheng et al. (2006) - A framework for authorship identification, JASIST
 */

import type { AnalysisMethod } from "../../types";

const FUNCTION_WORDS = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "shall", "can", "need", "dare", "ought",
    "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
    "as", "into", "through", "during", "before", "after", "above", "below",
    "between", "out", "off", "over", "under", "again", "further", "then",
    "once", "and", "but", "or", "nor", "not", "so", "yet", "both",
    "either", "neither", "each", "every", "all", "any", "few", "more",
    "most", "other", "some", "such", "no", "only", "own", "same",
    "than", "too", "very", "just", "about", "also", "back", "how",
    "its", "it", "he", "she", "they", "we", "you", "i", "me", "him",
    "her", "us", "them", "my", "your", "his", "our", "their", "this",
    "that", "these", "those", "what", "which", "who", "whom", "whose",
    "when", "where", "why", "if", "because", "although", "while", "since",
]);

export function analyzeStylometricAnalysis(text: string): AnalysisMethod {
    if (text.length < 200) {
        return {
            name: "Stylometric Analysis", nameKey: "signal.stylometricAnalysis",
            category: "statistical", score: 50, weight: 0.3,
            description: "Text too short for stylometric analysis",
            descriptionKey: "signal.stylometricAnalysis.error", icon: "✍",
        };
    }

    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    if (sentences.length < 5) {
        return {
            name: "Stylometric Analysis", nameKey: "signal.stylometricAnalysis",
            category: "statistical", score: 50, weight: 0.3,
            description: "Insufficient sentences for analysis",
            descriptionKey: "signal.stylometricAnalysis.error", icon: "✍",
        };
    }

    // Per-sentence features
    const sentenceFeatures = sentences.map(sent => {
        const words = sent.toLowerCase().split(/\s+/).filter(w => w.length > 0);
        if (words.length === 0) return null;

        const avgWordLen = words.reduce((a, w) => a + w.length, 0) / words.length;
        const funcWordRatio = words.filter(w => FUNCTION_WORDS.has(w)).length / words.length;
        const commaCount = (sent.match(/,/g) || []).length;
        const clauseProxy = commaCount + 1; // approximation of clause count
        const lexicalDensity = words.filter(w => !FUNCTION_WORDS.has(w)).length / words.length;

        return { avgWordLen, funcWordRatio, clauseProxy, lexicalDensity, wordCount: words.length };
    }).filter(f => f !== null);

    if (sentenceFeatures.length < 3) {
        return {
            name: "Stylometric Analysis", nameKey: "signal.stylometricAnalysis",
            category: "statistical", score: 50, weight: 0.3,
            description: "Insufficient valid sentences",
            descriptionKey: "signal.stylometricAnalysis.error", icon: "✍",
        };
    }

    // Calculate CV (coefficient of variation) for each feature
    const computeCV = (values: number[]): number => {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
        return mean > 0 ? Math.sqrt(variance) / mean : 0;
    };

    const cvWordLen = computeCV(sentenceFeatures.map(f => f.avgWordLen));
    const cvFuncWord = computeCV(sentenceFeatures.map(f => f.funcWordRatio));
    const cvLexDensity = computeCV(sentenceFeatures.map(f => f.lexicalDensity));
    const cvSentLen = computeCV(sentenceFeatures.map(f => f.wordCount));

    // Combined style consistency score
    // AI text: all CVs are low (overly consistent)
    // Human text: higher CVs (natural variation)
    const avgCV = (cvWordLen + cvFuncWord + cvLexDensity + cvSentLen) / 4;

    let score: number;
    if (avgCV < 0.12) score = 78;
    else if (avgCV < 0.18) score = 65;
    else if (avgCV < 0.25) score = 52;
    else if (avgCV > 0.45) score = 22;
    else if (avgCV > 0.35) score = 32;
    else score = 42;

    return {
        name: "Stylometric Analysis", nameKey: "signal.stylometricAnalysis",
        category: "statistical", score, weight: 0.3,
        description: score > 55
            ? "Overly consistent writing style — characteristic of AI-generated text"
            : "Natural style variation — consistent with human authorship",
        descriptionKey: score > 55 ? "signal.stylometricAnalysis.ai" : "signal.stylometricAnalysis.real",
        icon: "✍",
        details: `CV word-len: ${cvWordLen.toFixed(3)}, CV func-word: ${cvFuncWord.toFixed(3)}, CV lex-density: ${cvLexDensity.toFixed(3)}, CV sent-len: ${cvSentLen.toFixed(3)}, Avg CV: ${avgCV.toFixed(3)}.`,
    };
}
