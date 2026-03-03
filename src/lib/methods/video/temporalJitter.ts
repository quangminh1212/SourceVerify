/**
 * Temporal Jitter
 * Based on scientific research (2021)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeTemporalJitter(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Temporal Jitter", nameKey: "signal.temporalJitter", category: "frequency", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.temporalJitter.error", icon: "📳" };
    }
    let jitters=0,cnt=0;const step=4;for(let x=0;x<w;x+=step){let prev=p[x*4],prevD=0;for(let y=step;y<h;y+=step){const v=p[(y*w+x)*4];const d=v-prev;if(prevD!==0&&Math.sign(d)!==Math.sign(prevD)&&Math.abs(d)>5)jitters++;prevD=d;prev=v;cnt++;}}const r=cnt>0?jitters/cnt:0;
    let score: number;
    if(r>0.3)score=68;else if(r>0.15)score=52;else if(r<0.05)score=28;else score=44;
    return {
        name: "Temporal Jitter", nameKey: "signal.temporalJitter", category: "frequency", score, weight: 0.3,
        description: score > 55 ? "Temporal Jitter — suggests deepfake" : "Natural temporal jitter — consistent with real video",
        descriptionKey: score > 55 ? "signal.temporalJitter.ai" : "signal.temporalJitter.real", icon: "📳",
        details: `Temporal jitter: ${r.toFixed(4)}`,
    };
}
