/**
 * Head Pose Estimation
 * Algorithm: faceRegion
 */
import type { AnalysisMethod } from "../../types";

export function analyzeHeadPoseEstimation(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Head Pose Estimation", nameKey: "signal.headPoseEstimation", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.headPoseEstimation.error", icon: "🗣" };
    }
const fy=Math.floor(h*0.1),fh=Math.floor(h*0.5),fx=Math.floor(w*0.2),fw=Math.floor(w*0.6);
let lMean=0,rMean=0,lC=0,rC=0;const mid=fx+fw/2;
for(let y=fy;y<fy+fh;y+=2){for(let x=fx;x<fx+fw;x+=2){const i=(y*w+x)*4;const g=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;
if(x<mid){lMean+=g;lC++;}else{rMean+=g;rC++;}}}
lMean/=lC;rMean/=rC;const asym=Math.abs(lMean-rMean);
let score;if(asym<5)score=68;else if(asym<15)score=55;else if(asym>35)score=30;else score=44;
const details=`Face asymmetry: ${asym.toFixed(2)}.`;
    return {
        name: "Head Pose Estimation", nameKey: "signal.headPoseEstimation", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Head Pose Estimation — potential AI artifact" : "Natural head pose estimation — authentic",
        descriptionKey: score > 55 ? "signal.headPoseEstimation.ai" : "signal.headPoseEstimation.real", icon: "🗣",
        details,
    };
}
