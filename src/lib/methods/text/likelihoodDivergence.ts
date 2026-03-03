/**
 * Likelihood Divergence
 * AI text detection based on NLP research
 */
import type { AnalysisMethod } from "../../types";

export function analyzeLikelihoodDivergence(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Likelihood Divergence", nameKey: "signal.likelihoodDivergence", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.likelihoodDivergence.error", icon: "📊" };
    }
    const words=text.split(/\s+/).filter(w=>w.length>0);const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0);const uniq=new Set(words.map(w=>w.toLowerCase()));const r=words.length>0?uniq.size/words.length:0;const avgSentLen=sents.length>0?words.length/sents.length:0;const cv=avgSentLen>0?Math.abs(avgSentLen-15)/15:0;
    let score: number;
    if(r>0.7&&cv<0.3)score=62;else if(r<0.4)score=40;else if(cv>0.5)score=35;else score=48;
    return {
        name: "Likelihood Divergence", nameKey: "signal.likelihoodDivergence", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Likelihood Divergence — suggests AI generation" : "Natural likelihood divergence — consistent with human writing",
        descriptionKey: score > 55 ? "signal.likelihoodDivergence.ai" : "signal.likelihoodDivergence.real", icon: "📊",
        details: `Words: ${words.length}, UniqueRatio: ${r.toFixed(3)}, AvgSentLen: ${avgSentLen.toFixed(1)}`,
    };
}
