/**
 * Pupil Dilation
 * Algorithm: centerWeight
 */
import type { AnalysisMethod } from "../../types";

export function analyzePupilDilation(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Pupil Dilation", nameKey: "signal.pupilDilation", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.pupilDilation.error", icon: "👁" };
    }
let centerE=0,borderE=0,cCnt=0,bCnt=0;const cx=w/2,cy=h/2,r=Math.min(w,h)/4;
for(let y=0;y<h;y+=3){for(let x=0;x<w;x+=3){const i=(y*w+x)*4;const g=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;
const d=Math.sqrt((x-cx)**2+(y-cy)**2);if(d<r){centerE+=g;cCnt++;}else{borderE+=g;bCnt++;}}}
const cMean=cCnt>0?centerE/cCnt:128;const bMean=bCnt>0?borderE/bCnt:128;const ratio=bMean>0?cMean/bMean:1;
let score;if(Math.abs(ratio-1)<0.05)score=68;else if(Math.abs(ratio-1)<0.15)score=55;else score=38;
const details=`Center/border: ${ratio.toFixed(3)}.`;
    return {
        name: "Pupil Dilation", nameKey: "signal.pupilDilation", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Pupil Dilation — potential AI artifact" : "Natural pupil dilation — authentic",
        descriptionKey: score > 55 ? "signal.pupilDilation.ai" : "signal.pupilDilation.real", icon: "👁",
        details,
    };
}
