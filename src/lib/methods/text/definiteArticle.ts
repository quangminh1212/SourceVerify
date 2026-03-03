/**
 * Definite Article
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeDefiniteArticle(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Definite Article", nameKey: "signal.definiteArticle", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.definiteArticle.error", icon: "📌" };
    }
    const theCount=(text.match(/\bthe\b/gi)||[]).length;const aCount=(text.match(/\b(a|an)\b/gi)||[]).length;const words=text.split(/\s+/).length;const theR=words>0?theCount/words:0;const ratio=aCount>0?theCount/aCount:theCount;
    let score: number;
    if(theR>0.08)score=64;else if(theR>0.05)score=48;else if(theR<0.02)score=35;else score=44;
    return {
        name: "Definite Article", nameKey: "signal.definiteArticle", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Definite Article pattern suggests AI generation" : "Natural definite article — consistent with human writing",
        descriptionKey: score > 55 ? "signal.definiteArticle.ai" : "signal.definiteArticle.real", icon: "📌",
        details: `The:${theCount}, A/An:${aCount}, Ratio:${theR.toFixed(4)}`,
    };
}
