/**
 * Temporal Coherence
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeTemporalCoherenceMap(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Temporal Coherence", nameKey: "signal.tempCoherenceMap", category: "frequency", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.tempCoherenceMap.error", icon: "🔗" };
    }
    let coherent=0,cnt=0;const step=4;for(let x=0;x<w;x+=step){for(let y=2;y<h-2;y+=step){const i=(y*w+x)*4;const prev=p[((y-2)*w+x)*4],next=p[((y+2)*w+x)*4];const predicted=(prev+next)/2;if(Math.abs(p[i]-predicted)<8)coherent++;cnt++;}}const r=cnt>0?coherent/cnt:0;
    let score: number;
    if(r>0.85)score=66;else if(r>0.6)score=48;else if(r<0.3)score=30;else score=44;
    return {
        name: "Temporal Coherence", nameKey: "signal.tempCoherenceMap", category: "frequency", score, weight: 0.3,
        description: score > 55 ? "Temporal Coherence pattern suggests deepfake" : "Natural temporal coherence — consistent with real video",
        descriptionKey: score > 55 ? "signal.tempCoherenceMap.ai" : "signal.tempCoherenceMap.real", icon: "🔗",
        details: `Temporal coherence: ${r.toFixed(4)}`,
    };
}
