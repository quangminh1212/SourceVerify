/**
 * Analogy Simile
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeAnalogySimile(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Analogy Simile", nameKey: "signal.analogySimile", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.analogySimile.error", icon: "🔗" };
    }
    const similes=(text.match(/\b(like|as if|as though|resembles|similar to|just as|compared to)\b/gi)||[]).length;const metaphors=(text.match(/\b(is a|was a|are the|were the|becomes|became)\s+\w+/gi)||[]).length;const total=similes+metaphors;const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?total/sents:0;
    let score: number;
    if(ratio<0.01)score=62;else if(ratio<0.06)score=48;else if(ratio>0.15)score=35;else score=44;
    return {
        name: "Analogy Simile", nameKey: "signal.analogySimile", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Analogy Simile pattern suggests AI generation" : "Natural analogy simile — consistent with human writing",
        descriptionKey: score > 55 ? "signal.analogySimile.ai" : "signal.analogySimile.real", icon: "🔗",
        details: `Similes:${similes}, Metaphors:${metaphors}`,
    };
}
