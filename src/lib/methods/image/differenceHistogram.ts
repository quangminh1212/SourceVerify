/**
 * Difference Histogram
 * Based on scientific research papers (2013)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeDifferenceHistogram(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Difference Histogram", nameKey: "signal.diffHistogram", category: "statistical", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.diffHistogram.error", icon: "📉" };
    }
    const dHist=new Float64Array(511);const step=2;let cnt=0;for(let y=0;y<h;y+=step)for(let x=0;x<w-1;x+=step){const i=(y*w+x)*4;const diff=p[i]-p[i+4]+255;dHist[diff]++;cnt++;}let peak=0;for(let i=0;i<511;i++)if(dHist[i]>dHist[peak])peak=i;const peakR=cnt>0?dHist[peak]/cnt:0;const center=Math.abs(peak-255);
    let score: number;
    if(peakR>0.3&&center<5)score=66;else if(peakR>0.15)score=50;else if(peakR<0.05)score=28;else score=44;
    return {
        name: "Difference Histogram", nameKey: "signal.diffHistogram", category: "statistical", score, weight: 0.3,
        description: score > 55 ? "Difference Histogram — suggests AI generation" : "Natural difference histogram — consistent with real image",
        descriptionKey: score > 55 ? "signal.diffHistogram.ai" : "signal.diffHistogram.real", icon: "📉",
        details: `Peak: ${peak-255}, PeakR: ${peakR.toFixed(3)}`,
    };
}
