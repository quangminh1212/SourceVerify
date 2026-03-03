/**
 * Color Histogram Shift
 * Based on scientific research (2020)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeColorHistShift(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Color Histogram Shift", nameKey: "signal.colorHistShift", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.colorHistShift.error", icon: "📊" };
    }
    const fHist=new Float64Array(16),bHist=new Float64Array(16);const fX=Math.floor(w*0.25),fW=Math.floor(w*0.5),fY=Math.floor(h*0.15),fH=Math.floor(h*0.5);let fc=0,bc2=0;const step=3;for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4;const bin=p[i]>>4;if(x>=fX&&x<fX+fW&&y>=fY&&y<fY+fH){fHist[bin]++;fc++;}else{bHist[bin]++;bc2++;}}let chiSq=0;for(let i=0;i<16;i++){const fN=fc>0?fHist[i]/fc:0,bN=bc2>0?bHist[i]/bc2:0;chiSq+=(fN-bN)**2/(fN+bN||1);}
    let score: number;
    if(chiSq>0.5)score=68;else if(chiSq>0.2)score=52;else if(chiSq<0.05)score=28;else score=44;
    return {
        name: "Color Histogram Shift", nameKey: "signal.colorHistShift", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Color Histogram Shift — suggests deepfake" : "Natural color histogram shift — consistent with real video",
        descriptionKey: score > 55 ? "signal.colorHistShift.ai" : "signal.colorHistShift.real", icon: "📊",
        details: `Chi-sq: ${chiSq.toFixed(4)}`,
    };
}
