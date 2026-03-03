/**
 * Exclamation Pattern
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeExclamationPattern(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Exclamation Pattern", nameKey: "signal.exclamationPattern", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.exclamationPattern.error", icon: "❗" };
    }
    const exclCount=(text.match(/!/g)||[]).length;const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?exclCount/sents:0;const multiExcl=(text.match(/!{2,}/g)||[]).length;
    let score: number;
    if(ratio<0.01&&multiExcl===0)score=62;else if(ratio<0.1)score=46;else if(ratio>0.3)score=35;else score=44;
    return {
        name: "Exclamation Pattern", nameKey: "signal.exclamationPattern", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Minimal exclamation usage — typical of measured AI writing" : "Natural exclamation patterns — consistent with human writing",
        descriptionKey: score > 55 ? "signal.exclamationPattern.ai" : "signal.exclamationPattern.real", icon: "❗",
        details: `Exclamations: ${exclCount}, Multi: ${multiExcl}, Ratio: ${ratio.toFixed(3)}`,
    };
}
