/**
 * Temporal Color Histogram
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeTemporalColorHistogram(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Temporal Color Histogram", nameKey: "signal.temporalColorHistogram", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.temporalColorHistogram.error", icon: "📊" };
    }
    const bins=16,hist=new Float64Array(bins);const step=4;let cnt=0;for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4;const lum=Math.floor((p[i]+p[i+1]+p[i+2])/(3*256/bins));hist[Math.min(lum,bins-1)]++;cnt++;}const avg=cnt/bins;let chi=0;for(let i=0;i<bins;i++)chi+=(hist[i]-avg)**2/(avg||1);chi/=bins;
    let score: number;
    if(chi<0.5)score=66;else if(chi<2)score=50;else if(chi>10)score=30;else score=44;
    return {
        name: "Temporal Color Histogram", nameKey: "signal.temporalColorHistogram", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Unnaturally uniform color histogram — suggests AI generation" : "Natural color histogram — consistent with real video",
        descriptionKey: score > 55 ? "signal.temporalColorHistogram.ai" : "signal.temporalColorHistogram.real", icon: "📊",
        details: `Chi-square: ${chi.toFixed(3)}`,
    };
}
