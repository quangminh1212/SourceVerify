/**
 * Eyebrow Naturalness
 * Algorithm: horizLine
 */
import type { AnalysisMethod } from "../../types";

export function analyzeEyebrowNaturalness(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Eyebrow Naturalness", nameKey: "signal.eyebrowNaturalness", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.eyebrowNaturalness.error", icon: "🤨" };
    }
let lineE=0,cnt=0;
for(let y=Math.floor(h*0.15);y<Math.floor(h*0.4);y+=2){let rowE=0;for(let x=1;x<w-1;x++){const i=(y*w+x)*4;rowE+=Math.abs(pixels[i+4]-pixels[i-4]);}lineE+=rowE/w;cnt++;}
const avgLine=cnt>0?lineE/cnt:0;
let score;if(avgLine<5)score=68;else if(avgLine<12)score=55;else if(avgLine>25)score=32;else score=44;
const details=`Horiz edge: ${avgLine.toFixed(3)}.`;
    return {
        name: "Eyebrow Naturalness", nameKey: "signal.eyebrowNaturalness", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Eyebrow Naturalness — potential AI artifact" : "Natural eyebrow naturalness — authentic",
        descriptionKey: score > 55 ? "signal.eyebrowNaturalness.ai" : "signal.eyebrowNaturalness.real", icon: "🤨",
        details,
    };
}
