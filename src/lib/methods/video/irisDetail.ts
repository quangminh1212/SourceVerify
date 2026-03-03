/**
 * Iris Detail
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeIrisDetail(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Iris Detail", nameKey: "signal.irisDetail", category: "sensor", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.irisDetail.error", icon: "👁️‍🗨️" };
    }
    const eY=Math.floor(h*0.25),eH=Math.floor(h*0.08);const regions=[[Math.floor(w*0.32),eY],[Math.floor(w*0.55),eY]];let totalDetail=0,cnt=0;for(const[ex,ey]of regions){const eW=Math.floor(w*0.1);for(let y=ey;y<ey+eH&&y<h-1;y+=1)for(let x=ex;x<ex+eW&&x<w-1;x+=1){const i=(y*w+x)*4;const d=Math.abs(p[i]-p[i+4])+Math.abs(p[i]-p[i+w*4]);totalDetail+=d;cnt++;}}const avgD=cnt>0?totalDetail/(cnt*2):0;
    let score: number;
    if(avgD<2)score=68;else if(avgD<5)score=52;else if(avgD>12)score=28;else score=44;
    return {
        name: "Iris Detail", nameKey: "signal.irisDetail", category: "sensor", score, weight: 0.3,
        description: score > 55 ? "Iris Detail pattern suggests deepfake" : "Natural iris detail — consistent with real video",
        descriptionKey: score > 55 ? "signal.irisDetail.ai" : "signal.irisDetail.real", icon: "👁️‍🗨️",
        details: `Iris detail: ${avgD.toFixed(3)}`,
    };
}
