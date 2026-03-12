/**
 * Jawline Consistency
 * Algorithm: lbpVariant
 */
import type { AnalysisMethod } from "../../types";

export function analyzeJawlineConsistency(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Jawline Consistency", nameKey: "signal.jawlineConsistency", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.jawlineConsistency.error", icon: "🦷" };
    }
const lbpHist=new Array(256).fill(0);let total=0;
for(let y=1;y<h-1;y+=3){for(let x=1;x<w-1;x+=3){const i=(y*w+x)*4;
const c=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;let code=0;
const offsets=[[-1,-1],[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1]];
for(let b=0;b<8;b++){const[dy,dx]=offsets[b];const j=((y+dy)*w+(x+dx))*4;
const n2=pixels[j]*0.299+pixels[j+1]*0.587+pixels[j+2]*0.114;if(n2>=c)code|=(1<<b);}
lbpHist[code]++;total++;}}
let entropy=0;for(const c of lbpHist){if(c>0){const p=c/total;entropy-=p*Math.log2(p);}}
let score;if(entropy<5)score=68;else if(entropy<6.5)score=56;else if(entropy>7.5)score=32;else score=44;
const details=`LBP entropy: ${entropy.toFixed(3)}, Samples: ${total}.`;
    return {
        name: "Jawline Consistency", nameKey: "signal.jawlineConsistency", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Jawline Consistency — potential AI artifact" : "Natural jawline consistency — authentic",
        descriptionKey: score > 55 ? "signal.jawlineConsistency.ai" : "signal.jawlineConsistency.real", icon: "🦷",
        details,
    };
}
