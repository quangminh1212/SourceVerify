/**
 * Semantic Density Analysis
 * AI text packs information more uniformly than human text.
 * We measure content word density (proportion of nouns, verbs, adjectives)
 * per paragraph/section and analyze its variance.
 *
 * Also uses word length as a proxy for semantic complexity — longer words
 * tend to carry more semantic weight.
 *
 * Reference: Dugan et al. (2023) - Real or Fake Text? Investigating Human Ability to Detect Boundaries
 * Reference: Halliday (1985) - Spoken and Written Language
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSemanticDensity(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Semantic Density", nameKey: "signal.semanticDensity", category: "statistical", score: 50, weight: 0.25, description: "Text too short", descriptionKey: "signal.semanticDensity.error", icon: "💎" };
    }

    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    if (sentences.length < 4) {
        return { name: "Semantic Density", nameKey: "signal.semanticDensity", category: "statistical", score: 50, weight: 0.25, description: "Too few sentences", descriptionKey: "signal.semanticDensity.error", icon: "💎" };
    }

    // Function words (low semantic weight)
    const funcWords = new Set([
        "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
        "have", "has", "had", "do", "does", "did", "will", "would", "could",
        "should", "may", "might", "shall", "can", "to", "of", "in", "for",
        "on", "with", "at", "by", "from", "as", "into", "through", "during",
        "before", "after", "and", "but", "or", "nor", "not", "so", "yet",
        "if", "it", "he", "she", "they", "we", "you", "i", "me", "him",
        "her", "us", "them", "my", "your", "his", "our", "their", "this",
        "that", "these", "those", "what", "which", "who", "when", "where",
        "why", "how", "just", "also", "very", "too", "than", "about",
    ]);

    // Per-sentence semantic density: ratio of content words + avg word length
    const sentDensities: number[] = [];
    const sentAvgWordLen: number[] = [];
    for (const sent of sentences) {
        const words = sent.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(w => w.length > 0);
        if (words.length === 0) continue;

        const contentWords = words.filter(w => !funcWords.has(w));
        const density = contentWords.length / words.length;
        const avgLen = words.reduce((a, w) => a + w.length, 0) / words.length;

        sentDensities.push(density);
        sentAvgWordLen.push(avgLen);
    }

    if (sentDensities.length < 3) {
        return { name: "Semantic Density", nameKey: "signal.semanticDensity", category: "statistical", score: 50, weight: 0.25, description: "Insufficient data", descriptionKey: "signal.semanticDensity.error", icon: "💎" };
    }

    // CV of semantic density
    const densityMean = sentDensities.reduce((a, b) => a + b, 0) / sentDensities.length;
    const densityVar = sentDensities.reduce((a, b) => a + (b - densityMean) ** 2, 0) / sentDensities.length;
    const densityCV = densityMean > 0 ? Math.sqrt(densityVar) / densityMean : 0;

    // CV of average word length
    const wlMean = sentAvgWordLen.reduce((a, b) => a + b, 0) / sentAvgWordLen.length;
    const wlVar = sentAvgWordLen.reduce((a, b) => a + (b - wlMean) ** 2, 0) / sentAvgWordLen.length;
    const wlCV = wlMean > 0 ? Math.sqrt(wlVar) / wlMean : 0;

    const combinedCV = (densityCV + wlCV) / 2;

    // AI: very uniform (low CV), Human: more variation
    let score: number;
    if (combinedCV < 0.06) score = 75;
    else if (combinedCV < 0.1) score = 62;
    else if (combinedCV < 0.15) score = 48;
    else if (combinedCV > 0.3) score = 22;
    else if (combinedCV > 0.22) score = 32;
    else score = 42;

    return {
        name: "Semantic Density", nameKey: "signal.semanticDensity", category: "statistical", score, weight: 0.25,
        description: score > 55 ? "Uniform information density — AI text distributes content too evenly" : "Natural density variation — consistent with human writing patterns",
        descriptionKey: score > 55 ? "signal.semanticDensity.ai" : "signal.semanticDensity.real", icon: "💎",
        details: `Density CV: ${densityCV.toFixed(4)}, WordLen CV: ${wlCV.toFixed(4)}, Combined CV: ${combinedCV.toFixed(4)}, Mean density: ${densityMean.toFixed(3)}.`,
    };
}
