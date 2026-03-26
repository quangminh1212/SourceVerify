/**
 * Contour Smoothness
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeContourSmooth(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Contour Smoothness", nameKey: "signal.contourSmooth", category: "pixel", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.contourSmooth.error", icon: "〽️" };
    }
    let smooth=0,sharp=0;const step=3;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const lap=Math.abs(4*p[i]-p[i-4]-p[i+4]-p[i-w*4]-p[i+w*4]);if(lap>20&&lap<60)smooth++;else if(lap>=60)sharp++;}const r=(smooth+sharp)>0?smooth/(smooth+sharp):0.5;
    let score: number;
    if(r>0.85)score=66;else if(r>0.6)score=50;else if(r<0.3)score=30;else score=44;
    return {
        name: "Contour Smoothness", nameKey: "signal.contourSmooth", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Contour Smoothness pattern suggests AI generation" : "Natural contour smoothness — consistent with real image",
        descriptionKey: score > 55 ? "signal.contourSmooth.ai" : "signal.contourSmooth.real", icon: "〽️",
        details: `Smooth contours: ${smooth}, Sharp: ${sharp}`,
    };
}
