/**
 * Resolution Map
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeVideoResolutionMap(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Resolution Map", nameKey: "signal.videoResolutionMap", category: "pixel", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.videoResolutionMap.error", icon: "🗺️" };
    }
    const bSz=16,gx=Math.floor(w/bSz),gy=Math.floor(h/bSz);const sharpness=[];for(let by=0;by<gy;by++)for(let bx=0;bx<gx;bx++){let s=0,c=0;for(let y=0;y<bSz-1;y++)for(let x=0;x<bSz-1;x++){const i=((by*bSz+y)*w+(bx*bSz+x))*4;s+=Math.abs(p[i]-p[i+4])+Math.abs(p[i]-p[i+w*4]);c++;}sharpness.push(c>0?s/c:0);}const avg=sharpness.reduce((a,b)=>a+b,0)/sharpness.length;const cv=sharpness.length>0?Math.sqrt(sharpness.reduce((a,b)=>a+(b-avg)**2,0)/sharpness.length)/(avg||1):0;
    let score: number;
    if(cv<0.25)score=66;else if(cv<0.5)score=50;else if(cv>1.0)score=30;else score=44;
    return {
        name: "Resolution Map", nameKey: "signal.videoResolutionMap", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Uniform resolution — suggests synthetic video generation" : "Natural resolution variation — consistent with real video",
        descriptionKey: score > 55 ? "signal.videoResolutionMap.ai" : "signal.videoResolutionMap.real", icon: "🗺️",
        details: `Resolution CV: ${cv.toFixed(3)}, Avg sharpness: ${avg.toFixed(2)}`,
    };
}
