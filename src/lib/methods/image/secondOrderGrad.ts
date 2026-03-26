/**
 * Second Order Gradient
 * Based on scientific research papers (2019)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSecondOrderGrad(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Second Order Gradient", nameKey: "signal.secondOrderGrad", category: "pixel", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.secondOrderGrad.error", icon: "📐" };
    }
    let sum=0,cnt=0;const step=2;for(let y=2;y<h-2;y+=step)for(let x=2;x<w-2;x+=step){const i=(y*w+x)*4;const d2x=p[i-8]-2*p[i]+p[i+8];const d2y=p[i-w*8]-2*p[i]+p[i+w*8];sum+=Math.abs(d2x)+Math.abs(d2y);cnt++;}const avg=cnt>0?sum/(cnt*2):0;
    let score: number;
    if(avg<1.5)score=68;else if(avg<4)score=52;else if(avg>10)score=28;else score=44;
    return {
        name: "Second Order Gradient", nameKey: "signal.secondOrderGrad", category: "pixel", score, weight: 0.3,
        description: score > 55 ? "Second Order Gradient — suggests AI generation" : "Natural second order gradient — consistent with real image",
        descriptionKey: score > 55 ? "signal.secondOrderGrad.ai" : "signal.secondOrderGrad.real", icon: "📐",
        details: `2nd order grad: ${avg.toFixed(3)}`,
    };
}
