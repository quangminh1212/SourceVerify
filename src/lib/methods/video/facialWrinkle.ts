/**
 * Facial Wrinkle Consistency
 * Algorithm: highFreq
 */
import type { AnalysisMethod } from "../../types";

export function analyzeFacialWrinkle(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Facial Wrinkle Consistency", nameKey: "signal.facialWrinkle", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.facialWrinkle.error", icon: "🔍" };
    }
let hf=0,total=0;
for(let y=1;y<h-1;y+=2){for(let x=1;x<w-1;x+=2){const i=(y*w+x)*4;
const c=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;
const l=-4*c+(pixels[(i-4)]*0.299+pixels[(i-4)+1]*0.587+pixels[(i-4)+2]*0.114)+(pixels[(i+4)]*0.299+pixels[(i+4)+1]*0.587+pixels[(i+4)+2]*0.114)+(pixels[(i-w*4)]*0.299+pixels[(i-w*4)+1]*0.587+pixels[(i-w*4)+2]*0.114)+(pixels[(i+w*4)]*0.299+pixels[(i+w*4)+1]*0.587+pixels[(i+w*4)+2]*0.114);
hf+=Math.abs(l);total++;}}
const avgHf=total>0?hf/total:0;
let score;if(avgHf<3)score=70;else if(avgHf<8)score=56;else if(avgHf>20)score=30;else score=44;
const details=`High freq: ${avgHf.toFixed(3)}.`;
    return {
        name: "Facial Wrinkle Consistency", nameKey: "signal.facialWrinkle", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Facial Wrinkle Consistency — potential AI artifact" : "Natural facial wrinkle consistency — authentic",
        descriptionKey: score > 55 ? "signal.facialWrinkle.ai" : "signal.facialWrinkle.real", icon: "🔍",
        details,
    };
}
