/**
 * Syntactic Complexity Analysis
 * Measures complexity through parse tree depth proxy and clause density.
 * AI text tends toward syntactically simpler, flatter structures.
 *
 * Reference: Lu (2010) - Automatic Analysis of Syntactic Complexity, IJCL
 * Reference: Herbold et al. (2023) - Human-Written vs ChatGPT-Generated Essays, Scientific Reports
 */

import type { AnalysisMethod } from "../../types";

export function analyzeSyntacticComplexity(text: string): AnalysisMethod {
    if (text.length < 150) {
        return { name: "Syntactic Complexity", nameKey: "signal.syntacticComplexity", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.syntacticComplexity.error", icon: "🌳" };
    }

    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 5);
    if (sentences.length < 5) {
        return { name: "Syntactic Complexity", nameKey: "signal.syntacticComplexity", category: "statistical", score: 50, weight: 0.2, description: "Too few sentences", descriptionKey: "signal.syntacticComplexity.error", icon: "🌳" };
    }

    const SUBORDINATORS = new Set(["because", "although", "though", "while", "whereas", "unless", "until", "since", "if", "when", "where", "after", "before", "whether", "that", "which", "who", "whom", "whose"]);

    const complexityScores: number[] = [];
    for (const sent of sentences) {
        const words = sent.split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;
        const commaCount = (sent.match(/,/g) || []).length;
        const semicolonCount = (sent.match(/;/g) || []).length;
        const colonCount = (sent.match(/:/g) || []).length;

        // Subordination proxy: count subordinating conjunctions
        let subordCount = 0;
        for (const w of words) {
            if (SUBORDINATORS.has(w.toLowerCase().replace(/[^a-z]/g, ""))) subordCount++;
        }

        // Clause density proxy = (commas + semicolons + subord) / words
        const clauseDensity = (commaCount + semicolonCount + subordCount) / (wordCount || 1);

        // T-unit length (words per sentence/T-unit)
        const tUnitLength = wordCount;

        // Depth proxy = subordination + punctuation nesting
        const depthProxy = subordCount + semicolonCount + colonCount;

        complexityScores.push(clauseDensity * 10 + depthProxy + tUnitLength * 0.1);
    }

    const mean = complexityScores.reduce((a, b) => a + b, 0) / complexityScores.length;
    const variance = complexityScores.reduce((a, b) => a + (b - mean) ** 2, 0) / complexityScores.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

    // AI: low mean complexity, low CV (uniform simplicity)
    // Human: higher mean complexity, higher CV (natural variation)
    let score: number;
    if (mean < 1.5 && cv < 0.4) score = 74;
    else if (mean < 2.0 && cv < 0.5) score = 64;
    else if (mean < 2.5) score = 50;
    else if (mean > 3.5 && cv > 0.7) score = 25;
    else if (mean > 3.0) score = 35;
    else score = 42;

    return {
        name: "Syntactic Complexity", nameKey: "signal.syntacticComplexity", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Low syntactic complexity — flat structure suggests AI generation" : "Natural syntactic variation — consistent with human writing complexity",
        descriptionKey: score > 55 ? "signal.syntacticComplexity.ai" : "signal.syntacticComplexity.real", icon: "🌳",
        details: `Mean complexity: ${mean.toFixed(3)}, CV: ${cv.toFixed(3)}, Sentences: ${sentences.length}.`,
    };
}
