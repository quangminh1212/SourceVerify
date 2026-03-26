/**
 * Mean Shift Cluster
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeMeanShiftCluster(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Mean Shift Cluster", nameKey: "signal.meanShiftCluster", category: "statistical", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.meanShiftCluster.error", icon: "🎯" };
    }
    const colorBins=new Map();const step=5;for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4;const key=((p[i]>>5)<<6)|((p[i+1]>>5)<<3)|(p[i+2]>>5);colorBins.set(key,(colorBins.get(key)||0)+1);}const clusters=colorBins.size;
    let score: number;
    if(clusters<20)score=70;else if(clusters<50)score=55;else if(clusters>200)score=28;else score=44;
    return {
        name: "Mean Shift Cluster", nameKey: "signal.meanShiftCluster", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Mean Shift Cluster pattern suggests AI generation" : "Natural mean shift cluster — consistent with real image",
        descriptionKey: score > 55 ? "signal.meanShiftCluster.ai" : "signal.meanShiftCluster.real", icon: "🎯",
        details: `Color clusters: ${clusters}`,
    };
}
