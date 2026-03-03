/**
 * Video Global Illum
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeVideoGlobalIllum(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Video Global Illum", nameKey: "signal.videoGlobalIllum", category: "sensor", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.videoGlobalIllum.error", icon: "☀️" };
    }
    const quadrants=[[0,0,w/2,h/2],[w/2,0,w,h/2],[0,h/2,w/2,h],[w/2,h/2,w,h]];const qBright=[];const step=4;for(const[x1,y1,x2,y2]of quadrants){let s=0,c=0;for(let y=Math.floor(y1);y<Math.floor(y2);y+=step)for(let x=Math.floor(x1);x<Math.floor(x2);x+=step){const i=(y*w+x)*4;s+=(p[i]+p[i+1]+p[i+2])/3;c++;}qBright.push(c>0?s/c:128);}const avg=qBright.reduce((a,b)=>a+b,0)/4;const cv=Math.sqrt(qBright.reduce((a,b)=>a+(b-avg)**2,0)/4)/(avg||1);
    let score: number;
    if(cv<0.05)score=64;else if(cv<0.15)score=48;else if(cv>0.3)score=30;else score=44;
    return {
        name: "Video Global Illum", nameKey: "signal.videoGlobalIllum", category: "sensor", score, weight: 0.2,
        description: score > 55 ? "Video Global Illum pattern suggests deepfake" : "Natural video global illum — consistent with real video",
        descriptionKey: score > 55 ? "signal.videoGlobalIllum.ai" : "signal.videoGlobalIllum.real", icon: "☀️",
        details: `Illumination CV: ${cv.toFixed(3)}`,
    };
}
