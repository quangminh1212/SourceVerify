/**
 * Skin Texture Frequency
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSkinTextureFreq(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Skin Texture Frequency", nameKey: "signal.skinTextureFreq", category: "sensor", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.skinTextureFreq.error", icon: "🧑" };
    }
    const fX=Math.floor(w*0.3),fY=Math.floor(h*0.2),fW=Math.floor(w*0.4),fH=Math.floor(h*0.3);let hf=0,lf=0,c=0;for(let y=fY;y<fY+fH&&y<h-1;y+=2)for(let x=fX;x<fX+fW&&x<w-1;x+=2){const i=(y*w+x)*4;const d=Math.abs(p[i]-p[i+4]);if(d>8&&d<25)hf++;else lf++;c++;}const r=c>0?hf/c:0;
    let score: number;
    if(r<0.1)score=68;else if(r<0.25)score=52;else if(r>0.5)score=28;else score=42;
    return {
        name: "Skin Texture Frequency", nameKey: "signal.skinTextureFreq", category: "sensor", score, weight: 0.2,
        description: score > 55 ? "Skin Texture Frequency pattern suggests AI generation" : "Natural skin texture frequency — consistent with real image",
        descriptionKey: score > 55 ? "signal.skinTextureFreq.ai" : "signal.skinTextureFreq.real", icon: "🧑",
        details: `Skin HF ratio: ${r.toFixed(4)}`,
    };
}
