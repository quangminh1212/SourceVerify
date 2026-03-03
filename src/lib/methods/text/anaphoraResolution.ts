/**
 * Anaphora Resolution
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeAnaphoraResolution(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Anaphora Resolution", nameKey: "signal.anaphoraResolution", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.anaphoraResolution.error", icon: "🔄" };
    }
    const pronouns=['it','they','them','this','that','these','those','he','she','him','her','its','their'];const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0);let pronounStart=0;for(const s of sents){const first=s.trim().split(/\s+/)[0]?.toLowerCase();if(first&&pronouns.includes(first))pronounStart++;}const ratio=sents.length>0?pronounStart/sents.length:0;
    let score: number;
    if(ratio<0.05)score=62;else if(ratio<0.15)score=46;else if(ratio>0.3)score=35;else score=44;
    return {
        name: "Anaphora Resolution", nameKey: "signal.anaphoraResolution", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Low anaphoric reference — suggests structured AI generation" : "Natural anaphora usage — consistent with human writing",
        descriptionKey: score > 55 ? "signal.anaphoraResolution.ai" : "signal.anaphoraResolution.real", icon: "🔄",
        details: `Pronoun-start sents: ${pronounStart}, Ratio: ${ratio.toFixed(3)}`,
    };
}
