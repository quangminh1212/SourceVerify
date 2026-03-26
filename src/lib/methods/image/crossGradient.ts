/**
 * Cross Gradient
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeCrossGradient(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Cross Gradient", nameKey: "signal.crossGradient", category: "pixel", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.crossGradient.error", icon: "✖️" };
    }
    let cross=0,aligned=0,cnt=0;const step=3;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const gx=p[i+4]-p[i-4],gy=p[i+w*4]-p[i-w*4];if(Math.abs(gx)>10&&Math.abs(gy)>10){if(Math.abs(Math.abs(gx)-Math.abs(gy))<5)aligned++;else cross++;}cnt++;}const r=cnt>0?aligned/(aligned+cross+1):0;
    let score: number;
    if(r>0.3)score=68;else if(r>0.15)score=52;else if(r<0.05)score=30;else score=44;
    return {
        name: "Cross Gradient", nameKey: "signal.crossGradient", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Cross Gradient pattern suggests AI generation" : "Natural cross gradient — consistent with real image",
        descriptionKey: score > 55 ? "signal.crossGradient.ai" : "signal.crossGradient.real", icon: "✖️",
        details: `Aligned: ${aligned}, Cross: ${cross}, Ratio: ${r.toFixed(4)}`,
    };
}
