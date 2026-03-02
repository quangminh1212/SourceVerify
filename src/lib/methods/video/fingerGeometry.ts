/**
 * Finger Geometry
 * Algorithm: saturation
 */
import type { AnalysisMethod } from "../../types";

export function analyzeFingerGeometry(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Finger Geometry", nameKey: "signal.fingerGeometry", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.fingerGeometry.error", icon: "🖐" };
    }
let satSum=0,cnt=0;
for(let i=0;i<pixels.length;i+=8){const r=pixels[i],g=pixels[i+1],b=pixels[i+2];
const mx=Math.max(r,g,b),mn=Math.min(r,g,b);const sat=mx>0?(mx-mn)/mx:0;satSum+=sat;cnt++;}
const avgSat=cnt>0?satSum/cnt:0;
let score;if(avgSat<0.1)score=66;else if(avgSat<0.25)score=52;else if(avgSat>0.6)score=30;else score=44;
const details=`Avg saturation: ${avgSat.toFixed(4)}.`;
    return {
        name: "Finger Geometry", nameKey: "signal.fingerGeometry", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Finger Geometry — potential AI artifact" : "Natural finger geometry — authentic",
        descriptionKey: score > 55 ? "signal.fingerGeometry.ai" : "signal.fingerGeometry.real", icon: "🖐",
        details,
    };
}
