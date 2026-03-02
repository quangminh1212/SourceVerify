/**
 * Skin Texture Realism
 * Algorithm: gradientDir
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSkinTextureRealism(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Skin Texture Realism", nameKey: "signal.skinTextureRealism", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.skinTextureRealism.error", icon: "🧑" };
    }
let hGrad=0,vGrad=0,total=0;
for(let y=1;y<h-1;y+=3){for(let x=1;x<w-1;x+=3){const i=(y*w+x)*4;
const gH=Math.abs(pixels[i+4]-pixels[i-4]);const gV=Math.abs(pixels[i+w*4]-pixels[i-w*4]);
hGrad+=gH;vGrad+=gV;total++;}}
const hAvg=total>0?hGrad/total:0,vAvg=total>0?vGrad/total:0;
const dirRatio=Math.max(hAvg,vAvg)>0?Math.min(hAvg,vAvg)/Math.max(hAvg,vAvg):1;
let score;if(dirRatio>0.9)score=68;else if(dirRatio>0.7)score=55;else if(dirRatio<0.4)score=30;else score=44;
const details=`Dir ratio: ${dirRatio.toFixed(3)}, H: ${hAvg.toFixed(2)}, V: ${vAvg.toFixed(2)}.`;
    return {
        name: "Skin Texture Realism", nameKey: "signal.skinTextureRealism", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Skin Texture Realism — potential AI artifact" : "Natural skin texture realism — authentic",
        descriptionKey: score > 55 ? "signal.skinTextureRealism.ai" : "signal.skinTextureRealism.real", icon: "🧑",
        details,
    };
}
