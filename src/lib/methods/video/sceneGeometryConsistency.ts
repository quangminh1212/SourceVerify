/**
 * Scene Geometry
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSceneGeometryConsistency(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Scene Geometry", nameKey: "signal.sceneGeometryConsistency", category: "pixel", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.sceneGeometryConsistency.error", icon: "📐" };
    }
    let hLines=0,vLines=0,cnt=0;const step=3;for(let y=0;y<h-1;y+=step)for(let x=0;x<w-1;x+=step){const i=(y*w+x)*4;const gx=Math.abs(p[i]-p[i+4]),gy=Math.abs(p[i]-p[i+w*4]);if(gx>30&&gy<5)hLines++;if(gy>30&&gx<5)vLines++;cnt++;}const lineR=cnt>0?(hLines+vLines)/cnt:0;
    let score: number;
    if(lineR<0.005)score=60;else if(lineR<0.02)score=45;else if(lineR>0.05)score=35;else score=48;
    return {
        name: "Scene Geometry", nameKey: "signal.sceneGeometryConsistency", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Missing geometric structure — suggests AI generation" : "Natural scene geometry detected — consistent with real video",
        descriptionKey: score > 55 ? "signal.sceneGeometryConsistency.ai" : "signal.sceneGeometryConsistency.real", icon: "📐",
        details: `H-lines: ${hLines}, V-lines: ${vLines}, Ratio: ${lineR.toFixed(4)}`,
    };
}
