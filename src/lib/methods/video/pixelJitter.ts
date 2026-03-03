/**
 * Pixel Jitter
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzePixelJitter(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Pixel Jitter", nameKey: "signal.pixelJitter", category: "pixel", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.pixelJitter.error", icon: "🫨" };
    }
    let jitter=0,cnt=0;const step=3;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const avg4=(p[i-4]+p[i+4]+p[i-w*4]+p[i+w*4])/4;const d=Math.abs(p[i]-avg4);if(d>2&&d<8)jitter++;cnt++;}const r=cnt>0?jitter/cnt:0;
    let score: number;
    if(r<0.05)score=64;else if(r<0.15)score=48;else if(r>0.35)score=30;else score=44;
    return {
        name: "Pixel Jitter", nameKey: "signal.pixelJitter", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Pixel Jitter pattern suggests deepfake" : "Natural pixel jitter — consistent with real video",
        descriptionKey: score > 55 ? "signal.pixelJitter.ai" : "signal.pixelJitter.real", icon: "🫨",
        details: `Jitter: ${jitter}, Ratio: ${r.toFixed(4)}`,
    };
}
