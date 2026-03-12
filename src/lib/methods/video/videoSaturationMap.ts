/**
 * Saturation Map
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeVideoSaturationMap(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Saturation Map", nameKey: "signal.videoSaturationMap", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.videoSaturationMap.error", icon: "🌈" };
    }
    const sats: number[]=[];const step=4;for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4;const mx=Math.max(p[i],p[i+1],p[i+2]),mn=Math.min(p[i],p[i+1],p[i+2]);sats.push(mx>0?(mx-mn)/mx:0);}const avg=sats.reduce((a,b)=>a+b,0)/sats.length;const cv=Math.sqrt(sats.reduce((a,b)=>a+(b-avg)**2,0)/sats.length)/(avg||1);
    let score: number;
    if(cv<0.3)score=64;else if(cv<0.6)score=48;else if(cv>1.2)score=30;else score=44;
    return {
        name: "Saturation Map", nameKey: "signal.videoSaturationMap", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Saturation Map pattern suggests deepfake" : "Natural saturation map — consistent with real video",
        descriptionKey: score > 55 ? "signal.videoSaturationMap.ai" : "signal.videoSaturationMap.real", icon: "🌈",
        details: `Sat CV: ${cv.toFixed(3)}, Avg: ${avg.toFixed(3)}`,
    };
}
