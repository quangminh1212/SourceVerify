/**
 * Wiener Filter Residual
 * Based on scientific research papers (2012)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeWienerResidual(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Wiener Filter Residual", nameKey: "signal.wienerResidual", category: "frequency", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.wienerResidual.error", icon: "📡" };
    }
    let residual=0,cnt=0;const step=2;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const pred=(p[i-4]+p[i+4]+p[i-w*4]+p[i+w*4])/4;residual+=Math.abs(p[i]-pred);cnt++;}const avgR=cnt>0?residual/cnt:0;
    let score: number;
    if(avgR<2)score=70;else if(avgR<5)score=52;else if(avgR>12)score=28;else score=42;
    return {
        name: "Wiener Filter Residual", nameKey: "signal.wienerResidual", category: "frequency", score, weight: 0.3,
        description: score > 55 ? "Wiener Filter Residual — suggests AI generation" : "Natural wiener filter residual — consistent with real image",
        descriptionKey: score > 55 ? "signal.wienerResidual.ai" : "signal.wienerResidual.real", icon: "📡",
        details: `Wiener residual: ${avgR.toFixed(3)}`,
    };
}
