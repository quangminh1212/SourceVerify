/**
 * Depth Consistency
 * Algorithm: gradMag
 */
import type { AnalysisMethod } from "../../types";

export function analyzeDepthConsistency(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Depth Consistency", nameKey: "signal.depthConsistency", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.depthConsistency.error", icon: "🔭" };
    }
let totalGrad=0,cnt=0;
for(let y=1;y<h-1;y+=3){for(let x=1;x<w-1;x+=3){const i=(y*w+x)*4;
const g=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;
const gx=(pixels[i+4]*0.299+pixels[i+5]*0.587+pixels[i+6]*0.114)-g;
const gy=(pixels[i+w*4]*0.299+pixels[i+w*4+1]*0.587+pixels[i+w*4+2]*0.114)-g;
totalGrad+=Math.sqrt(gx*gx+gy*gy);cnt++;}}
const avg=cnt>0?totalGrad/cnt:0;
let score;if(avg<5)score=68;else if(avg<12)score=55;else if(avg>30)score=30;else score=44;
const details=`Avg gradient mag: ${avg.toFixed(3)}.`;
    return {
        name: "Depth Consistency", nameKey: "signal.depthConsistency", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Depth Consistency — potential AI artifact" : "Natural depth consistency — authentic",
        descriptionKey: score > 55 ? "signal.depthConsistency.ai" : "signal.depthConsistency.real", icon: "🔭",
        details,
    };
}
