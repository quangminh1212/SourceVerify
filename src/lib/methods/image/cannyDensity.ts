/**
 * Canny Edge Density
 * Based on scientific research papers (2006)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeCannyDensity(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Canny Edge Density", nameKey: "signal.cannyDensity", category: "pixel", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.cannyDensity.error", icon: "🔲" };
    }
    let edges=0,cnt=0;const step=2;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const gx=Math.abs(p[i+4]-p[i-4]),gy=Math.abs(p[i+w*4]-p[i-w*4]);const mag=Math.sqrt(gx*gx+gy*gy);if(mag>30)edges++;cnt++;}const density=cnt>0?edges/cnt:0;
    let score: number;
    if(density<0.05)score=66;else if(density<0.15)score=50;else if(density>0.35)score=28;else score=44;
    return {
        name: "Canny Edge Density", nameKey: "signal.cannyDensity", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Canny Edge Density — suggests AI generation" : "Natural canny edge density — consistent with real image",
        descriptionKey: score > 55 ? "signal.cannyDensity.ai" : "signal.cannyDensity.real", icon: "🔲",
        details: `Canny density: ${density.toFixed(4)}`,
    };
}
