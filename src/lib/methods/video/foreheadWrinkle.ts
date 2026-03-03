/**
 * Forehead Wrinkle
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeForeheadWrinkle(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Forehead Wrinkle", nameKey: "signal.foreheadWrinkle", category: "pixel", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.foreheadWrinkle.error", icon: "🧑‍🦲" };
    }
    const fX=Math.floor(w*0.3),fY=Math.floor(h*0.08),fW=Math.floor(w*0.4),fH=Math.floor(h*0.12);let wrinkle=0,cnt=0;for(let y=fY;y<fY+fH&&y<h-1;y+=2)for(let x=fX;x<fX+fW&&x<w;x+=2){const i=(y*w+x)*4,j=i+w*4;const d=Math.abs(p[i]-p[j]);if(d>5&&d<25)wrinkle++;cnt++;}const r=cnt>0?wrinkle/cnt:0;
    let score: number;
    if(r<0.05)score=64;else if(r<0.15)score=48;else if(r>0.35)score=32;else score=44;
    return {
        name: "Forehead Wrinkle", nameKey: "signal.foreheadWrinkle", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Forehead Wrinkle pattern suggests deepfake" : "Natural forehead wrinkle — consistent with real video",
        descriptionKey: score > 55 ? "signal.foreheadWrinkle.ai" : "signal.foreheadWrinkle.real", icon: "🧑‍🦲",
        details: `Wrinkle ratio: ${r.toFixed(4)}`,
    };
}
