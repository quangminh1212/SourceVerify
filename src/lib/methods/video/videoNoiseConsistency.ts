/**
 * Video Noise Consistency
 * Algorithm: histogramDist
 */
import type { AnalysisMethod } from "../../types";

export function analyzeVideoNoiseConsistency(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Video Noise Consistency", nameKey: "signal.videoNoiseConsistency", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.videoNoiseConsistency.error", icon: "🔊" };
    }
const hist=new Array(256).fill(0);const n=pixels.length/4;
for(let i=0;i<pixels.length;i+=4){const g=Math.round(pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114);hist[g]++;}
let entropy=0;for(const c of hist){if(c>0){const p=c/n;entropy-=p*Math.log2(p);}}
const topH=hist.slice(0,Math.floor(h/2)*w>n?n:Math.floor(n/2));
const botH=hist.slice(Math.floor(n/2));
let skewness=0,m2=0,m3=0;const mean2=hist.reduce((a,v,i)=>a+i*v,0)/n;
for(let i=0;i<256;i++){const d=i-mean2;m2+=d*d*hist[i];m3+=d*d*d*hist[i];}
m2/=n;m3/=n;skewness=m2>0?m3/Math.pow(m2,1.5):0;
let score;if(Math.abs(skewness)<0.3&&entropy>7)score=35;else if(entropy<5)score=68;else if(entropy<6.5)score=55;else score=44;
const details=`Entropy: ${entropy.toFixed(3)}, Skewness: ${skewness.toFixed(3)}.`;
    return {
        name: "Video Noise Consistency", nameKey: "signal.videoNoiseConsistency", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Video Noise Consistency — potential AI artifact" : "Natural video noise consistency — authentic",
        descriptionKey: score > 55 ? "signal.videoNoiseConsistency.ai" : "signal.videoNoiseConsistency.real", icon: "🔊",
        details,
    };
}
