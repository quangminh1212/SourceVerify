/**
 * Token Predictability
 * Based on NLP research papers
 */
import type { AnalysisMethod } from "../../types";

export function analyzeTokenPredictability(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Token Predictability", nameKey: "signal.tokenPredict", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.tokenPredict.error", icon: "🔮" };
    }
    const words=text.split(/\s+/).filter(w=>w.length>0);const bigrams=new Map();const unigrams=new Map();for(let i=0;i<words.length;i++){const w=words[i].toLowerCase();unigrams.set(w,(unigrams.get(w)||0)+1);if(i>0){const bg=words[i-1].toLowerCase()+' '+w;bigrams.set(bg,(bigrams.get(bg)||0)+1);}}let predictable=0;for(let i=1;i<words.length;i++){const bg=words[i-1].toLowerCase()+' '+words[i].toLowerCase();const bgFreq=bigrams.get(bg)||0;const uniFreq=unigrams.get(words[i-1].toLowerCase())||1;if(bgFreq/uniFreq>0.5)predictable++;}const r=words.length>1?predictable/(words.length-1):0;
    let score: number;
    if(r>0.3)score=68;else if(r>0.15)score=52;else if(r<0.05)score=30;else score=44;
    return {
        name: "Token Predictability", nameKey: "signal.tokenPredict", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Token Predictability — suggests AI generation" : "Natural token predictability — consistent with human writing",
        descriptionKey: score > 55 ? "signal.tokenPredict.ai" : "signal.tokenPredict.real", icon: "🔮",
        details: `Predictability: ${r.toFixed(4)}`,
    };
}
