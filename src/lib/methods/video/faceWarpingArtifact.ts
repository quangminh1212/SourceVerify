/**
 * Face Warping Artifact
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeFaceWarpingArtifact(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Face Warping Artifact", nameKey: "signal.faceWarpingArtifact", category: "sensor", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.faceWarpingArtifact.error", icon: "🪞" };
    }
    const fX=Math.floor(w*0.25),fW=Math.floor(w*0.5),fY=Math.floor(h*0.15),fH=Math.floor(h*0.6);let distortion=0,cnt=0;const step=3;for(let y=fY;y<fY+fH&&y<h-2;y+=step)for(let x=fX;x<fX+fW&&x<w-2;x+=step){const i=(y*w+x)*4;const dx=p[i]-2*p[i+4]+p[i+8];const dy=p[i]-2*p[i+w*4]+p[i+w*8];distortion+=Math.abs(dx)+Math.abs(dy);cnt++;}const avgDist=cnt>0?distortion/(cnt*2):0;
    let score: number;
    if(avgDist>15)score=70;else if(avgDist>8)score=55;else if(avgDist<3)score=30;else score=44;
    return {
        name: "Face Warping Artifact", nameKey: "signal.faceWarpingArtifact", category: "sensor", score, weight: 0.3,
        description: score > 55 ? "Face warping artifacts detected — suggests deepfake manipulation" : "No warping artifacts — consistent with real video",
        descriptionKey: score > 55 ? "signal.faceWarpingArtifact.ai" : "signal.faceWarpingArtifact.real", icon: "🪞",
        details: `Warping distortion: ${avgDist.toFixed(3)}`,
    };
}
