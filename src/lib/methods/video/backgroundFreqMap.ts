/**
 * Background Freq Map
 * Based on scientific research (2021)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeBGFreqMap(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Background Freq Map", nameKey: "signal.bgFreqMap", category: "frequency", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.bgFreqMap.error", icon: "🗺️" };
    }
    const bgX=[[0,0,Math.floor(w*0.15),h],[Math.floor(w*0.85),0,w,h]];let hf=0,lf=0;const step=3;for(const[x1,y1,x2,y2]of bgX)for(let y=y1;y<y2-1;y+=step)for(let x=x1;x<x2-1&&x<w-1;x+=step){const i=(y*w+x)*4;const d=Math.abs(p[i]-p[i+4]);if(d>10)hf++;else lf++;}const r=(hf+lf)>0?hf/(hf+lf):0;
    let score: number;
    if(r<0.05)score=64;else if(r<0.15)score=48;else if(r>0.35)score=30;else score=44;
    return {
        name: "Background Freq Map", nameKey: "signal.bgFreqMap", category: "frequency", score, weight: 0.2,
        description: score > 55 ? "Background Freq Map — suggests deepfake" : "Natural background freq map — consistent with real video",
        descriptionKey: score > 55 ? "signal.bgFreqMap.ai" : "signal.bgFreqMap.real", icon: "🗺️",
        details: `BG HF ratio: ${r.toFixed(4)}`,
    };
}
