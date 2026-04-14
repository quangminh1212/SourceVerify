/**
 * Shoulder Alignment
 * Algorithm: horizSymmetry
 */
import type { AnalysisMethod } from "../../types";

export function analyzeShoulderAlignment(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Shoulder Alignment", nameKey: "signal.shoulderAlignment", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.shoulderAlignment.error", icon: "🤷" };
    }
let leftG=0,rightG=0,cnt=0;
for(let y=Math.floor(h*0.6);y<h;y+=3){for(let x=0;x<w;x+=3){const i=(y*w+x)*4;
const g=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;if(x<w/2)leftG+=g;else rightG+=g;cnt++;}}
const diff=Math.abs(leftG-rightG)/(cnt/2*128);
let score;if(diff<0.02)score=68;else if(diff<0.06)score=55;else if(diff>0.2)score=30;else score=44;
const details=`LR diff: ${diff.toFixed(4)}.`;
    return {
        name: "Shoulder Alignment", nameKey: "signal.shoulderAlignment", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Shoulder Alignment — potential AI artifact" : "Natural shoulder alignment — authentic",
        descriptionKey: score > 55 ? "signal.shoulderAlignment.ai" : "signal.shoulderAlignment.real", icon: "🤷",
        details,
    };
}
