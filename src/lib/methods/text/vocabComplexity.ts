/**
 * Vocabulary Complexity
 * Unique algorithm for vocabulary complexity detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeVocabComplexity(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Vocabulary Complexity", nameKey: "signal.vocabComplexity", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.vocabComplexity.error", icon: "🧠" };
    }

    const ws = text.split(/[\s,.;:!?]+/).filter(w => w.length > 0);
    const syllableCount = (w: string) => { w = w.toLowerCase().replace(/[^a-z]/g, ''); if (w.length <= 3) return 1; const c = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').match(/[aeiouy]{1,2}/g); return c ? c.length : 1; };
    const syllables = ws.map(syllableCount);
    const avgSyl = syllables.length > 0 ? syllables.reduce((a, b) => a + b, 0) / syllables.length : 0;
    const complexWords = syllables.filter(s => s >= 3).length;
    const complexRatio = ws.length > 0 ? complexWords / ws.length : 0;
    let score;
    if (complexRatio < 0.1) score = 64; else if (complexRatio < 0.2) score = 52; else if (complexRatio > 0.4) score = 30; else score = 44;
    const details = `Complex ratio: ${complexRatio.toFixed(3)}, Avg syllables: ${avgSyl.toFixed(2)}.`;
    return {
        name: "Vocabulary Complexity", nameKey: "signal.vocabComplexity", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Vocabulary Complexity pattern suggests AI generation" : "Natural vocabulary complexity — consistent with human writing",
        descriptionKey: score > 55 ? "signal.vocabComplexity.ai" : "signal.vocabComplexity.real", icon: "🧠",
        details,
    };
}
