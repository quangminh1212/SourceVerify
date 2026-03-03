/**
 * Emphasis Pattern
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeEmphasisPattern(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Emphasis Pattern", nameKey: "signal.emphasisPattern", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.emphasisPattern.error", icon: "💪" };
    }
    const caps=(text.match(/\b[A-Z]{2,}\b/g)||[]).length;const bold=(text.match(/\*\*[^*]+\*\*/g)||[]).length;const italic=(text.match(/\*[^*]+\*/g)||[]).length;const emDash=(text.match(/—/g)||[]).length;const total=caps+bold+italic+emDash;const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?total/sents:0;
    let score: number;
    if(ratio<0.01)score=62;else if(ratio<0.08)score=48;else if(ratio>0.2)score=35;else score=44;
    return {
        name: "Emphasis Pattern", nameKey: "signal.emphasisPattern", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Emphasis Pattern pattern suggests AI generation" : "Natural emphasis pattern — consistent with human writing",
        descriptionKey: score > 55 ? "signal.emphasisPattern.ai" : "signal.emphasisPattern.real", icon: "💪",
        details: `Emphasis: ${total}, Ratio: ${ratio.toFixed(3)}`,
    };
}
