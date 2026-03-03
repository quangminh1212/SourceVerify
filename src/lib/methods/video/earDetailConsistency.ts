/**
 * Ear Detail
 * Based on scientific research (2019)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeEarDetailConsistency(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Ear Detail", nameKey: "signal.earDetail", category: "sensor", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.earDetail.error", icon: "👂" };
    }
    const regions=[[Math.floor(w*0.08),Math.floor(h*0.25),Math.floor(w*0.12),Math.floor(h*0.2)],[Math.floor(w*0.8),Math.floor(h*0.25),Math.floor(w*0.12),Math.floor(h*0.2)]];const details=[];for(const[rx,ry,rw,rh]of regions){let d=0,c=0;for(let y=ry;y<ry+rh&&y<h-1;y+=2)for(let x=rx;x<rx+rw&&x<w-1;x+=2){const i=(y*w+x)*4;d+=Math.abs(p[i]-p[i+4]);c++;}details.push(c>0?d/c:0);}const diff=Math.abs(details[0]-details[1]);
    let score: number;
    if(diff>5)score=66;else if(diff>2)score=50;else if(diff<0.5)score=32;else score=44;
    return {
        name: "Ear Detail", nameKey: "signal.earDetail", category: "sensor", score, weight: 0.2,
        description: score > 55 ? "Ear Detail — suggests deepfake" : "Natural ear detail — consistent with real video",
        descriptionKey: score > 55 ? "signal.earDetail.ai" : "signal.earDetail.real", icon: "👂",
        details: `Ear diff: ${diff.toFixed(2)}`,
    };
}
