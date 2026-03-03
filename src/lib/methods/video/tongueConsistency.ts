/**
 * Tongue Consistency
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeTongueConsistency(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Tongue Consistency", nameKey: "signal.tongueConsistency", category: "pixel", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.tongueConsistency.error", icon: "👅" };
    }
    const mX=Math.floor(w*0.35),mY=Math.floor(h*0.55),mW=Math.floor(w*0.3),mH=Math.floor(h*0.1);let redPx=0,cnt=0;for(let y=mY;y<mY+mH&&y<h;y+=2)for(let x=mX;x<mX+mW&&x<w;x+=2){const i=(y*w+x)*4;if(p[i]>120&&p[i+1]<80&&p[i+2]<80)redPx++;cnt++;}const tongueR=cnt>0?redPx/cnt:0;
    let score: number;
    if(tongueR<0.001)score=58;else if(tongueR<0.05)score=42;else if(tongueR>0.2)score=35;else score=48;
    return {
        name: "Tongue Consistency", nameKey: "signal.tongueConsistency", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Mouth region lacks natural tissue detail — suggests deepfake" : "Natural oral tissue detected — consistent with real video",
        descriptionKey: score > 55 ? "signal.tongueConsistency.ai" : "signal.tongueConsistency.real", icon: "👅",
        details: `Tongue-like pixels: ${tongueR.toFixed(4)}`,
    };
}
