/**
 * Conditional Usage
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeConditionalUsage(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Conditional Usage", nameKey: "signal.conditionalUsage", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.conditionalUsage.error", icon: "🔀" };
    }
    const conds=(text.match(/\b(if|unless|provided that|assuming|given that|in case|suppose|whether|when|whenever|as long as)\b/gi)||[]).length;const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?conds/sents:0;
    let score: number;
    if(ratio<0.02)score=62;else if(ratio<0.1)score=48;else if(ratio>0.25)score=35;else score=44;
    return {
        name: "Conditional Usage", nameKey: "signal.conditionalUsage", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Conditional Usage pattern suggests AI generation" : "Natural conditional usage — consistent with human writing",
        descriptionKey: score > 55 ? "signal.conditionalUsage.ai" : "signal.conditionalUsage.real", icon: "🔀",
        details: `Conditionals: ${conds}, Ratio: ${ratio.toFixed(3)}`,
    };
}
