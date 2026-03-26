/**
 * Maximal Gradient Flow
 * Based on scientific research papers (2019)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeMaximalGradFlow(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Maximal Gradient Flow", nameKey: "signal.maxGradFlow", category: "pixel", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.maxGradFlow.error", icon: "🌊" };
    }
    const dirs=[[1,0],[0,1],[1,1],[-1,1]];const counts=new Float64Array(4);let cnt=0;const step=3;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;let maxD=0,maxIdx=0;dirs.forEach(([dx,dy],idx)=>{const j=((y+dy)*w+(x+dx))*4;const d=Math.abs(p[i]-p[j]);if(d>maxD){maxD=d;maxIdx=idx;}});counts[maxIdx]++;cnt++;}const peak=Math.max(...counts);const uniformity=cnt>0?peak/cnt:0;
    let score: number;
    if(uniformity>0.5)score=66;else if(uniformity>0.35)score=50;else if(uniformity<0.28)score=30;else score=44;
    return {
        name: "Maximal Gradient Flow", nameKey: "signal.maxGradFlow", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Maximal Gradient Flow — suggests AI generation" : "Natural maximal gradient flow — consistent with real image",
        descriptionKey: score > 55 ? "signal.maxGradFlow.ai" : "signal.maxGradFlow.real", icon: "🌊",
        details: `Max flow uniformity: ${uniformity.toFixed(3)}`,
    };
}
