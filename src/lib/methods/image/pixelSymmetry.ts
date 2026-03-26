/**
 * Pixel Symmetry
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzePixelSymmetry(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Pixel Symmetry", nameKey: "signal.pixelSymmetry", category: "pixel", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.pixelSymmetry.error", icon: "🪞" };
    }
    let symDiff=0,cnt=0;const step=3;for(let y=0;y<h;y+=step)for(let x=0;x<w/2;x+=step){const l=(y*w+x)*4,r2=(y*w+(w-1-x))*4;symDiff+=Math.abs(p[l]-p[r2])+Math.abs(p[l+1]-p[r2+1])+Math.abs(p[l+2]-p[r2+2]);cnt++;}const avgSym=cnt>0?symDiff/(cnt*3):0;
    let score: number;
    if(avgSym<5)score=70;else if(avgSym<15)score=52;else if(avgSym>40)score=28;else score=44;
    return {
        name: "Pixel Symmetry", nameKey: "signal.pixelSymmetry", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Pixel Symmetry pattern suggests AI generation" : "Natural pixel symmetry — consistent with real image",
        descriptionKey: score > 55 ? "signal.pixelSymmetry.ai" : "signal.pixelSymmetry.real", icon: "🪞",
        details: `Symmetry diff: ${avgSym.toFixed(2)}`,
    };
}
