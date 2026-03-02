/**
 * Teeth Consistency
 * Algorithm: brightnessCluster
 */
import type { AnalysisMethod } from "../../types";

export function analyzeTeethConsistency(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Teeth Consistency", nameKey: "signal.teethConsistency", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.teethConsistency.error", icon: "🦷" };
    }
let bright=0,dark=0,mid=0;const n=pixels.length/4;
for(let i=0;i<pixels.length;i+=4){const g=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;if(g>200)bright++;else if(g<50)dark++;else mid++;}
const brightR=bright/n,darkR=dark/n;
let score;if(brightR>0.3&&darkR<0.1)score=65;else if(brightR<0.05)score=40;else score=50;
const details=`Bright: ${(brightR*100).toFixed(1)}%, Dark: ${(darkR*100).toFixed(1)}%.`;
    return {
        name: "Teeth Consistency", nameKey: "signal.teethConsistency", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Teeth Consistency — potential AI artifact" : "Natural teeth consistency — authentic",
        descriptionKey: score > 55 ? "signal.teethConsistency.ai" : "signal.teethConsistency.real", icon: "🦷",
        details,
    };
}
