/**
 * Cheek Texture
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeCheekTexture(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Cheek Texture", nameKey: "signal.cheekTexture", category: "sensor", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.cheekTexture.error", icon: "🧏‍♀️" };
    }
    const regions=[[Math.floor(w*0.2),Math.floor(h*0.35),Math.floor(w*0.15),Math.floor(h*0.15)],[Math.floor(w*0.65),Math.floor(h*0.35),Math.floor(w*0.15),Math.floor(h*0.15)]];let detail=0,cnt=0;for(const[rx,ry,rw,rh]of regions)for(let y=ry;y<ry+rh&&y<h-1;y+=2)for(let x=rx;x<rx+rw&&x<w-1;x+=2){const i=(y*w+x)*4;detail+=Math.abs(p[i]-p[i+4]);cnt++;}const avg=cnt>0?detail/cnt:0;
    let score: number;
    if(avg<2)score=68;else if(avg<5)score=50;else if(avg>12)score=28;else score=44;
    return {
        name: "Cheek Texture", nameKey: "signal.cheekTexture", category: "sensor", score, weight: 0.2,
        description: score > 55 ? "Cheek Texture pattern suggests deepfake" : "Natural cheek texture — consistent with real video",
        descriptionKey: score > 55 ? "signal.cheekTexture.ai" : "signal.cheekTexture.real", icon: "🧏‍♀️",
        details: `Cheek detail: ${avg.toFixed(3)}`,
    };
}
