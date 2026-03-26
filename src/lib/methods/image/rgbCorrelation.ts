/**
 * RGB Correlation
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeRGBCorrelation(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "RGB Correlation", nameKey: "signal.rgbCorrelation", category: "statistical", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.rgbCorrelation.error", icon: "🔴" };
    }
    let sumRG=0,sumRB=0,sumGB=0,sumR=0,sumG=0,sumB=0,sumR2=0,sumG2=0,sumB2=0,n=0;const step=4;for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4;const r2=p[i],g=p[i+1],b=p[i+2];sumR+=r2;sumG+=g;sumB+=b;sumR2+=r2*r2;sumG2+=g*g;sumB2+=b*b;sumRG+=r2*g;sumRB+=r2*b;sumGB+=g*b;n++;}const corrRG=n>0?(n*sumRG-sumR*sumG)/Math.sqrt((n*sumR2-sumR*sumR)*(n*sumG2-sumG*sumG)||1):0;const avgCorr=Math.abs(corrRG);
    let score: number;
    if(avgCorr>0.98)score=68;else if(avgCorr>0.9)score=52;else if(avgCorr<0.5)score=30;else score=44;
    return {
        name: "RGB Correlation", nameKey: "signal.rgbCorrelation", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "RGB Correlation pattern suggests AI generation" : "Natural rgb correlation — consistent with real image",
        descriptionKey: score > 55 ? "signal.rgbCorrelation.ai" : "signal.rgbCorrelation.real", icon: "🔴",
        details: `RG correlation: ${corrRG.toFixed(4)}`,
    };
}
