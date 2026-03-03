/**
 * Face Blend Boundary
 * Based on scientific research (2019)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeFaceBlendBound(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Face Blend Boundary", nameKey: "signal.faceBlendBound", category: "sensor", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.faceBlendBound.error", icon: "🎭" };
    }
    const cX=w/2,cY=h*0.4;let ringDiff=0,cnt=0;for(let angle=0;angle<360;angle+=5){const rad=angle*Math.PI/180;for(let r=Math.min(w,h)*0.2;r<Math.min(w,h)*0.35;r+=2){const x=Math.floor(cX+r*Math.cos(rad)),y=Math.floor(cY+r*Math.sin(rad));if(x>0&&x<w-1&&y>0&&y<h-1){const i=(y*w+x)*4;ringDiff+=Math.abs(p[i]-p[i+4]);cnt++;}}}const avg=cnt>0?ringDiff/cnt:0;
    let score: number;
    if(avg>15)score=72;else if(avg>8)score=55;else if(avg<3)score=28;else score=44;
    return {
        name: "Face Blend Boundary", nameKey: "signal.faceBlendBound", category: "sensor", score, weight: 0.3,
        description: score > 55 ? "Face Blend Boundary — suggests deepfake" : "Natural face blend boundary — consistent with real video",
        descriptionKey: score > 55 ? "signal.faceBlendBound.ai" : "signal.faceBlendBound.real", icon: "🎭",
        details: `Blend boundary: ${avg.toFixed(2)}`,
    };
}
