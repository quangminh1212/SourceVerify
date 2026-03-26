/**
 * Local Entropy
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeLocalEntropy(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Local Entropy", nameKey: "signal.localEntropy", category: "statistical", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.localEntropy.error", icon: "🧊" };
    }
    const bSz=16,gx=Math.floor(w/bSz),gy=Math.floor(h/bSz);const ents=[];for(let by=0;by<gy;by++)for(let bx=0;bx<gx;bx++){const hist=new Float64Array(256);let tot=0;for(let y=0;y<bSz;y++)for(let x=0;x<bSz;x++){const i=((by*bSz+y)*w+(bx*bSz+x))*4;hist[p[i]]++;tot++;}let e=0;for(let i=0;i<256;i++){if(hist[i]>0){const pr=hist[i]/tot;e-=pr*Math.log2(pr);}}ents.push(e);}const avg=ents.reduce((a,b)=>a+b,0)/ents.length;const vari=ents.reduce((a,b)=>a+(b-avg)**2,0)/ents.length;const cv=avg>0?Math.sqrt(vari)/avg:0;
    let score: number;
    if(cv<0.15)score=68;else if(cv<0.3)score=52;else if(cv>0.6)score=28;else score=44;
    return {
        name: "Local Entropy", nameKey: "signal.localEntropy", category: "statistical", score, weight: 0.3,
        description: score > 55 ? "Local Entropy pattern suggests AI generation" : "Natural local entropy — consistent with real image",
        descriptionKey: score > 55 ? "signal.localEntropy.ai" : "signal.localEntropy.real", icon: "🧊",
        details: `Entropy CV: ${cv.toFixed(3)}, Avg: ${avg.toFixed(2)}`,
    };
}
