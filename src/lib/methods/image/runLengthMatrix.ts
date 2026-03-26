/**
 * Run Length Matrix Analysis
 * AI detection method based on peer-reviewed research
 */
import type { AnalysisMethod } from "../../types";

export function analyzeRunLengthMatrix(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Run Length Matrix Analysis", nameKey: "signal.runLengthMatrix", category: "statistical", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.runLengthMatrix.error", icon: "📏" };
    }
    let sig=0,cnt=0;const step=3;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const nb=[p[i-4],p[i+4],p[i-w*4],p[i+w*4]];const avg=nb.reduce((a,b)=>a+b,0)/4;const d=Math.abs(p[i]-avg);if(d>3&&d<15)sig++;cnt++;}const r=cnt>0?sig/cnt:0;
    let score: number;
    if(r<0.05)score=62;else if(r<0.15)score=48;else if(r>0.35)score=32;else score=46;
    return {
        name: "Run Length Matrix Analysis", nameKey: "signal.runLengthMatrix", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Run Length Matrix Analysis suggests AI generation" : "Natural run length matrix analysis — consistent with real image",
        descriptionKey: score > 55 ? "signal.runLengthMatrix.ai" : "signal.runLengthMatrix.real", icon: "📏",
        details: `Signal: ${sig}, Ratio: ${r.toFixed(5)}`,
    };
}
