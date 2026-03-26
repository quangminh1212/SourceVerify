/**
 * Scharr Gradient
 * Based on scientific research papers (2000)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeScharrGradient(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Scharr Gradient", nameKey: "signal.scharrGrad", category: "pixel", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.scharrGrad.error", icon: "📐" };
    }
    let sum=0,cnt=0;const step=3;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const gx=3*p[i-w*4+4]+10*p[i+4]+3*p[i+w*4+4]-3*p[i-w*4-4]-10*p[i-4]-3*p[i+w*4-4];const gy=3*p[i+w*4-4]+10*p[i+w*4]+3*p[i+w*4+4]-3*p[i-w*4-4]-10*p[i-w*4]-3*p[i-w*4+4];sum+=Math.sqrt(gx*gx+gy*gy);cnt++;}const avg=cnt>0?sum/cnt:0;
    let score: number;
    if(avg<30)score=66;else if(avg<80)score=50;else if(avg>200)score=28;else score=44;
    return {
        name: "Scharr Gradient", nameKey: "signal.scharrGrad", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Scharr Gradient — suggests AI generation" : "Natural scharr gradient — consistent with real image",
        descriptionKey: score > 55 ? "signal.scharrGrad.ai" : "signal.scharrGrad.real", icon: "📐",
        details: `Scharr avg: ${avg.toFixed(1)}`,
    };
}
