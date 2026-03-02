/**
 * Chroma Bleed
 * Algorithm: chromaDiff
 */
import type { AnalysisMethod } from "../../types";

export function analyzeChromaBleed(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Chroma Bleed", nameKey: "signal.chromaBleed", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.chromaBleed.error", icon: "🌈" };
    }
let bleed=0,total=0;
for(let y=0;y<h;y+=3){for(let x=1;x<w-1;x+=3){const i=(y*w+x)*4;const j=(y*w+x+1)*4;
const hueDiff=Math.abs((pixels[i]-pixels[i+1])-(pixels[j]-pixels[j+1]));
if(hueDiff>40)bleed++;total++;}}
const ratio=total>0?bleed/total:0;
let score;if(ratio>0.2)score=65;else if(ratio>0.08)score=52;else if(ratio<0.01)score=35;else score=44;
const details=`Chroma bleed: ${ratio.toFixed(4)}.`;
    return {
        name: "Chroma Bleed", nameKey: "signal.chromaBleed", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Chroma Bleed — potential AI artifact" : "Natural chroma bleed — authentic",
        descriptionKey: score > 55 ? "signal.chromaBleed.ai" : "signal.chromaBleed.real", icon: "🌈",
        details,
    };
}
