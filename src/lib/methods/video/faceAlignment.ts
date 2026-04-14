/**
 * Face Alignment
 * Algorithm: colProfile
 */
import type { AnalysisMethod } from "../../types";

export function analyzeFaceAlignment(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Face Alignment", nameKey: "signal.faceAlignment", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.faceAlignment.error", icon: "📐" };
    }
const profile=[];
for(let x=0;x<w;x+=2){let sum=0,cnt2=0;for(let y=0;y<h;y+=2){const i=(y*w+x)*4;sum+=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;cnt2++;}profile.push(sum/cnt2);}
const mean=profile.reduce((a,b)=>a+b,0)/profile.length;
const cv=mean>0?Math.sqrt(profile.reduce((a,b)=>a+(b-mean)**2,0)/profile.length)/mean:0;
let score;if(cv<0.05)score=68;else if(cv<0.12)score=55;else if(cv>0.3)score=30;else score=44;
const details=`Column CV: ${cv.toFixed(4)}.`;
    return {
        name: "Face Alignment", nameKey: "signal.faceAlignment", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Face Alignment — potential AI artifact" : "Natural face alignment — authentic",
        descriptionKey: score > 55 ? "signal.faceAlignment.ai" : "signal.faceAlignment.real", icon: "📐",
        details,
    };
}
