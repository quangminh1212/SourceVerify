/**
 * Depth Map Consistency
 * AI detection method - Depth Map Consistency
 */
import type { AnalysisMethod } from "../../types";

export function analyzeDepthMapConsistency(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Depth Map Consistency", nameKey: "signal.depthMapConsistency", category: "pixel", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.depthMapConsistency.error", icon: "🗺️" };
    }
    const bSz=16,gx=Math.floor(w/bSz),gy=Math.floor(h/bSz);const blurs=[];for(let by=0;by<gy;by++)for(let bx=0;bx<gx;bx++){let sum=0,cnt=0;for(let y=0;y<bSz-1;y++)for(let x=0;x<bSz-1;x++){const i=((by*bSz+y)*w+(bx*bSz+x))*4;const dx=Math.abs(p[i]-p[i+4]),dy=Math.abs(p[i]-p[i+w*4]);sum+=dx+dy;cnt++;}blurs.push(cnt>0?sum/cnt:0);}let trans=0;for(let i=1;i<blurs.length;i++){const d=Math.abs(blurs[i]-blurs[i-1]);if(d>5)trans++;}const tRatio=blurs.length>1?trans/(blurs.length-1):0;
    let score: number;
    if(tRatio<0.1)score=68;else if(tRatio<0.25)score=55;else if(tRatio>0.5)score=30;else score=44;
    return {
        name: "Depth Map Consistency", nameKey: "signal.depthMapConsistency", category: "pixel", score, weight: 0.3,
        description: score > 55 ? "Uniform depth field suggests AI generation" : "Natural depth variation — consistent with real optics",
        descriptionKey: score > 55 ? "signal.depthMapConsistency.ai" : "signal.depthMapConsistency.real", icon: "🗺️",
        details: `Depth transitions: ${trans}, Ratio: ${tRatio.toFixed(3)}`,
    };
}
