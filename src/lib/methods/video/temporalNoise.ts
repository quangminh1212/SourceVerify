/**
 * Temporal Noise Pattern
 * Algorithm: noiseEst
 */
import type { AnalysisMethod } from "../../types";

export function analyzeTemporalNoise(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Temporal Noise Pattern", nameKey: "signal.temporalNoise", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.temporalNoise.error", icon: "🔊" };
    }
let noiseSum=0,cnt=0;
for(let y=2;y<h-2;y+=4){for(let x=2;x<w-2;x+=4){const i=(y*w+x)*4;
const c=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;
const neighbors=[pixels[(y*w+x-1)*4],pixels[(y*w+x+1)*4],pixels[((y-1)*w+x)*4],pixels[((y+1)*w+x)*4]];
const nMean=neighbors.reduce((a,b)=>a+b,0)/4;noiseSum+=Math.abs(c-nMean);cnt++;}}
const avgNoise=cnt>0?noiseSum/cnt:0;
let score;if(avgNoise<2)score=70;else if(avgNoise<6)score=56;else if(avgNoise>15)score=30;else score=44;
const details=`Noise level: ${avgNoise.toFixed(3)}.`;
    return {
        name: "Temporal Noise Pattern", nameKey: "signal.temporalNoise", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Temporal Noise Pattern — potential AI artifact" : "Natural temporal noise pattern — authentic",
        descriptionKey: score > 55 ? "signal.temporalNoise.ai" : "signal.temporalNoise.real", icon: "🔊",
        details,
    };
}
