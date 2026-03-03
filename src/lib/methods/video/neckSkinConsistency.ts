/**
 * Neck Skin
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeNeckSkinConsistency(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Neck Skin", nameKey: "signal.neckSkinConsistency", category: "pixel", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.neckSkinConsistency.error", icon: "🦒" };
    }
    const nX=Math.floor(w*0.3),nY=Math.floor(h*0.6),nW=Math.floor(w*0.4),nH=Math.floor(h*0.15);let faceB=0,neckB=0,fc=0,nc=0;const step=3;for(let y=Math.floor(h*0.35);y<Math.floor(h*0.5)&&y<h;y+=step)for(let x=nX;x<nX+nW&&x<w;x+=step){const i=(y*w+x)*4;faceB+=(p[i]+p[i+1]+p[i+2])/3;fc++;}for(let y=nY;y<nY+nH&&y<h;y+=step)for(let x=nX;x<nX+nW&&x<w;x+=step){const i=(y*w+x)*4;neckB+=(p[i]+p[i+1]+p[i+2])/3;nc++;}const fAvg=fc>0?faceB/fc:128,nAvg=nc>0?neckB/nc:128;const diff=Math.abs(fAvg-nAvg);
    let score: number;
    if(diff<3)score=64;else if(diff<10)score=48;else if(diff>25)score=32;else score=44;
    return {
        name: "Neck Skin", nameKey: "signal.neckSkinConsistency", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Neck Skin pattern suggests deepfake" : "Natural neck skin — consistent with real video",
        descriptionKey: score > 55 ? "signal.neckSkinConsistency.ai" : "signal.neckSkinConsistency.real", icon: "🦒",
        details: `Face-neck diff: ${diff.toFixed(2)}`,
    };
}
