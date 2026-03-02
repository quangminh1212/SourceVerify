/**
 * Hair Detail Analysis
 * Algorithm: spatialCorr
 */
import type { AnalysisMethod } from "../../types";

export function analyzeHairDetailAnalysis(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Hair Detail Analysis", nameKey: "signal.hairDetailAnalysis", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.hairDetailAnalysis.error", icon: "💇" };
    }
let autocorr=0,total=0;
for(let y=0;y<h;y+=4){for(let x=0;x<w-2;x+=4){const i=(y*w+x)*4;const j=(y*w+x+2)*4;
const g1=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;
const g2=pixels[j]*0.299+pixels[j+1]*0.587+pixels[j+2]*0.114;
autocorr+=g1*g2;total++;}}
const avgCorr=total>0?autocorr/(total*255*255):0;
let score;if(avgCorr>0.85)score=70;else if(avgCorr>0.7)score=58;else if(avgCorr<0.4)score=30;else score=45;
const details=`Autocorrelation: ${avgCorr.toFixed(4)}.`;
    return {
        name: "Hair Detail Analysis", nameKey: "signal.hairDetailAnalysis", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Hair Detail Analysis — potential AI artifact" : "Natural hair detail analysis — authentic",
        descriptionKey: score > 55 ? "signal.hairDetailAnalysis.ai" : "signal.hairDetailAnalysis.real", icon: "💇",
        details,
    };
}
