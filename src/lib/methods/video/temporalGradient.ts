/**
 * Temporal Gradient
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeTemporalGradient(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Temporal Gradient", nameKey: "signal.temporalGradient", category: "frequency", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.temporalGradient.error", icon: "📉" };
    }
    let gradSum=0,cnt=0;const step=4;for(let x=0;x<w;x+=step){let prev=p[x*4];for(let y=step;y<h;y+=step){const v=p[(y*w+x)*4];gradSum+=Math.abs(v-prev);prev=v;cnt++;}}const avgG=cnt>0?gradSum/cnt:0;
    let score: number;
    if(avgG<1)score=64;else if(avgG<4)score=48;else if(avgG>10)score=30;else score=44;
    return {
        name: "Temporal Gradient", nameKey: "signal.temporalGradient", category: "frequency", score, weight: 0.2,
        description: score > 55 ? "Temporal Gradient pattern suggests deepfake" : "Natural temporal gradient — consistent with real video",
        descriptionKey: score > 55 ? "signal.temporalGradient.ai" : "signal.temporalGradient.real", icon: "📉",
        details: `Temporal gradient: ${avgG.toFixed(3)}`,
    };
}
