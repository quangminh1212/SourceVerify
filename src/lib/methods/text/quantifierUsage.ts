/**
 * Quantifier Usage
 * Unique algorithm for quantifier usage detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeQuantifierUsage(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Quantifier Usage", nameKey: "signal.quantifierUsage", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.quantifierUsage.error", icon: "🔢" };
    }

    const quants=['all','every','each','most','many','much','some','few','several','any','no','none','both','either','neither','plenty','enough','various','numerous','countless'];
    const ws=text.toLowerCase().split(/[\s,.;:!?]+/).filter(w=>w.length>0);
    let count=0;for(const w of ws)if(quants.includes(w))count++;
    const ratio=ws.length>0?count/ws.length:0;
    let score;
    if(ratio>0.04)score=62;else if(ratio>0.025)score=52;else if(ratio<0.005)score=38;else score=46;
    const details=`Quantifier ratio: ${ratio.toFixed(4)}, Found: ${count}.`;
    return {
        name: "Quantifier Usage", nameKey: "signal.quantifierUsage", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Quantifier Usage pattern suggests AI generation" : "Natural quantifier usage — consistent with human writing",
        descriptionKey: score > 55 ? "signal.quantifierUsage.ai" : "signal.quantifierUsage.real", icon: "🔢",
        details,
    };
}
