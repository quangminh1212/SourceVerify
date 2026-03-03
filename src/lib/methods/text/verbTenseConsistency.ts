/**
 * Verb Tense
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeVerbTenseConsistency(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Verb Tense", nameKey: "signal.verbTense", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.verbTense.error", icon: "⏰" };
    }
    const past=(text.match(/\b\w+ed\b/gi)||[]).length;const present=(text.match(/\b(is|are|am|has|have|do|does|goes|comes|makes|takes|gets)\b/gi)||[]).length;const future=(text.match(/\b(will|shall|going to)\b/gi)||[]).length;const total=past+present+future;const dominant=Math.max(past,present,future);const ratio=total>0?dominant/total:0;
    let score: number;
    if(ratio>0.85)score=64;else if(ratio>0.6)score=48;else if(ratio<0.4)score=34;else score=44;
    return {
        name: "Verb Tense", nameKey: "signal.verbTense", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Verb Tense pattern suggests AI generation" : "Natural verb tense — consistent with human writing",
        descriptionKey: score > 55 ? "signal.verbTense.ai" : "signal.verbTense.real", icon: "⏰",
        details: `Past:${past} Present:${present} Future:${future}`,
    };
}
