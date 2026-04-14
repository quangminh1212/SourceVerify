/**
 * Video Saturation
 * Algorithm: satDist
 */
import type { AnalysisMethod } from "../../types";

export function analyzeVideoSaturation(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Video Saturation", nameKey: "signal.videoSaturation", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.videoSaturation.error", icon: "🎨" };
    }
const satHist=new Array(11).fill(0);
for(let i=0;i<pixels.length;i+=8){const r=pixels[i],g=pixels[i+1],b=pixels[i+2];const mx=Math.max(r,g,b),mn=Math.min(r,g,b);
const s=mx>0?(mx-mn)/mx:0;satHist[Math.min(Math.floor(s*10),10)]++;}
const total=satHist.reduce((a,b)=>a+b,0);let ent=0;for(const c of satHist){if(c>0){const p=c/total;ent-=p*Math.log2(p);}}
let score;if(ent<2)score=66;else if(ent<2.8)score=54;else if(ent>3.2)score=32;else score=44;
const details=`Sat entropy: ${ent.toFixed(3)}.`;
    return {
        name: "Video Saturation", nameKey: "signal.videoSaturation", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Video Saturation — potential AI artifact" : "Natural video saturation — authentic",
        descriptionKey: score > 55 ? "signal.videoSaturation.ai" : "signal.videoSaturation.real", icon: "🎨",
        details,
    };
}
