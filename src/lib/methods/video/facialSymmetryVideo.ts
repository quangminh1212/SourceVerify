/**
 * Facial Symmetry
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeFacialSymmetryVideo(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Facial Symmetry", nameKey: "signal.facialSymmetryVideo", category: "sensor", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.facialSymmetryVideo.error", icon: "🪞" };
    }
    const fX=Math.floor(w*0.25),fW=Math.floor(w*0.5),fY=Math.floor(h*0.15),fH=Math.floor(h*0.5);let lSum=0,cnt=0;const step=3;const midX=fX+fW/2;for(let y=fY;y<fY+fH&&y<h;y+=step)for(let dx=0;dx<fW/2;dx+=step){const lx=Math.floor(midX-dx),rx=Math.floor(midX+dx);if(lx>=0&&rx<w){const li=(y*w+lx)*4,ri=(y*w+rx)*4;lSum+=Math.abs(p[li]-p[ri])+Math.abs(p[li+1]-p[ri+1]);cnt++;}}const avgDiff=cnt>0?lSum/(cnt*2):0;
    let score: number;
    if(avgDiff<5)score=68;else if(avgDiff<15)score=50;else if(avgDiff>30)score=28;else score=44;
    return {
        name: "Facial Symmetry", nameKey: "signal.facialSymmetryVideo", category: "sensor", score, weight: 0.3,
        description: score > 55 ? "Facial Symmetry pattern suggests deepfake" : "Natural facial symmetry — consistent with real video",
        descriptionKey: score > 55 ? "signal.facialSymmetryVideo.ai" : "signal.facialSymmetryVideo.real", icon: "🪞",
        details: `Facial symmetry diff: ${avgDiff.toFixed(2)}`,
    };
}
