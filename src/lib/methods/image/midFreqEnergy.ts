/**
 * Mid-Frequency Energy
 * Based on scientific research papers (2020)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeMidFreqEnergy(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Mid-Frequency Energy", nameKey: "signal.midFreqEnergy", category: "frequency", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.midFreqEnergy.error", icon: "📊" };
    }
    const sz=Math.min(32,Math.min(w,h));let low=0,mid=0,high=0;for(let k=1;k<=sz/2;k++){let re=0,im=0;for(let n=0;n<sz;n++){const a=-2*Math.PI*k*n/sz;re+=p[(n*w)*4]*Math.cos(a);im+=p[(n*w)*4]*Math.sin(a);}const pw=re*re+im*im;if(k<=sz/8)low+=pw;else if(k<=sz/4)mid+=pw;else high+=pw;}const midR=(low+mid+high)>0?mid/(low+mid+high):0;
    let score: number;
    if(midR<0.1)score=66;else if(midR<0.25)score=50;else if(midR>0.5)score=30;else score=44;
    return {
        name: "Mid-Frequency Energy", nameKey: "signal.midFreqEnergy", category: "frequency", score, weight: 0.3,
        description: score > 55 ? "Mid-Frequency Energy — suggests AI generation" : "Natural mid-frequency energy — consistent with real image",
        descriptionKey: score > 55 ? "signal.midFreqEnergy.ai" : "signal.midFreqEnergy.real", icon: "📊",
        details: `Mid-freq ratio: ${midR.toFixed(4)}`,
    };
}
