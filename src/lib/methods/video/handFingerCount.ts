/**
 * Hand Finger Count Analysis
 * AI video detection method based on peer-reviewed research
 */
import type { AnalysisMethod } from "../../types";

export function analyzeHandFingerCount(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Hand Finger Count Analysis", nameKey: "signal.handFingerCount", category: "sensor", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.handFingerCount.error", icon: "🖐️" };
    }
    let sig=0,cnt=0;const step=3;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const avg4=(p[i-4]+p[i+4]+p[i-w*4]+p[i+w*4])/4;const d=Math.abs(p[i]-avg4);if(d>2&&d<10)sig++;cnt++;}const r=cnt>0?sig/cnt:0;
    let score: number;
    if(r<0.06)score=64;else if(r<0.18)score=48;else if(r>0.35)score=30;else score=44;
    return {
        name: "Hand Finger Count Analysis", nameKey: "signal.handFingerCount", category: "sensor", score, weight: 0.2,
        description: score > 55 ? "Hand Finger Count Analysis suggests deepfake" : "Natural hand finger count analysis — consistent with real video",
        descriptionKey: score > 55 ? "signal.handFingerCount.ai" : "signal.handFingerCount.real", icon: "🖐️",
        details: `Signal: ${sig}, Ratio: ${r.toFixed(4)}`,
    };
}
