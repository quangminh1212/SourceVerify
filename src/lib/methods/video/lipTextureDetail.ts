/**
 * Lip Texture Detail
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeLipTextureDetail(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Lip Texture Detail", nameKey: "signal.lipTextureDetail", category: "pixel", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.lipTextureDetail.error", icon: "👄" };
    }
    const mX=Math.floor(w*0.35),mY=Math.floor(h*0.55),mW=Math.floor(w*0.3),mH=Math.floor(h*0.1);let detail=0,cnt=0;for(let y=mY;y<mY+mH&&y<h-1;y+=2)for(let x=mX;x<mX+mW&&x<w-1;x+=2){const i=(y*w+x)*4;const d=Math.abs(p[i]-p[i+4]);if(d>3&&d<20)detail++;cnt++;}const r=cnt>0?detail/cnt:0;
    let score: number;
    if(r<0.15)score=66;else if(r<0.3)score=48;else if(r>0.5)score=30;else score=44;
    return {
        name: "Lip Texture Detail", nameKey: "signal.lipTextureDetail", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Lip Texture Detail pattern suggests deepfake" : "Natural lip texture detail — consistent with real video",
        descriptionKey: score > 55 ? "signal.lipTextureDetail.ai" : "signal.lipTextureDetail.real", icon: "👄",
        details: `Lip detail: ${r.toFixed(4)}`,
    };
}
