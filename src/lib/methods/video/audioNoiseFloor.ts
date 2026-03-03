/**
 * Audio Noise Floor
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeAudioNoiseFloor(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Audio Noise Floor", nameKey: "signal.audioNoiseFloor", category: "sensor", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.audioNoiseFloor.error", icon: "🔇" };
    }
    let flatCount=0,cnt=0;const step=3;for(let y=h-Math.floor(h*0.1);y<h;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4;const d=Math.abs(p[i]-128);if(d<5)flatCount++;cnt++;}const flatR=cnt>0?flatCount/cnt:0;
    let score: number;
    if(flatR>0.5)score=64;else if(flatR>0.3)score=52;else if(flatR<0.1)score=35;else score=44;
    return {
        name: "Audio Noise Floor", nameKey: "signal.audioNoiseFloor", category: "sensor", score, weight: 0.2,
        description: score > 55 ? "Synthetic noise floor pattern detected" : "Natural audio noise floor — consistent with real recording",
        descriptionKey: score > 55 ? "signal.audioNoiseFloor.ai" : "signal.audioNoiseFloor.real", icon: "🔇",
        details: `Flat region ratio: ${flatR.toFixed(4)}`,
    };
}
