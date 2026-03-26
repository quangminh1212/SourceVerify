/**
 * Noise Granularity
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeNoiseGranularity(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Noise Granularity", nameKey: "signal.noiseGranularity", category: "sensor", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.noiseGranularity.error", icon: "🔸" };
    }
    let fine=0,coarse=0;const step=2;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const d1=Math.abs(p[i]-p[i+4]),d2=Math.abs(p[i]-p[i+w*4]);if(d1>2&&d1<8&&d2>2&&d2<8)fine++;else if(d1>15||d2>15)coarse++;}const r=(fine+coarse)>0?fine/(fine+coarse):0.5;
    let score: number;
    if(r>0.7)score=35;else if(r>0.4)score=48;else if(r<0.15)score=66;else score=44;
    return {
        name: "Noise Granularity", nameKey: "signal.noiseGranularity", category: "sensor", score, weight: 0.3,
        description: score > 55 ? "Noise Granularity pattern suggests AI generation" : "Natural noise granularity — consistent with real image",
        descriptionKey: score > 55 ? "signal.noiseGranularity.ai" : "signal.noiseGranularity.real", icon: "🔸",
        details: `Fine: ${fine}, Coarse: ${coarse}, Ratio: ${r.toFixed(3)}`,
    };
}
