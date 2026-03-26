/**
 * Gradient Magnitude
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeGradientMagnitudeHist(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Gradient Magnitude", nameKey: "signal.gradientMagHist", category: "pixel", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.gradientMagHist.error", icon: "📈" };
    }
    const bins=new Float64Array(50);let cnt=0;const step=2;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const gx=p[i+4]-p[i-4],gy=p[i+w*4]-p[i-w*4];const mag=Math.sqrt(gx*gx+gy*gy);const bin=Math.min(49,Math.floor(mag/5));bins[bin]++;cnt++;}let peak=0;for(let i=0;i<50;i++)if(bins[i]>bins[peak])peak=i;const lowR=cnt>0?bins[0]/cnt:0;
    let score: number;
    if(lowR>0.7)score=66;else if(lowR>0.4)score=50;else if(lowR<0.2)score=30;else score=44;
    return {
        name: "Gradient Magnitude", nameKey: "signal.gradientMagHist", category: "pixel", score, weight: 0.3,
        description: score > 55 ? "Gradient Magnitude pattern suggests AI generation" : "Natural gradient magnitude — consistent with real image",
        descriptionKey: score > 55 ? "signal.gradientMagHist.ai" : "signal.gradientMagHist.real", icon: "📈",
        details: `Peak bin: ${peak}, Low ratio: ${lowR.toFixed(3)}`,
    };
}
