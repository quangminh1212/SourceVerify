/**
 * Conjunction Pair
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeConjunctionPair(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Conjunction Pair", nameKey: "signal.conjunctionPair", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.conjunctionPair.error", icon: "🔗" };
    }
    const pairs=(text.match(/\b(either\s*\.{3}\s*or|neither\s*\.{3}\s*nor|both\s*\.{3}\s*and|not only\s*\.{3}\s*but also|whether\s*\.{3}\s*or)\b/gi)||[]).length;const simpleConj=(text.match(/\b(and|but|or|nor|yet|so)\b/gi)||[]).length;const words=text.split(/\s+/).length;const ratio=words>0?simpleConj/words:0;
    let score: number;
    if(ratio>0.04)score=64;else if(ratio>0.02)score=48;else if(ratio<0.01)score=35;else score=44;
    return {
        name: "Conjunction Pair", nameKey: "signal.conjunctionPair", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Conjunction Pair pattern suggests AI generation" : "Natural conjunction pair — consistent with human writing",
        descriptionKey: score > 55 ? "signal.conjunctionPair.ai" : "signal.conjunctionPair.real", icon: "🔗",
        details: `Pairs:${pairs}, Simple:${simpleConj}`,
    };
}
