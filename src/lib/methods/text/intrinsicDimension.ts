/**
 * Intrinsic Dimension
 * Based on NLP research papers
 */
import type { AnalysisMethod } from "../../types";

export function analyzeIntrinsicDimension(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Intrinsic Dimension", nameKey: "signal.intrinsicDim", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.intrinsicDim.error", icon: "📏" };
    }
    const words=text.split(/\s+/).filter(w=>w.length>0);const windowSz=Math.min(50,words.length);const wordLens=words.map(w=>w.length);let dims=0;for(let i=0;i<words.length-windowSz;i+=windowSz){const slice=wordLens.slice(i,i+windowSz);const mean=slice.reduce((a,b)=>a+b,0)/windowSz;const vari=slice.reduce((a,b)=>a+(b-mean)**2,0)/windowSz;dims+=Math.sqrt(vari);}const avgDim=Math.floor(words.length/windowSz)>0?dims/Math.floor(words.length/windowSz):0;
    let score: number;
    if(avgDim<1.5)score=66;else if(avgDim<2.5)score=50;else if(avgDim>4)score=28;else score=44;
    return {
        name: "Intrinsic Dimension", nameKey: "signal.intrinsicDim", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Intrinsic Dimension — suggests AI generation" : "Natural intrinsic dimension — consistent with human writing",
        descriptionKey: score > 55 ? "signal.intrinsicDim.ai" : "signal.intrinsicDim.real", icon: "📏",
        details: `Intrinsic dim: ${avgDim.toFixed(3)}`,
    };
}
