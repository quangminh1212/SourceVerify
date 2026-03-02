/**
 * Shadow Temporal Consistency
 * Algorithm: darkRegion
 */
import type { AnalysisMethod } from "../../types";

export function analyzeShadowTemporal(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Shadow Temporal Consistency", nameKey: "signal.shadowTemporal", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.shadowTemporal.error", icon: "🌗" };
    }
let darkPx=0,totalPx=0,darkVar=0;const darkVals=[];
for(let i=0;i<pixels.length;i+=4){const g=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;totalPx++;if(g<60){darkPx++;darkVals.push(g);}}
const darkRatio=darkPx/totalPx;const dMean=darkVals.length>0?darkVals.reduce((a,b)=>a+b,0)/darkVals.length:0;
if(darkVals.length>1)darkVar=darkVals.reduce((a,b)=>a+(b-dMean)**2,0)/darkVals.length;
let score;if(darkRatio>0.4&&darkVar<50)score=65;else if(darkRatio<0.05)score=45;else score=50;
const details=`Dark ratio: ${darkRatio.toFixed(3)}, Dark var: ${darkVar.toFixed(2)}.`;
    return {
        name: "Shadow Temporal Consistency", nameKey: "signal.shadowTemporal", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Shadow Temporal Consistency — potential AI artifact" : "Natural shadow temporal consistency — authentic",
        descriptionKey: score > 55 ? "signal.shadowTemporal.ai" : "signal.shadowTemporal.real", icon: "🌗",
        details,
    };
}
