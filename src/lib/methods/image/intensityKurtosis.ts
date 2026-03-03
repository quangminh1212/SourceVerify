/**
 * Intensity Kurtosis
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeIntensityKurtosis(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Intensity Kurtosis", nameKey: "signal.intensityKurtosis", category: "statistical", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.intensityKurtosis.error", icon: "📊" };
    }
    const vals=[];const step=3;for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4;vals.push((p[i]+p[i+1]+p[i+2])/3);}const n=vals.length;const mean=vals.reduce((a,b)=>a+b,0)/n;const m2=vals.reduce((a,b)=>a+(b-mean)**2,0)/n;const m4=vals.reduce((a,b)=>a+(b-mean)**4,0)/n;const kurt=m2>0?m4/(m2*m2)-3:0;
    let score: number;
    if(Math.abs(kurt)<0.5)score=66;else if(Math.abs(kurt)<1.5)score=50;else if(Math.abs(kurt)>4)score=28;else score=42;
    return {
        name: "Intensity Kurtosis", nameKey: "signal.intensityKurtosis", category: "statistical", score, weight: 0.3,
        description: score > 55 ? "Intensity Kurtosis pattern suggests AI generation" : "Natural intensity kurtosis — consistent with real image",
        descriptionKey: score > 55 ? "signal.intensityKurtosis.ai" : "signal.intensityKurtosis.real", icon: "📊",
        details: `Kurtosis: ${kurt.toFixed(3)}`,
    };
}
