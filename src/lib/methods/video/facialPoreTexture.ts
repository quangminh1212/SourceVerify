/**
 * Facial Pore Texture
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeFacialPoreTexture(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Facial Pore Texture", nameKey: "signal.facialPoreTexture", category: "sensor", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.facialPoreTexture.error", icon: "🔍" };
    }
    const cX=Math.floor(w*0.35),cY=Math.floor(h*0.35),cW=Math.floor(w*0.3),cH=Math.floor(h*0.15);let micro=0,cnt=0;for(let y=cY;y<cY+cH&&y<h-1;y++)for(let x=cX;x<cX+cW&&x<w-1;x++){const i=(y*w+x)*4;const d=Math.abs(p[i]-p[i+4]);if(d>1&&d<6)micro++;cnt++;}const r=cnt>0?micro/cnt:0;
    let score: number;
    if(r<0.15)score=70;else if(r<0.3)score=52;else if(r>0.5)score=28;else score=44;
    return {
        name: "Facial Pore Texture", nameKey: "signal.facialPoreTexture", category: "sensor", score, weight: 0.3,
        description: score > 55 ? "Facial Pore Texture pattern suggests deepfake" : "Natural facial pore texture — consistent with real video",
        descriptionKey: score > 55 ? "signal.facialPoreTexture.ai" : "signal.facialPoreTexture.real", icon: "🔍",
        details: `Pore texture: ${r.toFixed(4)}`,
    };
}
