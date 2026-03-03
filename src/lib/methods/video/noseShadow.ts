/**
 * Nose Shadow
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeNoseShadow(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Nose Shadow", nameKey: "signal.noseShadow", category: "sensor", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.noseShadow.error", icon: "👃" };
    }
    const nX=Math.floor(w*0.42),nY=Math.floor(h*0.3),nW=Math.floor(w*0.16),nH=Math.floor(h*0.2);let leftB=0,rightB=0,lc=0,rc=0;const mid=nX+nW/2;const step=2;for(let y=nY;y<nY+nH&&y<h;y+=step)for(let x=nX;x<nX+nW&&x<w;x+=step){const i=(y*w+x)*4;const b=(p[i]+p[i+1]+p[i+2])/3;if(x<mid){leftB+=b;lc++;}else{rightB+=b;rc++;}}const lAvg=lc>0?leftB/lc:128,rAvg=rc>0?rightB/rc:128;const diff=Math.abs(lAvg-rAvg);
    let score: number;
    if(diff<2)score=64;else if(diff<8)score=48;else if(diff>20)score=32;else score=44;
    return {
        name: "Nose Shadow", nameKey: "signal.noseShadow", category: "sensor", score, weight: 0.2,
        description: score > 55 ? "Nose Shadow pattern suggests deepfake" : "Natural nose shadow — consistent with real video",
        descriptionKey: score > 55 ? "signal.noseShadow.ai" : "signal.noseShadow.real", icon: "👃",
        details: `Nose shadow diff: ${diff.toFixed(2)}`,
    };
}
