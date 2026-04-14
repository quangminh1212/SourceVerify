/**
 * Frame Energy Distribution
 * Algorithm: energy
 */
import type { AnalysisMethod } from "../../types";

export function analyzeFrameEnergy(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Frame Energy Distribution", nameKey: "signal.frameEnergy", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.frameEnergy.error", icon: "⚡" };
    }
let energy=0;const n=pixels.length/4;
for(let i=0;i<pixels.length;i+=4){const g=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;energy+=g*g;}
const rmsE=Math.sqrt(energy/n);const normE=rmsE/255;
let score;if(normE<0.3)score=62;else if(normE<0.5)score=50;else if(normE>0.8)score=35;else score=44;
const details=`RMS energy: ${rmsE.toFixed(2)}, Normalized: ${normE.toFixed(4)}.`;
    return {
        name: "Frame Energy Distribution", nameKey: "signal.frameEnergy", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Frame Energy Distribution — potential AI artifact" : "Natural frame energy distribution — authentic",
        descriptionKey: score > 55 ? "signal.frameEnergy.ai" : "signal.frameEnergy.real", icon: "⚡",
        details,
    };
}
