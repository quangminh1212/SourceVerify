/**
 * Body Movement Fluidity
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeBodyMovementFluidity(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Body Movement Fluidity", nameKey: "signal.bodyMovementFluidity", category: "pixel", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.bodyMovementFluidity.error", icon: "💃" };
    }
    let smoothTrans=0,sharpTrans=0,cnt=0;const step=3;for(let y=Math.floor(h*0.2);y<Math.floor(h*0.8)&&y<h-2;y+=step)for(let x=Math.floor(w*0.2);x<Math.floor(w*0.8)&&x<w-2;x+=step){const i=(y*w+x)*4;const d1=Math.abs(p[i]-p[i+4]),d2=Math.abs(p[i+4]-p[i+8]);if(d1<5&&d2<5)smoothTrans++;else if(d1>20||d2>20)sharpTrans++;cnt++;}const smoothR=cnt>0?smoothTrans/cnt:0;
    let score: number;
    if(smoothR>0.8)score=65;else if(smoothR>0.6)score=52;else if(smoothR<0.3)score=32;else score=44;
    return {
        name: "Body Movement Fluidity", nameKey: "signal.bodyMovementFluidity", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Over-smooth body movement — suggests AI generation" : "Natural movement fluidity — consistent with real video",
        descriptionKey: score > 55 ? "signal.bodyMovementFluidity.ai" : "signal.bodyMovementFluidity.real", icon: "💃",
        details: `Smooth transitions: ${smoothR.toFixed(3)}`,
    };
}
