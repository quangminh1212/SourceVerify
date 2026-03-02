/**
 * Nose Geometry
 * Algorithm: vertProfile
 */
import type { AnalysisMethod } from "../../types";

export function analyzeNoseGeometry(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Nose Geometry", nameKey: "signal.noseGeometry", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.noseGeometry.error", icon: "👃" };
    }
const profile=[];
for(let y=0;y<h;y++){let sum=0;for(let x=Math.floor(w*0.3);x<Math.floor(w*0.7);x++){const i=(y*w+x)*4;sum+=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;}profile.push(sum/Math.floor(w*0.4));}
let diffs=0;for(let i=1;i<profile.length;i++)diffs+=Math.abs(profile[i]-profile[i-1]);
const avgDiff=profile.length>1?diffs/(profile.length-1):0;
let score;if(avgDiff<1.5)score=70;else if(avgDiff<4)score=56;else if(avgDiff>10)score=30;else score=44;
const details=`Vertical diff: ${avgDiff.toFixed(3)}.`;
    return {
        name: "Nose Geometry", nameKey: "signal.noseGeometry", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Nose Geometry — potential AI artifact" : "Natural nose geometry — authentic",
        descriptionKey: score > 55 ? "signal.noseGeometry.ai" : "signal.noseGeometry.real", icon: "👃",
        details,
    };
}
