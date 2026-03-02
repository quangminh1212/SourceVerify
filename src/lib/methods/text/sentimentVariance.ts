/**
 * Sentiment Variance
 * Unique algorithm for sentiment variance detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSentimentVariance(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Sentiment Variance", nameKey: "signal.sentimentVariance", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.sentimentVariance.error", icon: "📈" };
    }

    const pos=['good','great','best','happy','love','excellent','wonderful','amazing','fantastic','brilliant','perfect','beautiful','outstanding','superb','magnificent'];
    const neg=['bad','worst','terrible','awful','horrible','hate','ugly','disgusting','poor','dreadful','miserable','pathetic','disappointing','atrocious','abysmal'];
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>3);
    const sentScores=sents.map(s=>{const w=s.toLowerCase().split(/\s+/);let sc=0;for(const x of w){if(pos.includes(x))sc++;if(neg.includes(x))sc--;}return sc;});
    const mean=sentScores.reduce((a,b)=>a+b,0)/sentScores.length;
    const variance=sentScores.reduce((a,b)=>a+(b-mean)**2,0)/sentScores.length;
    let score;
    if(variance<0.05)score=68;else if(variance<0.2)score=56;else if(variance>1)score=28;else score=44;
    const details=`Sentiment var: ${variance.toFixed(4)}, Mean: ${mean.toFixed(3)}.`;
    return {
        name: "Sentiment Variance", nameKey: "signal.sentimentVariance", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Sentiment Variance pattern suggests AI generation" : "Natural sentiment variance — consistent with human writing",
        descriptionKey: score > 55 ? "signal.sentimentVariance.ai" : "signal.sentimentVariance.real", icon: "📈",
        details,
    };
}
