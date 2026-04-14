/**
 * Lens Distortion
 * Algorithm: radialDist
 */
import type { AnalysisMethod } from "../../types";

export function analyzeLensDistortionVideo(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Lens Distortion", nameKey: "signal.lensDistortionVideo", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.lensDistortionVideo.error", icon: "🔍" };
    }
const cx=w/2,cy=h/2;let innerM=0,outerM=0,iC=0,oC=0;const maxR=Math.sqrt(cx*cx+cy*cy);
for(let y=0;y<h;y+=4){for(let x=0;x<w;x+=4){const d=Math.sqrt((x-cx)**2+(y-cy)**2)/maxR;
const i=(y*w+x)*4;const g=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;
if(d<0.3){innerM+=g;iC++;}else if(d>0.7){outerM+=g;oC++;}}}
const iAvg=iC>0?innerM/iC:128;const oAvg=oC>0?outerM/oC:128;const falloff=Math.abs(iAvg-oAvg);
let score;if(falloff<5)score=60;else if(falloff<15)score=50;else if(falloff>40)score=35;else score=44;
const details=`Radial falloff: ${falloff.toFixed(2)}.`;
    return {
        name: "Lens Distortion", nameKey: "signal.lensDistortionVideo", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Lens Distortion — potential AI artifact" : "Natural lens distortion — authentic",
        descriptionKey: score > 55 ? "signal.lensDistortionVideo.ai" : "signal.lensDistortionVideo.real", icon: "🔍",
        details,
    };
}
