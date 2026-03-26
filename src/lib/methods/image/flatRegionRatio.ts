/**
 * Flat Region Ratio
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeFlatRegionRatio(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Flat Region Ratio", nameKey: "signal.flatRegionRatio", category: "pixel", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.flatRegionRatio.error", icon: "⬜" };
    }
    let flat=0,textured=0;const step=2;for(let y=0;y<h-1;y+=step)for(let x=0;x<w-1;x+=step){const i=(y*w+x)*4;const d=Math.abs(p[i]-p[i+4])+Math.abs(p[i]-p[i+w*4]);if(d<4)flat++;else textured++;}const r=(flat+textured)>0?flat/(flat+textured):0;
    let score: number;
    if(r>0.8)score=70;else if(r>0.5)score=55;else if(r<0.2)score=28;else score=42;
    return {
        name: "Flat Region Ratio", nameKey: "signal.flatRegionRatio", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Flat Region Ratio pattern suggests AI generation" : "Natural flat region ratio — consistent with real image",
        descriptionKey: score > 55 ? "signal.flatRegionRatio.ai" : "signal.flatRegionRatio.real", icon: "⬜",
        details: `Flat: ${flat}, Textured: ${textured}, Ratio: ${r.toFixed(3)}`,
    };
}
