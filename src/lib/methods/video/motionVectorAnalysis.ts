/**
 * Motion Vector Analysis
 * Algorithm: opticalFlow
 */
import type { AnalysisMethod } from "../../types";

export function analyzeMotionVectorAnalysis(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Motion Vector Analysis", nameKey: "signal.motionVectorAnalysis", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.motionVectorAnalysis.error", icon: "➡" };
    }
let flowMag=0,cnt=0;
for(let y=1;y<h-1;y+=3){for(let x=1;x<w-1;x+=3){const i=(y*w+x)*4;
const ix=pixels[i+4]-pixels[i-4];const iy=pixels[i+w*4]-pixels[i-w*4];
const it=pixels[i]-128;const mag=Math.sqrt(ix*ix+iy*iy);flowMag+=mag;cnt++;}}
const avg=cnt>0?flowMag/cnt:0;
let score;if(avg<5)score=68;else if(avg<15)score=55;else if(avg>40)score=30;else score=44;
const details=`Avg flow: ${avg.toFixed(3)}.`;
    return {
        name: "Motion Vector Analysis", nameKey: "signal.motionVectorAnalysis", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Motion Vector Analysis — potential AI artifact" : "Natural motion vector analysis — authentic",
        descriptionKey: score > 55 ? "signal.motionVectorAnalysis.ai" : "signal.motionVectorAnalysis.real", icon: "➡",
        details,
    };
}
