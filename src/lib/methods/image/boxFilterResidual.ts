/**
 * Box Filter Residual
 * Based on scientific research papers (2018)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeBoxFilterResidual(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Box Filter Residual", nameKey: "signal.boxFilterResid", category: "frequency", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.boxFilterResid.error", icon: "📦" };
    }
    let res=0,cnt=0;const step=3;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const avg9=(p[i-w*4-4]+p[i-w*4]+p[i-w*4+4]+p[i-4]+p[i]+p[i+4]+p[i+w*4-4]+p[i+w*4]+p[i+w*4+4])/9;res+=Math.abs(p[i]-avg9);cnt++;}const avgRes=cnt>0?res/cnt:0;
    let score: number;
    if(avgRes<1.5)score=68;else if(avgRes<4)score=50;else if(avgRes>10)score=28;else score=44;
    return {
        name: "Box Filter Residual", nameKey: "signal.boxFilterResid", category: "frequency", score, weight: 0.2,
        description: score > 55 ? "Box Filter Residual — suggests AI generation" : "Natural box filter residual — consistent with real image",
        descriptionKey: score > 55 ? "signal.boxFilterResid.ai" : "signal.boxFilterResid.real", icon: "📦",
        details: `Box residual: ${avgRes.toFixed(3)}`,
    };
}
