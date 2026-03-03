/**
 * Isolated Pixel
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeIsolatedPixel(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Isolated Pixel", nameKey: "signal.isolatedPixel", category: "pixel", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.isolatedPixel.error", icon: "🔵" };
    }
    let isolated=0,cnt=0;const step=2;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const c=p[i];const nb=[p[i-4],p[i+4],p[i-w*4],p[i+w*4]];const avgN=nb.reduce((a,b)=>a+b,0)/4;if(Math.abs(c-avgN)>40)isolated++;cnt++;}const r=cnt>0?isolated/cnt:0;
    let score: number;
    if(r<0.001)score=64;else if(r<0.01)score=48;else if(r>0.05)score=30;else score=44;
    return {
        name: "Isolated Pixel", nameKey: "signal.isolatedPixel", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Isolated Pixel pattern suggests AI generation" : "Natural isolated pixel — consistent with real image",
        descriptionKey: score > 55 ? "signal.isolatedPixel.ai" : "signal.isolatedPixel.real", icon: "🔵",
        details: `Isolated: ${isolated}, Ratio: ${r.toFixed(5)}`,
    };
}
