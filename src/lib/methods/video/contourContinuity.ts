/**
 * Contour Continuity
 * Based on scientific research (2020)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeContourContinuity(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Contour Continuity", nameKey: "signal.contourContinuity", category: "pixel", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.contourContinuity.error", icon: "〰️" };
    }
    let contCount=0,breakCount=0;const step=2;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const g=Math.abs(p[i]-p[i+4])+Math.abs(p[i]-p[i+w*4]);if(g>20){const next=Math.abs(p[i+4]-p[i+8])+Math.abs(p[i+4]-p[i+4+w*4]);if(next>15)contCount++;else breakCount++;}}const r=(contCount+breakCount)>0?contCount/(contCount+breakCount):0.5;
    let score: number;
    if(r<0.3)score=66;else if(r<0.5)score=50;else if(r>0.8)score=30;else score=44;
    return {
        name: "Contour Continuity", nameKey: "signal.contourContinuity", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Contour Continuity — suggests deepfake" : "Natural contour continuity — consistent with real video",
        descriptionKey: score > 55 ? "signal.contourContinuity.ai" : "signal.contourContinuity.real", icon: "〰️",
        details: `Continuity: ${r.toFixed(3)}`,
    };
}
