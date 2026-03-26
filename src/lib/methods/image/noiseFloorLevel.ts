/**
 * Noise Floor Level
 * AI detection method - Noise Floor Level
 */
import type { AnalysisMethod } from "../../types";

export function analyzeNoiseFloorLevel(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Noise Floor Level", nameKey: "signal.noiseFloorLevel", category: "sensor", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.noiseFloorLevel.error", icon: "📉" };
    }
    const step=3;let diffs=0,cnt=0;for(let y=0;y<h-1;y+=step)for(let x=0;x<w-1;x+=step){const i=(y*w+x)*4;const d=Math.abs(p[i]-p[i+4])+Math.abs(p[i+1]-p[i+5])+Math.abs(p[i+2]-p[i+6]);diffs+=d;cnt++;}const avgNoise=cnt>0?diffs/(cnt*3):0;
    let score: number;
    if(avgNoise<1.5)score=72;else if(avgNoise<3)score=58;else if(avgNoise>8)score=30;else score=42;
    return {
        name: "Noise Floor Level", nameKey: "signal.noiseFloorLevel", category: "sensor", score, weight: 0.3,
        description: score > 55 ? "Unnaturally low noise floor — typical of AI generation" : "Natural sensor noise detected — consistent with real camera",
        descriptionKey: score > 55 ? "signal.noiseFloorLevel.ai" : "signal.noiseFloorLevel.real", icon: "📉",
        details: `Avg noise floor: ${avgNoise.toFixed(3)}`,
    };
}
