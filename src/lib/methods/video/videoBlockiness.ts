/**
 * Video Blockiness
 * Algorithm: blockBound
 */
import type { AnalysisMethod } from "../../types";

export function analyzeVideoBlockiness(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Video Blockiness", nameKey: "signal.videoBlockiness", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.videoBlockiness.error", icon: "⬜" };
    }
const bs3=8;let boundDiff=0,innerDiff=0,bCnt2=0,iCnt=0;
for(let y=bs3;y<h-1;y+=bs3){for(let x=0;x<w;x+=2){const i=(y*w+x)*4;const j=((y-1)*w+x)*4;
boundDiff+=Math.abs(pixels[i]-pixels[j]);bCnt2++;}}
for(let y=1;y<h-1;y++){if(y%bs3===0)continue;for(let x=0;x<w;x+=8){const i=(y*w+x)*4;const j=((y-1)*w+x)*4;
innerDiff+=Math.abs(pixels[i]-pixels[j]);iCnt++;}}
const bAvg=bCnt2>0?boundDiff/bCnt2:0;const iAvg=iCnt>0?innerDiff/iCnt:1;const blockRatio=iAvg>0?bAvg/iAvg:1;
let score;if(blockRatio>2)score=68;else if(blockRatio>1.4)score=55;else if(blockRatio<0.8)score=35;else score=44;
const details=`Block ratio: ${blockRatio.toFixed(3)}.`;
    return {
        name: "Video Blockiness", nameKey: "signal.videoBlockiness", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Video Blockiness — potential AI artifact" : "Natural video blockiness — authentic",
        descriptionKey: score > 55 ? "signal.videoBlockiness.ai" : "signal.videoBlockiness.real", icon: "⬜",
        details,
    };
}
