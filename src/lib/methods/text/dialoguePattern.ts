/**
 * Dialogue Pattern
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeDialoguePattern(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Dialogue Pattern", nameKey: "signal.dialoguePattern", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.dialoguePattern.error", icon: "💭" };
    }
    const quotes=(text.match(/"[^"]+"|'[^']+'/g)||[]).length;const saidVerbs=(text.match(/\b(said|asked|replied|answered|whispered|shouted|muttered|exclaimed)\b/gi)||[]).length;const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?(quotes+saidVerbs)/sents:0;
    let score: number;
    if(ratio<0.01)score=58;else if(ratio<0.1)score=46;else if(ratio>0.3)score=38;else score=44;
    return {
        name: "Dialogue Pattern", nameKey: "signal.dialoguePattern", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Minimal dialogue elements — suggests non-narrative AI writing" : "Natural dialogue patterns — consistent with human writing",
        descriptionKey: score > 55 ? "signal.dialoguePattern.ai" : "signal.dialoguePattern.real", icon: "💭",
        details: `Quotes: ${quotes}, Said-verbs: ${saidVerbs}, Ratio: ${ratio.toFixed(3)}`,
    };
}
