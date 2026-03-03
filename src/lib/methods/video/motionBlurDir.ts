/**
 * Motion Blur Direction
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeMotionBlurDir(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Motion Blur Direction", nameKey: "signal.motionBlurDir", category: "pixel", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.motionBlurDir.error", icon: "💨" };
    }
    const dirs=[0,45,90,135];const scores2=[];for(const deg of dirs){const rad=deg*Math.PI/180;const dx=Math.round(Math.cos(rad)*3),dy=Math.round(Math.sin(rad)*3);let s=0,c=0;for(let y=3;y<h-3;y+=4)for(let x=3;x<w-3;x+=4){const i=(y*w+x)*4,j=((y+dy)*w+(x+dx))*4;if(j>=0&&j<p.length-3){s+=Math.abs(p[i]-p[j]);c++;}}scores2.push(c>0?s/c:0);}const mn=Math.min(...scores2),mx=Math.max(...scores2);const dirBias=mx>0?(mx-mn)/mx:0;
    let score: number;
    if(dirBias<0.1)score=62;else if(dirBias<0.25)score=48;else if(dirBias>0.5)score=32;else score=44;
    return {
        name: "Motion Blur Direction", nameKey: "signal.motionBlurDir", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Motion Blur Direction pattern suggests deepfake" : "Natural motion blur direction — consistent with real video",
        descriptionKey: score > 55 ? "signal.motionBlurDir.ai" : "signal.motionBlurDir.real", icon: "💨",
        details: `Direction bias: ${dirBias.toFixed(3)}`,
    };
}
