/**
 * Frame Edge Energy
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeFrameEdgeEnergy(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Frame Edge Energy", nameKey: "signal.frameEdgeEnergy", category: "frequency", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.frameEdgeEnergy.error", icon: "⚡" };
    }
    let topE=0,botE=0,tc=0,bc2=0;const step=3;for(let x=0;x<w-1;x+=step){for(let y=0;y<Math.min(10,h);y++){const i=(y*w+x)*4;topE+=Math.abs(p[i]-p[i+4]);tc++;}for(let y=h-Math.min(10,h);y<h-1;y++){const i=(y*w+x)*4;botE+=Math.abs(p[i]-p[i+4]);bc2++;}}const tAvg=tc>0?topE/tc:0,bAvg=bc2>0?botE/bc2:0;const diff=Math.abs(tAvg-bAvg);
    let score: number;
    if(diff<1)score=64;else if(diff<4)score=48;else if(diff>10)score=32;else score=44;
    return {
        name: "Frame Edge Energy", nameKey: "signal.frameEdgeEnergy", category: "frequency", score, weight: 0.2,
        description: score > 55 ? "Frame Edge Energy pattern suggests deepfake" : "Natural frame edge energy — consistent with real video",
        descriptionKey: score > 55 ? "signal.frameEdgeEnergy.ai" : "signal.frameEdgeEnergy.real", icon: "⚡",
        details: `Top: ${tAvg.toFixed(2)}, Bot: ${bAvg.toFixed(2)}`,
    };
}
