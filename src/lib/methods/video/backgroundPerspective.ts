/**
 * Background Perspective
 * Algorithm: depthHint
 */
import type { AnalysisMethod } from "../../types";

export function analyzeBackgroundPerspective(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Background Perspective", nameKey: "signal.backgroundPerspective", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.backgroundPerspective.error", icon: "🏞" };
    }
const topMean=Array(3).fill(0),botMean=Array(3).fill(0);let tC=0,bC=0;
for(let y=0;y<h;y+=3){for(let x=0;x<w;x+=3){const i=(y*w+x)*4;if(y<h/3){topMean[0]+=pixels[i];topMean[1]+=pixels[i+1];topMean[2]+=pixels[i+2];tC++;}
else if(y>2*h/3){botMean[0]+=pixels[i];botMean[1]+=pixels[i+1];botMean[2]+=pixels[i+2];bC++;}}}
const diff=Math.sqrt(Math.pow((topMean[0]/tC-botMean[0]/bC),2)+Math.pow((topMean[1]/tC-botMean[1]/bC),2)+Math.pow((topMean[2]/tC-botMean[2]/bC),2));
let score;if(diff<15)score=65;else if(diff<40)score=50;else if(diff>80)score=30;else score=44;
const details=`Top-bottom color diff: ${diff.toFixed(2)}.`;
    return {
        name: "Background Perspective", nameKey: "signal.backgroundPerspective", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Background Perspective — potential AI artifact" : "Natural background perspective — authentic",
        descriptionKey: score > 55 ? "signal.backgroundPerspective.ai" : "signal.backgroundPerspective.real", icon: "🏞",
        details,
    };
}
