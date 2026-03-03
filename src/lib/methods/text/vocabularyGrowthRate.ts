/**
 * Vocabulary Growth Rate
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeVocabularyGrowthRate(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Vocabulary Growth Rate", nameKey: "signal.vocabGrowthRate", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.vocabGrowthRate.error", icon: "📈" };
    }
    const words=text.split(/\s+/).filter(w=>w.length>0).map(w=>w.toLowerCase().replace(/[^a-z]/g,''));const seen=new Set();const rates=[];const chunk=Math.max(10,Math.floor(words.length/10));for(let i=0;i<words.length;i+=chunk){const before=seen.size;for(let j=i;j<Math.min(i+chunk,words.length);j++)seen.add(words[j]);rates.push(seen.size-before);}let declining=0;for(let i=1;i<rates.length;i++)if(rates[i]<rates[i-1])declining++;const decR=rates.length>1?declining/(rates.length-1):0;
    let score: number;
    if(decR>0.8)score=64;else if(decR>0.5)score=48;else if(decR<0.2)score=35;else score=44;
    return {
        name: "Vocabulary Growth Rate", nameKey: "signal.vocabGrowthRate", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Monotonic vocab decline — suggests uniform AI vocabulary" : "Natural vocabulary growth — consistent with human writing",
        descriptionKey: score > 55 ? "signal.vocabGrowthRate.ai" : "signal.vocabGrowthRate.real", icon: "📈",
        details: `Declining rate: ${decR.toFixed(3)}`,
    };
}
