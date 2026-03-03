/**
 * Laplacian Variance
 * Based on scientific research papers (2004)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeLaplacianVariance(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Laplacian Variance", nameKey: "signal.laplacianVar", category: "pixel", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.laplacianVar.error", icon: "🔍" };
    }
    let sum=0,sum2=0,cnt=0;const step=2;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const lap=4*p[i]-p[i-4]-p[i+4]-p[i-w*4]-p[i+w*4];sum+=lap;sum2+=lap*lap;cnt++;}const mean=cnt>0?sum/cnt:0;const vari=cnt>0?sum2/cnt-mean*mean:0;
    let score: number;
    if(vari<50)score=70;else if(vari<200)score=52;else if(vari>1000)score=28;else score=44;
    return {
        name: "Laplacian Variance", nameKey: "signal.laplacianVar", category: "pixel", score, weight: 0.3,
        description: score > 55 ? "Laplacian Variance — suggests AI generation" : "Natural laplacian variance — consistent with real image",
        descriptionKey: score > 55 ? "signal.laplacianVar.ai" : "signal.laplacianVar.real", icon: "🔍",
        details: `Laplacian var: ${vari.toFixed(1)}`,
    };
}
