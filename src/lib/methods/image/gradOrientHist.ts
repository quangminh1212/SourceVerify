/**
 * Gradient Orientation Hist
 * Based on scientific research papers (2015)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeGradOrientHist(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Gradient Orientation Hist", nameKey: "signal.gradOrientHist", category: "pixel", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.gradOrientHist.error", icon: "🧭" };
    }
    const bins=new Float64Array(8);const step=3;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const gx=p[i+4]-p[i-4],gy=p[i+w*4]-p[i-w*4];const mag=Math.sqrt(gx*gx+gy*gy);if(mag>5){const ang=Math.atan2(gy,gx)+Math.PI;const bin=Math.floor(ang/(2*Math.PI)*8)%8;bins[bin]++;}}let mx=0,mn=Infinity;for(let i=0;i<8;i++){if(bins[i]>mx)mx=bins[i];if(bins[i]<mn)mn=bins[i];}const u=mx>0?mn/mx:1;
    let score: number;
    if(u>0.65)score=66;else if(u>0.4)score=50;else if(u<0.2)score=28;else score=44;
    return {
        name: "Gradient Orientation Hist", nameKey: "signal.gradOrientHist", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Gradient Orientation Hist — suggests AI generation" : "Natural gradient orientation hist — consistent with real image",
        descriptionKey: score > 55 ? "signal.gradOrientHist.ai" : "signal.gradOrientHist.real", icon: "🧭",
        details: `Orient uniformity: ${u.toFixed(3)}`,
    };
}
