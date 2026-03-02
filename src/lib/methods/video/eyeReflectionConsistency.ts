/**
 * Eye Reflection Consistency
 * Algorithm: regionCompare
 */
import type { AnalysisMethod } from "../../types";

export function analyzeEyeReflectionConsistency(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Eye Reflection Consistency", nameKey: "signal.eyeReflectionConsistency", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.eyeReflectionConsistency.error", icon: "👁" };
    }
const midY=Math.floor(h/2),midX=Math.floor(w/2);
let tl=0,tr=0,bl=0,br=0,cnt=0;
for(let y=0;y<h;y+=2){for(let x=0;x<w;x+=2){const i=(y*w+x)*4;const g=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;
if(y<midY&&x<midX)tl+=g;else if(y<midY)tr+=g;else if(x<midX)bl+=g;else br+=g;cnt++;}}
const q=cnt/4;tl/=q;tr/=q;bl/=q;br/=q;
const maxDiff=Math.max(Math.abs(tl-tr),Math.abs(bl-br),Math.abs(tl-bl),Math.abs(tr-br));
let score;if(maxDiff<10)score=70;else if(maxDiff<25)score=58;else if(maxDiff>60)score=30;else score=44;
const details=`Max quad diff: ${maxDiff.toFixed(2)}, TL:${tl.toFixed(1)} TR:${tr.toFixed(1)} BL:${bl.toFixed(1)} BR:${br.toFixed(1)}.`;
    return {
        name: "Eye Reflection Consistency", nameKey: "signal.eyeReflectionConsistency", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Eye Reflection Consistency — potential AI artifact" : "Natural eye reflection consistency — authentic",
        descriptionKey: score > 55 ? "signal.eyeReflectionConsistency.ai" : "signal.eyeReflectionConsistency.real", icon: "👁",
        details,
    };
}
