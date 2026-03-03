/**
 * Dynamic Range
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeDynamicRangeAnalysis(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Dynamic Range", nameKey: "signal.dynamicRange", category: "statistical", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.dynamicRange.error", icon: "🔆" };
    }
    let minV=255,maxV=0;const step=3;for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4;const v=Math.max(p[i],p[i+1],p[i+2]);if(v<minV)minV=v;if(v>maxV)maxV=v;}const dr=maxV-minV;
    let score: number;
    if(dr<50)score=68;else if(dr<120)score=55;else if(dr>230)score=30;else score=42;
    return {
        name: "Dynamic Range", nameKey: "signal.dynamicRange", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Dynamic Range pattern suggests AI generation" : "Natural dynamic range — consistent with real image",
        descriptionKey: score > 55 ? "signal.dynamicRange.ai" : "signal.dynamicRange.real", icon: "🔆",
        details: `Dynamic range: ${dr}, Min: ${minV}, Max: ${maxV}`,
    };
}
