/**
 * Technical Jargon
 * Unique algorithm for technical jargon detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeTechnicalJargon(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Technical Jargon", nameKey: "signal.technicalJargon", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.technicalJargon.error", icon: "🔧" };
    }

    const ws=text.split(/[\s,.;:!?]+/).filter(w=>w.length>0);
    let techCount=0;
    for(const w of ws){if(w.length>10)techCount++;else if(/[A-Z]{2,}/.test(w))techCount++;else if(/\d+/.test(w)&&/[a-zA-Z]/.test(w))techCount++;}
    const ratio=ws.length>0?techCount/ws.length:0;
    let score;
    if(ratio>0.15)score=35;else if(ratio>0.08)score=45;else if(ratio<0.02)score=62;else score=50;
    const details=`Technical ratio: ${ratio.toFixed(4)}, Tech words: ${techCount}/${ws.length}.`;
    return {
        name: "Technical Jargon", nameKey: "signal.technicalJargon", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Technical Jargon pattern suggests AI generation" : "Natural technical jargon — consistent with human writing",
        descriptionKey: score > 55 ? "signal.technicalJargon.ai" : "signal.technicalJargon.real", icon: "🔧",
        details,
    };
}
