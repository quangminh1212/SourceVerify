/**
 * Log-Likelihood Rank
 * Based on NLP research papers
 */
import type { AnalysisMethod } from "../../types";

export function analyzeLogLikelihoodRank(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Log-Likelihood Rank", nameKey: "signal.logLikelihood", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.logLikelihood.error", icon: "📈" };
    }
    const words=text.split(/\s+/).filter(w=>w.length>0);const common=['the','be','to','of','and','a','in','that','have','i','it','for','not','on','with','he','as','you','do','at','this','but','his','by','from','they','we','her','she','or','an','will','my','one','all','would','there','their','what','so','up','out','if','about','who','get','which','go','me','when','make','can','like','time','no','just','him','know','take','people','into','year','your','good','some','could','them','see','other'];const commonSet=new Set(common);let inTop=0;for(const w of words)if(commonSet.has(w.toLowerCase()))inTop++;const r=words.length>0?inTop/words.length:0;
    let score: number;
    if(r>0.45)score=66;else if(r>0.35)score=50;else if(r<0.2)score=30;else score=44;
    return {
        name: "Log-Likelihood Rank", nameKey: "signal.logLikelihood", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Log-Likelihood Rank — suggests AI generation" : "Natural log-likelihood rank — consistent with human writing",
        descriptionKey: score > 55 ? "signal.logLikelihood.ai" : "signal.logLikelihood.real", icon: "📈",
        details: `Top-word ratio: ${r.toFixed(4)}`,
    };
}
