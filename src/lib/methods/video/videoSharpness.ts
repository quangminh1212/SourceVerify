/**
 * Video Sharpness
 * Algorithm: laplacian
 */
import type { AnalysisMethod } from "../../types";

export function analyzeVideoSharpness(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Video Sharpness", nameKey: "signal.videoSharpness", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.videoSharpness.error", icon: "🔪" };
    }
let lapSum=0,cnt=0;
for(let y=1;y<h-1;y+=2){for(let x=1;x<w-1;x+=2){const i=(y*w+x)*4;
const c=pixels[i]*0.587;const l=pixels[(i-w*4)]*0.587;const r2=pixels[(i+w*4)]*0.587;
const le=pixels[(i-4)]*0.587;const ri=pixels[(i+4)]*0.587;
lapSum+=Math.abs(4*c-l-r2-le-ri);cnt++;}}
const avg=cnt>0?lapSum/cnt:0;
let score;if(avg<3)score=68;else if(avg<10)score=55;else if(avg>25)score=30;else score=44;
const details=`Laplacian var: ${avg.toFixed(3)}.`;
    return {
        name: "Video Sharpness", nameKey: "signal.videoSharpness", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Video Sharpness — potential AI artifact" : "Natural video sharpness — authentic",
        descriptionKey: score > 55 ? "signal.videoSharpness.ai" : "signal.videoSharpness.real", icon: "🔪",
        details,
    };
}
