/**
 * Emotional Arc
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeEmotionalArc(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Emotional Arc", nameKey: "signal.emotionalArc", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.emotionalArc.error", icon: "📉" };
    }
    const pos=new Set(['happy','great','wonderful','excellent','amazing','love','beautiful','fantastic','brilliant','perfect','joy','delight','excited','thrilled']);const neg=new Set(['sad','terrible','horrible','awful','hate','ugly','disgusting','worst','pain','suffer','angry','frustrated','disappointed','depressed']);const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0);const scores=sents.map(s=>{const words=s.toLowerCase().split(/\s+/);let sc=0;for(const w of words){if(pos.has(w))sc++;if(neg.has(w))sc--;}return sc;});let changes=0;for(let i=1;i<scores.length;i++)if(Math.sign(scores[i])!==Math.sign(scores[i-1])&&scores[i]!==0)changes++;const changeR=scores.length>1?changes/(scores.length-1):0;
    let score: number;
    if(changeR<0.05)score=64;else if(changeR<0.15)score=48;else if(changeR>0.3)score=32;else score=44;
    return {
        name: "Emotional Arc", nameKey: "signal.emotionalArc", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Flat emotional arc — suggests AI generation" : "Natural emotional progression — consistent with human writing",
        descriptionKey: score > 55 ? "signal.emotionalArc.ai" : "signal.emotionalArc.real", icon: "📉",
        details: `Emotional changes: ${changes}, Rate: ${changeR.toFixed(3)}`,
    };
}
