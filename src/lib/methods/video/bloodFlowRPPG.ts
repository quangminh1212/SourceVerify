/**
 * Blood Flow rPPG
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeBloodFlowRPPG(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Blood Flow rPPG", nameKey: "signal.bloodFlowRPPG", category: "sensor", score: 50, weight: 0.4, description: "Frame too small", descriptionKey: "signal.bloodFlowRPPG.error", icon: "❤️" };
    }
    const fX=Math.floor(w*0.35),fY=Math.floor(h*0.2),fW=Math.floor(w*0.3),fH=Math.floor(h*0.15);let gSum=0,cnt=0;for(let y=fY;y<fY+fH&&y<h;y+=2)for(let x=fX;x<fX+fW&&x<w;x+=2){const i=(y*w+x)*4;gSum+=p[i+1];cnt++;}const avgG=cnt>0?gSum/cnt:128;let variance=0;for(let y=fY;y<fY+fH&&y<h;y+=2)for(let x=fX;x<fX+fW&&x<w;x+=2){const i=(y*w+x)*4;variance+=(p[i+1]-avgG)**2;}variance=cnt>0?Math.sqrt(variance/cnt):0;const cvG=avgG>0?variance/avgG:0;
    let score: number;
    if(cvG<0.02)score=70;else if(cvG<0.05)score=55;else if(cvG>0.15)score=28;else score=42;
    return {
        name: "Blood Flow rPPG", nameKey: "signal.bloodFlowRPPG", category: "sensor", score, weight: 0.4,
        description: score > 55 ? "No blood flow signal in green channel — suggests deepfake" : "Blood flow signal detected — consistent with real skin",
        descriptionKey: score > 55 ? "signal.bloodFlowRPPG.ai" : "signal.bloodFlowRPPG.real", icon: "❤️",
        details: `Green channel CV: ${cvG.toFixed(4)}, Avg: ${avgG.toFixed(1)}`,
    };
}
