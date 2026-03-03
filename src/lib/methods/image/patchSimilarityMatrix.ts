/**
 * Patch Similarity Matrix
 * AI detection method - Patch Similarity Matrix
 */
import type { AnalysisMethod } from "../../types";

export function analyzePatchSimilarityMatrix(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Patch Similarity Matrix", nameKey: "signal.patchSimilarityMatrix", category: "pixel", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.patchSimilarityMatrix.error", icon: "🧩" };
    }
    const ps=8,gx=Math.min(8,Math.floor(w/ps)),gy=Math.min(8,Math.floor(h/ps));const patches=[];for(let by=0;by<gy;by++)for(let bx=0;bx<gx;bx++){let s=0;for(let y=0;y<ps;y++)for(let x=0;x<ps;x++){const i=((by*ps+y)*w+(bx*ps+x))*4;s+=p[i];}patches.push(s/(ps*ps));}let simCount=0,total=0;for(let i=0;i<patches.length;i++)for(let j=i+1;j<patches.length;j++){if(Math.abs(patches[i]-patches[j])<5)simCount++;total++;}const simR=total>0?simCount/total:0;
    let score: number;
    if(simR>0.4)score=72;else if(simR>0.2)score=58;else if(simR<0.05)score=30;else score=44;
    return {
        name: "Patch Similarity Matrix", nameKey: "signal.patchSimilarityMatrix", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "High patch similarity — suggests AI-generated content" : "Natural patch variation — consistent with real image",
        descriptionKey: score > 55 ? "signal.patchSimilarityMatrix.ai" : "signal.patchSimilarityMatrix.real", icon: "🧩",
        details: `Patch similarity: ${simR.toFixed(4)}`,
    };
}
