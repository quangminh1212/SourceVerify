/**
 * Video Grain
 * Algorithm: grainNoise
 */
import type { AnalysisMethod } from "../../types";

export function analyzeVideoGrainAnalysis(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Video Grain", nameKey: "signal.videoGrainAnalysis", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.videoGrainAnalysis.error", icon: "🎞" };
    }
let hfEnergy=0,lfEnergy=0,cnt=0;
for(let y=1;y<h-1;y+=3){for(let x=1;x<w-1;x+=3){const i=(y*w+x)*4;
const c=pixels[i];const n2=pixels[i-4]+pixels[i+4]+pixels[i-w*4]+pixels[i+w*4];
const hf=Math.abs(4*c-n2);const lf=Math.abs(c-n2/4);hfEnergy+=hf;lfEnergy+=lf;cnt++;}}
const hfAvg=cnt>0?hfEnergy/cnt:0;const lfAvg=cnt>0?lfEnergy/cnt:0;const ratio=lfAvg>0?hfAvg/lfAvg:1;
let score;if(ratio<0.5)score=65;else if(ratio<1.2)score=52;else if(ratio>3)score=30;else score=44;
const details=`HF/LF ratio: ${ratio.toFixed(3)}.`;
    return {
        name: "Video Grain", nameKey: "signal.videoGrainAnalysis", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Video Grain — potential AI artifact" : "Natural video grain — authentic",
        descriptionKey: score > 55 ? "signal.videoGrainAnalysis.ai" : "signal.videoGrainAnalysis.real", icon: "🎞",
        details,
    };
}
