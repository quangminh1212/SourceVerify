/**
 * Emotional Tone Variance
 * Unique algorithm for emotional tone variance detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeEmotionalTone(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Emotional Tone Variance", nameKey: "signal.emotionalTone", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.emotionalTone.error", icon: "💭" };
    }

    const posWords=['happy','good','great','love','wonderful','excellent','amazing','beautiful','fantastic','brilliant','joy','delight','pleasant','cheerful','glad'];
    const negWords=['bad','terrible','awful','horrible','hate','ugly','disgusting','miserable','dreadful','tragic','sad','angry','fear','pain','worst'];
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0);
    const scores=sents.map(s=>{const w=s.toLowerCase().split(/\s+/);let p=0,n=0;for(const x of w){if(posWords.includes(x))p++;if(negWords.includes(x))n++;}return w.length>0?(p-n)/w.length:0;});
    const mean=scores.reduce((a,b)=>a+b,0)/scores.length;
    const variance=scores.reduce((a,b)=>a+(b-mean)**2,0)/scores.length;
    let score;
    if(variance<0.001)score=70;else if(variance<0.005)score=58;else if(variance>0.05)score=28;else score=42;
    const details=`Tone variance: ${variance.toFixed(5)}, Mean tone: ${mean.toFixed(4)}.`;
    return {
        name: "Emotional Tone Variance", nameKey: "signal.emotionalTone", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Emotional Tone Variance pattern suggests AI generation" : "Natural emotional tone variance — consistent with human writing",
        descriptionKey: score > 55 ? "signal.emotionalTone.ai" : "signal.emotionalTone.real", icon: "💭",
        details,
    };
}
