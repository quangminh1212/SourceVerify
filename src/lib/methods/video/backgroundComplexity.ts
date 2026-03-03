/**
 * Background Complexity
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeBackgroundComplexity(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Background Complexity", nameKey: "signal.bgComplexity", category: "pixel", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.bgComplexity.error", icon: "🏔️" };
    }
    const regions=[[0,0,Math.floor(w*0.2),h],[Math.floor(w*0.8),0,w,h]];let edgeSum=0,cnt=0;const step=3;for(const[x1,y1,x2,y2]of regions)for(let y=y1;y<y2-1;y+=step)for(let x=x1;x<x2-1&&x<w-1;x+=step){const i=(y*w+x)*4;edgeSum+=Math.abs(p[i]-p[i+4])+Math.abs(p[i]-p[i+w*4]);cnt++;}const avgE=cnt>0?edgeSum/(cnt*2):0;
    let score: number;
    if(avgE<2)score=64;else if(avgE<6)score=48;else if(avgE>15)score=32;else score=44;
    return {
        name: "Background Complexity", nameKey: "signal.bgComplexity", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Background Complexity pattern suggests deepfake" : "Natural background complexity — consistent with real video",
        descriptionKey: score > 55 ? "signal.bgComplexity.ai" : "signal.bgComplexity.real", icon: "🏔️",
        details: `BG edge avg: ${avgE.toFixed(3)}`,
    };
}
