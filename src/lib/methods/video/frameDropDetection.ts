/**
 * Frame Drop Detection
 * Algorithm: edgeVariant
 */
import type { AnalysisMethod } from "../../types";

export function analyzeFrameDropDetection(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Frame Drop Detection", nameKey: "signal.frameDropDetection", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.frameDropDetection.error", icon: "📉" };
    }
let edgeCount=0,total=0;
for(let y=1;y<h-1;y+=2){for(let x=1;x<w-1;x+=2){const i=(y*w+x)*4;
const gx=pixels[i+4]-pixels[i-4]+2*(pixels[i+4+1]-pixels[i-4+1])+pixels[i+4+2]-pixels[i-4+2];
const gy=pixels[(i+w*4)]-pixels[(i-w*4)]+2*(pixels[(i+w*4)+1]-pixels[(i-w*4)+1]);
const mag=Math.sqrt(gx*gx+gy*gy);if(mag>30)edgeCount++;total++;}}
const edgeRatio=total>0?edgeCount/total:0;
let score;if(edgeRatio>0.4)score=35;else if(edgeRatio>0.25)score=45;else if(edgeRatio<0.05)score=70;else score=52;
const details=`Edge ratio: ${edgeRatio.toFixed(4)}, Edges: ${edgeCount}/${total}.`;
    return {
        name: "Frame Drop Detection", nameKey: "signal.frameDropDetection", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Frame Drop Detection — potential AI artifact" : "Natural frame drop detection — authentic",
        descriptionKey: score > 55 ? "signal.frameDropDetection.ai" : "signal.frameDropDetection.real", icon: "📉",
        details,
    };
}
