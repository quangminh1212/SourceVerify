/**
 * Edge Ringing
 * Algorithm: ringing
 */
import type { AnalysisMethod } from "../../types";

export function analyzeEdgeRinging(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Edge Ringing", nameKey: "signal.edgeRinging", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.edgeRinging.error", icon: "〰" };
    }
let ring=0,total=0;
for(let y=2;y<h-2;y+=3){for(let x=2;x<w-2;x+=3){const i=(y*w+x)*4;
const g0=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;
const g1=pixels[(i+8)]*0.299+pixels[(i+9)]*0.587+pixels[(i+10)]*0.114;
const g2=pixels[(i+16)]*0.299+pixels[(i+17)]*0.587+pixels[(i+18)]*0.114;
if((g1-g0)*(g2-g1)<0&&Math.abs(g1-g0)>10)ring++;total++;}}
const ratio=total>0?ring/total:0;
let score;if(ratio>0.3)score=65;else if(ratio>0.15)score=52;else if(ratio<0.02)score=35;else score=44;
const details=`Ring ratio: ${ratio.toFixed(4)}.`;
    return {
        name: "Edge Ringing", nameKey: "signal.edgeRinging", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Edge Ringing — potential AI artifact" : "Natural edge ringing — authentic",
        descriptionKey: score > 55 ? "signal.edgeRinging.ai" : "signal.edgeRinging.real", icon: "〰",
        details,
    };
}
