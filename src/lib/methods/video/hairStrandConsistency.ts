/**
 * Hair Strand Consistency
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeHairStrandConsistency(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Hair Strand Consistency", nameKey: "signal.hairStrandConsistency", category: "pixel", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.hairStrandConsistency.error", icon: "💇" };
    }
    const hY=Math.floor(h*0.05),hH=Math.floor(h*0.2),hX=Math.floor(w*0.15),hW=Math.floor(w*0.7);let fineDetail=0,cnt=0;for(let y=hY;y<hY+hH&&y<h-1;y+=2)for(let x=hX;x<hX+hW&&x<w-1;x+=2){const i=(y*w+x)*4;const d=Math.abs(p[i]-p[i+4]);if(d>3&&d<20)fineDetail++;cnt++;}const fineR=cnt>0?fineDetail/cnt:0;
    let score: number;
    if(fineR<0.1)score=66;else if(fineR<0.25)score=52;else if(fineR>0.5)score=30;else score=44;
    return {
        name: "Hair Strand Consistency", nameKey: "signal.hairStrandConsistency", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Missing fine hair detail — suggests synthetic generation" : "Natural hair strand detail — consistent with real video",
        descriptionKey: score > 55 ? "signal.hairStrandConsistency.ai" : "signal.hairStrandConsistency.real", icon: "💇",
        details: `Fine hair detail ratio: ${fineR.toFixed(4)}`,
    };
}
