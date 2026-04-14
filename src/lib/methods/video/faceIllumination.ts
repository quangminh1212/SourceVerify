/**
 * Face Illumination
 * Algorithm: illumination
 */
import type { AnalysisMethod } from "../../types";

export function analyzeFaceIllumination(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Face Illumination", nameKey: "signal.faceIllumination", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.faceIllumination.error", icon: "💡" };
    }
const strips=8;const means=[];
for(let s=0;s<strips;s++){const y1=Math.floor(s*h/strips),y2=Math.floor((s+1)*h/strips);let sum=0,cnt=0;
for(let y=y1;y<y2;y+=2){for(let x=0;x<w;x+=2){const i=(y*w+x)*4;sum+=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;cnt++;}}
means.push(cnt>0?sum/cnt:128);}
const mMean=means.reduce((a,b)=>a+b,0)/means.length;
const mCV=mMean>0?Math.sqrt(means.reduce((a,b)=>a+(b-mMean)**2,0)/means.length)/mMean:0;
let score;if(mCV<0.05)score=68;else if(mCV<0.12)score=55;else if(mCV>0.3)score=30;else score=44;
const details=`Illum CV: ${mCV.toFixed(4)}.`;
    return {
        name: "Face Illumination", nameKey: "signal.faceIllumination", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Face Illumination — potential AI artifact" : "Natural face illumination — authentic",
        descriptionKey: score > 55 ? "signal.faceIllumination.ai" : "signal.faceIllumination.real", icon: "💡",
        details,
    };
}
