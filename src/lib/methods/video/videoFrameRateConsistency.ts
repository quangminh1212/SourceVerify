/**
 * Frame Rate Consistency
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeVideoFrameRateConsistency(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Frame Rate Consistency", nameKey: "signal.videoFrameRateConsistency", category: "frequency", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.videoFrameRateConsistency.error", icon: "🎞️" };
    }
    let diffSum=0,cnt=0;const step=4;for(let y=0;y<h-step;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4,j=((y+step)*w+x)*4;diffSum+=Math.abs(p[i]-p[j]);cnt++;}const avgDiff=cnt>0?diffSum/cnt:0;
    let score: number;
    if(avgDiff<1)score=64;else if(avgDiff<4)score=48;else if(avgDiff>10)score=32;else score=44;
    return {
        name: "Frame Rate Consistency", nameKey: "signal.videoFrameRateConsistency", category: "frequency", score, weight: 0.2,
        description: score > 55 ? "Irregular frame rate pattern — suggests synthetic generation" : "Consistent frame rate — typical of real video",
        descriptionKey: score > 55 ? "signal.videoFrameRateConsistency.ai" : "signal.videoFrameRateConsistency.real", icon: "🎞️",
        details: `Frame diff avg: ${avgDiff.toFixed(3)}`,
    };
}
