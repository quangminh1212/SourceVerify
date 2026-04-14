/**
 * Forehead Texture
 * Algorithm: topRegion
 */
import type { AnalysisMethod } from "../../types";

export function analyzeForeheadTexture(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Forehead Texture", nameKey: "signal.foreheadTexture", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.foreheadTexture.error", icon: "🧠" };
    }
const topH=Math.floor(h*0.3);let variance=0,mean=0,cnt=0;
for(let y=0;y<topH;y+=2){for(let x=0;x<w;x+=2){const i=(y*w+x)*4;mean+=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;cnt++;}}
mean/=cnt;for(let y=0;y<topH;y+=2){for(let x=0;x<w;x+=2){const i=(y*w+x)*4;const g=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;variance+=(g-mean)**2;}}
variance/=cnt;const std=Math.sqrt(variance);
let score;if(std<15)score=70;else if(std<30)score=56;else if(std>60)score=30;else score=44;
const details=`Top std: ${std.toFixed(2)}, Mean: ${mean.toFixed(2)}.`;
    return {
        name: "Forehead Texture", nameKey: "signal.foreheadTexture", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Forehead Texture — potential AI artifact" : "Natural forehead texture — authentic",
        descriptionKey: score > 55 ? "signal.foreheadTexture.ai" : "signal.foreheadTexture.real", icon: "🧠",
        details,
    };
}
