/**
 * Zipf Deviation
 * Based on NLP research papers
 */
import type { AnalysisMethod } from "../../types";

export function analyzeZipfDeviation(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Zipf Deviation", nameKey: "signal.zipfDeviation", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.zipfDeviation.error", icon: "📊" };
    }
    const freq=new Map();text.split(/\s+/).forEach(w=>{const l=w.toLowerCase().replace(/[^a-z]/g,'');if(l.length>1)freq.set(l,(freq.get(l)||0)+1);});const sorted=[...freq.values()].sort((a,b)=>b-a);let zipfDev=0;for(let i=0;i<Math.min(50,sorted.length);i++){const expected=sorted[0]/(i+1);zipfDev+=Math.abs(sorted[i]-expected)/(expected||1);}const avgDev=sorted.length>0?zipfDev/Math.min(50,sorted.length):0;
    let score: number;
    if(avgDev<0.3)score=68;else if(avgDev<0.6)score=50;else if(avgDev>1.2)score=28;else score=44;
    return {
        name: "Zipf Deviation", nameKey: "signal.zipfDeviation", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Zipf Deviation — suggests AI generation" : "Natural zipf deviation — consistent with human writing",
        descriptionKey: score > 55 ? "signal.zipfDeviation.ai" : "signal.zipfDeviation.real", icon: "📊",
        details: `Zipf deviation: ${avgDev.toFixed(3)}`,
    };
}
