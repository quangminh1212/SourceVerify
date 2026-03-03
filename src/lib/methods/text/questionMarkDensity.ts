/**
 * Question Density
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeQuestionMarkDensity(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Question Density", nameKey: "signal.questionDensity", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.questionDensity.error", icon: "❓" };
    }
    const questions=(text.match(/\?/g)||[]).length;const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?questions/sents:0;
    let score: number;
    if(ratio<0.02)score=62;else if(ratio<0.1)score=46;else if(ratio>0.3)score=35;else score=44;
    return {
        name: "Question Density", nameKey: "signal.questionDensity", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Question Density pattern suggests AI generation" : "Natural question density — consistent with human writing",
        descriptionKey: score > 55 ? "signal.questionDensity.ai" : "signal.questionDensity.real", icon: "❓",
        details: `Questions: ${questions}, Ratio: ${ratio.toFixed(3)}`,
    };
}
