/**
 * Micro Texture
 * AI detection method - Micro Texture
 */
import type { AnalysisMethod } from "../../types";

export function analyzeMicroTextureAnalysis(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Micro Texture", nameKey: "signal.microTexture", category: "pixel", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.microTexture.error", icon: "🔬" };
    }
    let microVar=0,cnt=0;for(let y=1;y<Math.min(h,128)-1;y+=2)for(let x=1;x<Math.min(w,128)-1;x+=2){const i=(y*w+x)*4;const c=p[i];const n=[p[i-4],p[i+4],p[i-w*4],p[i+w*4]];const avg=n.reduce((a,b)=>a+b,0)/4;microVar+=Math.abs(c-avg);cnt++;}const avgMicro=cnt>0?microVar/cnt:0;
    let score: number;
    if(avgMicro<1.5)score=72;else if(avgMicro<3)score=55;else if(avgMicro>8)score=28;else score=42;
    return {
        name: "Micro Texture", nameKey: "signal.microTexture", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Over-smooth micro texture — characteristic of AI generation" : "Natural micro texture — consistent with real sensor capture",
        descriptionKey: score > 55 ? "signal.microTexture.ai" : "signal.microTexture.real", icon: "🔬",
        details: `Micro texture avg: ${avgMicro.toFixed(3)}`,
    };
}
