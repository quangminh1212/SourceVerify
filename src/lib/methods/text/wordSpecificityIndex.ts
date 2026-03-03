/**
 * Word Specificity
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeWordSpecificityIndex(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Word Specificity", nameKey: "signal.wordSpecificity", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.wordSpecificity.error", icon: "🎯" };
    }
    const generic=new Set(['thing','stuff','something','someone','somewhere','somehow','anything','anyone','everything','everyone','good','bad','nice','great','big','small','many','much','very','really','quite','rather','somewhat','kind','sort','lot','lots','way','ways','place','time','people','person']);const words=text.split(/\s+/).filter(w=>w.length>0);let genCount=0;for(const w of words)if(generic.has(w.toLowerCase()))genCount++;const ratio=words.length>0?genCount/words.length:0;
    let score: number;
    if(ratio<0.01)score=60;else if(ratio<0.03)score=46;else if(ratio>0.08)score=35;else score=44;
    return {
        name: "Word Specificity", nameKey: "signal.wordSpecificity", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Low word specificity — suggests generic AI writing" : "Natural word specificity — consistent with human writing",
        descriptionKey: score > 55 ? "signal.wordSpecificity.ai" : "signal.wordSpecificity.real", icon: "🎯",
        details: `Generic words: ${genCount}, Ratio: ${ratio.toFixed(4)}`,
    };
}
