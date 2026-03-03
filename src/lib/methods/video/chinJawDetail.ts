/**
 * Chin-Jaw Detail
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeChinJawDetail(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Chin-Jaw Detail", nameKey: "signal.chinJawDetail", category: "pixel", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.chinJawDetail.error", icon: "🧏" };
    }
    const cY=Math.floor(h*0.65),cH=Math.floor(h*0.15),cX=Math.floor(w*0.25),cW=Math.floor(w*0.5);let detail=0,cnt=0;for(let y=cY;y<cY+cH&&y<h-1;y+=2)for(let x=cX;x<cX+cW&&x<w-1;x+=2){const i=(y*w+x)*4;const g=Math.abs(p[i]-p[i+4])+Math.abs(p[i]-p[i+w*4]);if(g>5)detail++;cnt++;}const r=cnt>0?detail/cnt:0;
    let score: number;
    if(r<0.1)score=64;else if(r<0.25)score=48;else if(r>0.5)score=30;else score=44;
    return {
        name: "Chin-Jaw Detail", nameKey: "signal.chinJawDetail", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Chin-Jaw Detail pattern suggests deepfake" : "Natural chin-jaw detail — consistent with real video",
        descriptionKey: score > 55 ? "signal.chinJawDetail.ai" : "signal.chinJawDetail.real", icon: "🧏",
        details: `Chin detail: ${r.toFixed(4)}`,
    };
}
