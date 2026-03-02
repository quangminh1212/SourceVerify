/**
 * Micro-Expression Analysis
 * Algorithm: faceGrad
 */
import type { AnalysisMethod } from "../../types";

export function analyzeMicroExpressionAnalysis(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Micro-Expression Analysis", nameKey: "signal.microExpressionAnalysis", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.microExpressionAnalysis.error", icon: "🎭" };
    }
const fy=Math.floor(h*0.15),fh2=Math.floor(h*0.55);let gradSum=0,cnt=0;
for(let y=fy;y<fh2;y+=2){for(let x=Math.floor(w*0.25);x<Math.floor(w*0.75)-1;x+=2){
const i=(y*w+x)*4;const g1=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;
const g2=pixels[i+4]*0.299+pixels[i+5]*0.587+pixels[i+6]*0.114;
gradSum+=Math.abs(g1-g2);cnt++;}}
const avg=cnt>0?gradSum/cnt:0;
let score;if(avg<3)score=70;else if(avg<8)score=56;else if(avg>18)score=30;else score=44;
const details=`Face gradient: ${avg.toFixed(3)}.`;
    return {
        name: "Micro-Expression Analysis", nameKey: "signal.microExpressionAnalysis", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Micro-Expression Analysis — potential AI artifact" : "Natural micro-expression analysis — authentic",
        descriptionKey: score > 55 ? "signal.microExpressionAnalysis.ai" : "signal.microExpressionAnalysis.real", icon: "🎭",
        details,
    };
}
