/**
 * Luma Gradient Angle
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeLumaGradientAngle(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Luma Gradient Angle", nameKey: "signal.lumaGradientAngle", category: "frequency", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.lumaGradientAngle.error", icon: "🧭" };
    }
    const bins=new Float64Array(36);let cnt=0;const step=3;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const gx=p[i+4]-p[i-4],gy=p[i+w*4]-p[i-w*4];const mag=Math.sqrt(gx*gx+gy*gy);if(mag>10){let angle=Math.atan2(gy,gx)*180/Math.PI;if(angle<0)angle+=360;const bin=Math.floor(angle/10)%36;bins[bin]++;cnt++;}}let maxB=0,minB=Infinity;for(let i=0;i<36;i++){if(bins[i]>maxB)maxB=bins[i];if(bins[i]<minB)minB=bins[i];}const uniformity=maxB>0?minB/maxB:1;
    let score: number;
    if(uniformity>0.7)score=66;else if(uniformity>0.4)score=50;else if(uniformity<0.2)score=30;else score=44;
    return {
        name: "Luma Gradient Angle", nameKey: "signal.lumaGradientAngle", category: "frequency", score, weight: 0.2,
        description: score > 55 ? "Luma Gradient Angle pattern suggests AI generation" : "Natural luma gradient angle — consistent with real image",
        descriptionKey: score > 55 ? "signal.lumaGradientAngle.ai" : "signal.lumaGradientAngle.real", icon: "🧭",
        details: `Angle uniformity: ${uniformity.toFixed(3)}`,
    };
}
