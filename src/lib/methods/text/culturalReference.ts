/**
 * Cultural Reference
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeCulturalReference(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Cultural Reference", nameKey: "signal.culturalReference", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.culturalReference.error", icon: "🌍" };
    }
    const refs=['lol','btw','tbh','imo','fyi','smh','ngl','idk','omg','bruh','vibe','literally','basically','honestly','apparently','supposedly','allegedly'];let refCount=0;const lower=text.toLowerCase();for(const r of refs){const regex=new RegExp('\\b'+r+'\\b','gi');const matches=lower.match(regex);if(matches)refCount+=matches.length;}const words=text.split(/\s+/).length;const refR=words>0?refCount/words:0;
    let score: number;
    if(refR<0.001)score=64;else if(refR<0.01)score=48;else if(refR>0.03)score=32;else score=44;
    return {
        name: "Cultural Reference", nameKey: "signal.culturalReference", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Lack of cultural references — suggests AI generation" : "Natural cultural references — consistent with human writing",
        descriptionKey: score > 55 ? "signal.culturalReference.ai" : "signal.culturalReference.real", icon: "🌍",
        details: `Cultural refs: ${refCount}, Ratio: ${refR.toFixed(4)}`,
    };
}
