/**
 * Clothing Edge Blend
 * Based on scientific research (2021)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeClothingEdgeBlend(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Clothing Edge Blend", nameKey: "signal.clothingEdgeBlend", category: "pixel", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.clothingEdgeBlend.error", icon: "👔" };
    }
    const cY=Math.floor(h*0.55),cH=Math.floor(h*0.35);let edgeG=0,cnt=0;const step=3;for(let y=cY;y<cY+cH&&y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;edgeG+=Math.abs(p[i]-p[i+4]);cnt++;}const avg=cnt>0?edgeG/cnt:0;
    let score: number;
    if(avg<2)score=64;else if(avg<6)score=48;else if(avg>15)score=30;else score=44;
    return {
        name: "Clothing Edge Blend", nameKey: "signal.clothingEdgeBlend", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Clothing Edge Blend — suggests deepfake" : "Natural clothing edge blend — consistent with real video",
        descriptionKey: score > 55 ? "signal.clothingEdgeBlend.ai" : "signal.clothingEdgeBlend.real", icon: "👔",
        details: `Clothing edge: ${avg.toFixed(2)}`,
    };
}
