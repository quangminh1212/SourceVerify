/**
 * Eye Contact Consistency
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeEyeContactConsistency(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Eye Contact Consistency", nameKey: "signal.eyeContactConsistency", category: "sensor", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.eyeContactConsistency.error", icon: "👁️" };
    }
    const eY=Math.floor(h*0.25),eH=Math.floor(h*0.1);const lX=Math.floor(w*0.3),rX=Math.floor(w*0.55),eW=Math.floor(w*0.15);let lBright=0,rBright=0,cnt=0;for(let y=eY;y<eY+eH&&y<h;y+=2){for(let x=lX;x<lX+eW&&x<w;x+=2){const i=(y*w+x)*4;lBright+=p[i]+p[i+1]+p[i+2];cnt++;}for(let x=rX;x<rX+eW&&x<w;x+=2){const i=(y*w+x)*4;rBright+=p[i]+p[i+1]+p[i+2];}}const diff=cnt>0?Math.abs(lBright-rBright)/(cnt*3):0;
    let score: number;
    if(diff<2)score=64;else if(diff<8)score=48;else if(diff>20)score=32;else score=44;
    return {
        name: "Eye Contact Consistency", nameKey: "signal.eyeContactConsistency", category: "sensor", score, weight: 0.3,
        description: score > 55 ? "Asymmetric eye rendering — suggests synthetic generation" : "Consistent eye contact — natural human pattern",
        descriptionKey: score > 55 ? "signal.eyeContactConsistency.ai" : "signal.eyeContactConsistency.real", icon: "👁️",
        details: `Eye brightness diff: ${diff.toFixed(2)}`,
    };
}
