/**
 * Contrast Map
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeContrastMapImg(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Contrast Map", nameKey: "signal.contrastMap", category: "pixel", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.contrastMap.error", icon: "🔲" };
    }
    const bSz=16,gx=Math.floor(w/bSz),gy=Math.floor(h/bSz);const contrasts=[];for(let by=0;by<gy;by++)for(let bx=0;bx<gx;bx++){let mn=255,mx=0;for(let y=0;y<bSz;y++)for(let x=0;x<bSz;x++){const i=((by*bSz+y)*w+(bx*bSz+x))*4;const v=p[i];if(v<mn)mn=v;if(v>mx)mx=v;}contrasts.push(mx-mn);}const avg=contrasts.reduce((a,b)=>a+b,0)/contrasts.length;const cv=contrasts.length>1?Math.sqrt(contrasts.reduce((a,b)=>a+(b-avg)**2,0)/contrasts.length)/(avg||1):0;
    let score: number;
    if(cv<0.2)score=66;else if(cv<0.5)score=50;else if(cv>1.0)score=28;else score=44;
    return {
        name: "Contrast Map", nameKey: "signal.contrastMap", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Contrast Map pattern suggests AI generation" : "Natural contrast map — consistent with real image",
        descriptionKey: score > 55 ? "signal.contrastMap.ai" : "signal.contrastMap.real", icon: "🔲",
        details: `Contrast CV: ${cv.toFixed(3)}`,
    };
}
