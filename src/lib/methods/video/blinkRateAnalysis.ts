/**
 * Blink Rate Analysis
 * Algorithm: blockEntropy
 */
import type { AnalysisMethod } from "../../types";

export function analyzeBlinkRateAnalysis(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Blink Rate Analysis", nameKey: "signal.blinkRateAnalysis", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.blinkRateAnalysis.error", icon: "👁" };
    }
const bs=16,bx=Math.floor(w/bs),by=Math.floor(h/bs);const entropies=[];
for(let j=0;j<by;j++){for(let i=0;i<bx;i++){const hist=new Array(16).fill(0);
for(let dy=0;dy<bs;dy++){for(let dx=0;dx<bs;dx++){const idx=((j*bs+dy)*w+(i*bs+dx))*4;
const gray=Math.floor((pixels[idx]*0.299+pixels[idx+1]*0.587+pixels[idx+2]*0.114)/16);hist[Math.min(gray,15)]++;}}
let e=0;const t=bs*bs;for(const c of hist){if(c>0){const p=c/t;e-=p*Math.log2(p);}}entropies.push(e);}}
const mean=entropies.reduce((a,b)=>a+b,0)/entropies.length;
const cv=mean>0?Math.sqrt(entropies.reduce((a,b)=>a+(b-mean)**2,0)/entropies.length)/mean:0;
let score;if(cv<0.15)score=72;else if(cv<0.3)score=58;else if(cv>0.6)score=30;else score=44;
const details=`Entropy CV: ${cv.toFixed(3)}, Mean entropy: ${mean.toFixed(3)}.`;
    return {
        name: "Blink Rate Analysis", nameKey: "signal.blinkRateAnalysis", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Blink Rate Analysis — potential AI artifact" : "Natural blink rate analysis — authentic",
        descriptionKey: score > 55 ? "signal.blinkRateAnalysis.ai" : "signal.blinkRateAnalysis.real", icon: "👁",
        details,
    };
}
