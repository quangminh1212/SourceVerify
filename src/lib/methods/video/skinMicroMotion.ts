/**
 * Skin Micro Motion
 * Based on scientific research (2020)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSkinMicroMotion(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Skin Micro Motion", nameKey: "signal.skinMicroMotion", category: "sensor", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.skinMicroMotion.error", icon: "🫀" };
    }
    const regions=[[0.3,0.3,0.15,0.1],[0.55,0.3,0.15,0.1],[0.35,0.45,0.3,0.08]];let totalVar=0,cnt=0;for(const[rx,ry,rw,rh]of regions){let s=0,s2=0,c=0;for(let y=Math.floor(h*ry);y<Math.floor(h*(ry+rh))&&y<h;y+=2)for(let x=Math.floor(w*rx);x<Math.floor(w*(rx+rw))&&x<w;x+=2){const i=(y*w+x)*4;const v=p[i+1];s+=v;s2+=v*v;c++;}const mean=c>0?s/c:0;totalVar+=c>0?s2/c-mean*mean:0;cnt++;}const avgVar=cnt>0?totalVar/cnt:0;
    let score: number;
    if(avgVar<5)score=68;else if(avgVar<20)score=50;else if(avgVar>60)score=28;else score=44;
    return {
        name: "Skin Micro Motion", nameKey: "signal.skinMicroMotion", category: "sensor", score, weight: 0.3,
        description: score > 55 ? "Skin Micro Motion — suggests deepfake" : "Natural skin micro motion — consistent with real video",
        descriptionKey: score > 55 ? "signal.skinMicroMotion.ai" : "signal.skinMicroMotion.real", icon: "🫀",
        details: `Skin micro var: ${avgVar.toFixed(2)}`,
    };
}
