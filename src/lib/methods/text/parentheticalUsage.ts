/**
 * Parenthetical Usage
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeParentheticalUsage(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Parenthetical Usage", nameKey: "signal.parentheticalUsage", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.parentheticalUsage.error", icon: "🔗" };
    }
    const parens=(text.match(/\([^)]+\)/g)||[]).length;const dashes=(text.match(/—[^—]+—|--[^-]+--/g)||[]).length;const total=parens+dashes;const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?total/sents:0;
    let score: number;
    if(ratio<0.01)score=62;else if(ratio<0.08)score=46;else if(ratio>0.25)score=35;else score=44;
    return {
        name: "Parenthetical Usage", nameKey: "signal.parentheticalUsage", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Minimal parenthetical use — suggests structured AI writing" : "Natural parenthetical usage — consistent with human writing",
        descriptionKey: score > 55 ? "signal.parentheticalUsage.ai" : "signal.parentheticalUsage.real", icon: "🔗",
        details: `Parentheticals: ${total} (parens:${parens}, dashes:${dashes}), Ratio: ${ratio.toFixed(3)}`,
    };
}
