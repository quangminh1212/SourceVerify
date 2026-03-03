/**
 * Edge Sharpness Var
 * Based on scientific research (2021)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeEdgeSharpnessVar(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Edge Sharpness Var", nameKey: "signal.edgeSharpnessVar", category: "pixel", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.edgeSharpnessVar.error", icon: "🔪" };
    }
    const regions=[[0,0,w/2,h/2],[w/2,0,w,h/2],[0,h/2,w/2,h],[w/2,h/2,w,h]];const sharpness=[];const step=3;for(const[x1,y1,x2,y2]of regions){let s=0,c=0;for(let y=Math.floor(y1)+1;y<Math.floor(y2)-1;y+=step)for(let x=Math.floor(x1)+1;x<Math.floor(x2)-1&&x<w-1;x+=step){const i=(y*w+x)*4;s+=Math.abs(p[i]-p[i+4])+Math.abs(p[i]-p[i+w*4]);c++;}sharpness.push(c>0?s/c:0);}const avg=sharpness.reduce((a,b)=>a+b,0)/4;const cv=Math.sqrt(sharpness.reduce((a,b)=>a+(b-avg)**2,0)/4)/(avg||1);
    let score: number;
    if(cv<0.15)score=66;else if(cv<0.35)score=50;else if(cv>0.7)score=28;else score=44;
    return {
        name: "Edge Sharpness Var", nameKey: "signal.edgeSharpnessVar", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Edge Sharpness Var — suggests deepfake" : "Natural edge sharpness var — consistent with real video",
        descriptionKey: score > 55 ? "signal.edgeSharpnessVar.ai" : "signal.edgeSharpnessVar.real", icon: "🔪",
        details: `Sharpness CV: ${cv.toFixed(3)}`,
    };
}
