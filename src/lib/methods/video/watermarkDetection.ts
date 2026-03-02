/**
 * Watermark Detection
 * Algorithm: cornerAnalysis
 */
import type { AnalysisMethod } from "../../types";

export function analyzeWatermarkDetection(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Watermark Detection", nameKey: "signal.watermarkDetection", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.watermarkDetection.error", icon: "🔍" };
    }
const cs=Math.min(64,Math.floor(Math.min(w,h)/4));
let cornerE=0,centerE=0,cCnt=0,eCnt=0;
for(let y=0;y<cs;y++){for(let x=w-cs;x<w;x++){const i=(y*w+x)*4;cornerE+=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;eCnt++;}}
for(let y=Math.floor(h/3);y<Math.floor(2*h/3);y+=2){for(let x=Math.floor(w/3);x<Math.floor(2*w/3);x+=2){const i=(y*w+x)*4;centerE+=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;cCnt++;}}
const cM=cCnt>0?centerE/cCnt:128;const eM=eCnt>0?cornerE/eCnt:128;const diff=Math.abs(cM-eM);
let score;if(diff>30)score=60;else if(diff>15)score=50;else score=42;
const details=`Corner-center diff: ${diff.toFixed(2)}.`;
    return {
        name: "Watermark Detection", nameKey: "signal.watermarkDetection", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Watermark Detection — potential AI artifact" : "Natural watermark detection — authentic",
        descriptionKey: score > 55 ? "signal.watermarkDetection.ai" : "signal.watermarkDetection.real", icon: "🔍",
        details,
    };
}
