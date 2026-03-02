/**
 * Object Boundary
 * Algorithm: cannyLike
 */
import type { AnalysisMethod } from "../../types";

export function analyzeObjectBoundary(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Object Boundary", nameKey: "signal.objectBoundary", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.objectBoundary.error", icon: "🔳" };
    }
let strong=0,weak=0,total=0;
for(let y=1;y<h-1;y+=2){for(let x=1;x<w-1;x+=2){const i=(y*w+x)*4;
const gx=pixels[i+4]-pixels[i-4];const gy=pixels[i+w*4]-pixels[i-w*4];
const mag=Math.sqrt(gx*gx+gy*gy);if(mag>50)strong++;else if(mag>20)weak++;total++;}}
const strongR=total>0?strong/total:0;const weakR=total>0?weak/total:0;
let score;if(strongR>0.15)score=38;else if(strongR>0.05)score=48;else if(strongR<0.01)score=65;else score=50;
const details=`Strong edges: ${(strongR*100).toFixed(1)}%, Weak: ${(weakR*100).toFixed(1)}%.`;
    return {
        name: "Object Boundary", nameKey: "signal.objectBoundary", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Object Boundary — potential AI artifact" : "Natural object boundary — authentic",
        descriptionKey: score > 55 ? "signal.objectBoundary.ai" : "signal.objectBoundary.real", icon: "🔳",
        details,
    };
}
