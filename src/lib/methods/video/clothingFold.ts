/**
 * Clothing Fold Physics
 * Algorithm: edgeDensity
 */
import type { AnalysisMethod } from "../../types";

export function analyzeClothingFold(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Clothing Fold Physics", nameKey: "signal.clothingFold", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.clothingFold.error", icon: "👔" };
    }
let edges=0,total=0;
for(let y=Math.floor(h*0.5);y<h-1;y+=2){for(let x=1;x<w-1;x+=2){const i=(y*w+x)*4;
const gx=Math.abs(pixels[i+4]-pixels[i-4]);const gy=Math.abs(pixels[i+w*4]-pixels[i-w*4]);
if(gx+gy>20)edges++;total++;}}
const ratio=total>0?edges/total:0;
let score;if(ratio<0.1)score=66;else if(ratio<0.25)score=52;else if(ratio>0.5)score=30;else score=44;
const details=`Lower edge density: ${ratio.toFixed(4)}.`;
    return {
        name: "Clothing Fold Physics", nameKey: "signal.clothingFold", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Clothing Fold Physics — potential AI artifact" : "Natural clothing fold physics — authentic",
        descriptionKey: score > 55 ? "signal.clothingFold.ai" : "signal.clothingFold.real", icon: "👔",
        details,
    };
}
