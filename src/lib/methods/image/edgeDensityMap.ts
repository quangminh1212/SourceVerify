/**
 * Edge Density Map
 * AI detection method - Edge Density Map
 */
import type { AnalysisMethod } from "../../types";

export function analyzeEdgeDensityMap(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Edge Density Map", nameKey: "signal.edgeDensityMap", category: "pixel", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.edgeDensityMap.error", icon: "📐" };
    }
    const bSz=16,gx=Math.floor(w/bSz),gy=Math.floor(h/bSz);const densities=[];for(let by=0;by<gy;by++)for(let bx=0;bx<gx;bx++){let edges=0,cnt=0;for(let y=0;y<bSz-1;y++)for(let x=0;x<bSz-1;x++){const i=((by*bSz+y)*w+(bx*bSz+x))*4;const g=Math.abs(p[i]-p[i+4])+Math.abs(p[i]-p[i+w*4]);if(g>25)edges++;cnt++;}densities.push(cnt>0?edges/cnt:0);}const avg=densities.reduce((a,b)=>a+b,0)/densities.length;const vari=densities.reduce((a,b)=>a+(b-avg)**2,0)/densities.length;const cv=avg>0?Math.sqrt(vari)/avg:0;
    let score: number;
    if(cv<0.3)score=68;else if(cv<0.5)score=52;else if(cv>1.0)score=28;else score=42;
    return {
        name: "Edge Density Map", nameKey: "signal.edgeDensityMap", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Uniform edge density — suggests AI generation" : "Natural edge density variation — consistent with real image",
        descriptionKey: score > 55 ? "signal.edgeDensityMap.ai" : "signal.edgeDensityMap.real", icon: "📐",
        details: `Edge density CV: ${cv.toFixed(3)}, Avg: ${avg.toFixed(3)}`,
    };
}
