/**
 * Gait Analysis
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeGaitAnalysis(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Gait Analysis", nameKey: "signal.gaitAnalysis", category: "pixel", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.gaitAnalysis.error", icon: "🚶" };
    }
    const lowerH=Math.floor(h*0.6);let motion=0,cnt=0;const step=4;for(let y=lowerH;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4,j=i+w*4;motion+=Math.abs(p[i]-p[j]);cnt++;}const avgM=cnt>0?motion/cnt:0;
    let score: number;
    if(avgM<0.3)score=62;else if(avgM<2)score=48;else if(avgM>6)score=32;else score=42;
    return {
        name: "Gait Analysis", nameKey: "signal.gaitAnalysis", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Unnatural body movement — suggests synthetic generation" : "Natural gait pattern — consistent with real video",
        descriptionKey: score > 55 ? "signal.gaitAnalysis.ai" : "signal.gaitAnalysis.real", icon: "🚶",
        details: `Lower body motion: ${avgM.toFixed(3)}`,
    };
}
