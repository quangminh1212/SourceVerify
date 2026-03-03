/**
 * Face Skin Smoothness
 * Based on scientific research (2019)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeFaceSkinSmoothV(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Face Skin Smoothness", nameKey: "signal.faceSkinSmoothV", category: "sensor", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.faceSkinSmoothV.error", icon: "🧴" };
    }
    const fX=Math.floor(w*0.3),fY=Math.floor(h*0.25),fW=Math.floor(w*0.4),fH=Math.floor(h*0.3);let highFreq=0,cnt=0;for(let y=fY;y<fY+fH&&y<h-1;y+=2)for(let x=fX;x<fX+fW&&x<w-1;x+=2){const i=(y*w+x)*4;const d=Math.abs(p[i]-p[i+4])+Math.abs(p[i]-p[i+w*4]);if(d>5)highFreq++;cnt++;}const r=cnt>0?highFreq/cnt:0;
    let score: number;
    if(r<0.1)score=70;else if(r<0.25)score=52;else if(r>0.5)score=28;else score=44;
    return {
        name: "Face Skin Smoothness", nameKey: "signal.faceSkinSmoothV", category: "sensor", score, weight: 0.3,
        description: score > 55 ? "Face Skin Smoothness — suggests deepfake" : "Natural face skin smoothness — consistent with real video",
        descriptionKey: score > 55 ? "signal.faceSkinSmoothV.ai" : "signal.faceSkinSmoothV.real", icon: "🧴",
        details: `Skin smooth: ${r.toFixed(4)}`,
    };
}
