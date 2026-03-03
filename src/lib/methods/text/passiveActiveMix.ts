/**
 * Passive-Active Mix
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzePassiveActiveMix(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Passive-Active Mix", nameKey: "signal.passiveActiveMix", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.passiveActiveMix.error", icon: "🔀" };
    }
    const passive=(text.match(/\b(was|were|is|are|been|being)\s+(\w+ed|\w+en)\b/gi)||[]).length;const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?passive/sents:0;
    let score: number;
    if(ratio>0.3)score=66;else if(ratio>0.1)score=50;else if(ratio<0.02)score=34;else score=44;
    return {
        name: "Passive-Active Mix", nameKey: "signal.passiveActiveMix", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Passive-Active Mix pattern suggests AI generation" : "Natural passive-active mix — consistent with human writing",
        descriptionKey: score > 55 ? "signal.passiveActiveMix.ai" : "signal.passiveActiveMix.real", icon: "🔀",
        details: `Passive: ${passive}, Ratio: ${ratio.toFixed(3)}`,
    };
}
