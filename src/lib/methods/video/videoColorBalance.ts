/**
 * Color Balance
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeVideoColorBalance(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Color Balance", nameKey: "signal.videoColorBalance", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.videoColorBalance.error", icon: "⚖️" };
    }
    let rSum=0,gSum=0,bSum=0,cnt=0;const step=4;for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4;rSum+=p[i];gSum+=p[i+1];bSum+=p[i+2];cnt++;}const rA=cnt>0?rSum/cnt:128,gA=cnt>0?gSum/cnt:128,bA=cnt>0?bSum/cnt:128;const avg2=(rA+gA+bA)/3;const dev=Math.sqrt(((rA-avg2)**2+(gA-avg2)**2+(bA-avg2)**2)/3);
    let score: number;
    if(dev<3)score=64;else if(dev<8)score=48;else if(dev>20)score=30;else score=44;
    return {
        name: "Color Balance", nameKey: "signal.videoColorBalance", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Color Balance pattern suggests deepfake" : "Natural color balance — consistent with real video",
        descriptionKey: score > 55 ? "signal.videoColorBalance.ai" : "signal.videoColorBalance.real", icon: "⚖️",
        details: `R:${rA.toFixed(1)} G:${gA.toFixed(1)} B:${bA.toFixed(1)} Dev:${dev.toFixed(2)}`,
    };
}
