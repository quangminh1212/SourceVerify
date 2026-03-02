/**
 * Pixel Repetition
 * Algorithm: repetition
 */
import type { AnalysisMethod } from "../../types";

export function analyzePixelRepetitionVideo(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Pixel Repetition", nameKey: "signal.pixelRepetitionVideo", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.pixelRepetitionVideo.error", icon: "🔲" };
    }
let repCount=0,total=0;
for(let y=0;y<h;y+=4){for(let x=0;x<w-8;x+=4){const i=(y*w+x)*4;const j=(y*w+x+8)*4;
if(Math.abs(pixels[i]-pixels[j])<2&&Math.abs(pixels[i+1]-pixels[j+1])<2&&Math.abs(pixels[i+2]-pixels[j+2])<2)repCount++;total++;}}
const ratio=total>0?repCount/total:0;
let score;if(ratio>0.5)score=70;else if(ratio>0.3)score=56;else if(ratio<0.05)score=30;else score=44;
const details=`Repetition: ${ratio.toFixed(4)}.`;
    return {
        name: "Pixel Repetition", nameKey: "signal.pixelRepetitionVideo", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Pixel Repetition — potential AI artifact" : "Natural pixel repetition — authentic",
        descriptionKey: score > 55 ? "signal.pixelRepetitionVideo.ai" : "signal.pixelRepetitionVideo.real", icon: "🔲",
        details,
    };
}
