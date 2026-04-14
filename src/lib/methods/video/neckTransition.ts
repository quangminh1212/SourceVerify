/**
 * Neck Transition
 * Algorithm: bottomGrad
 */
import type { AnalysisMethod } from "../../types";

export function analyzeNeckTransition(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Neck Transition", nameKey: "signal.neckTransition", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.neckTransition.error", icon: "🔽" };
    }
const botStart=Math.floor(h*0.7);let gradSum=0,cnt=0;
for(let y=botStart;y<h-1;y+=2){for(let x=0;x<w;x+=3){const i1=(y*w+x)*4,i2=((y+1)*w+x)*4;
const g1=pixels[i1]*0.299+pixels[i1+1]*0.587+pixels[i1+2]*0.114;
const g2=pixels[i2]*0.299+pixels[i2+1]*0.587+pixels[i2+2]*0.114;
gradSum+=Math.abs(g1-g2);cnt++;}}
const avg=cnt>0?gradSum/cnt:0;
let score;if(avg<2)score=68;else if(avg<6)score=55;else if(avg>15)score=30;else score=44;
const details=`Bottom gradient: ${avg.toFixed(3)}.`;
    return {
        name: "Neck Transition", nameKey: "signal.neckTransition", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Neck Transition — potential AI artifact" : "Natural neck transition — authentic",
        descriptionKey: score > 55 ? "signal.neckTransition.ai" : "signal.neckTransition.real", icon: "🔽",
        details,
    };
}
