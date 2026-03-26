/**
 * Image Complexity
 * AI detection method - Image Complexity
 */
import type { AnalysisMethod } from "../../types";

export function analyzeImageComplexity(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Image Complexity", nameKey: "signal.imageComplexity", category: "statistical", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.imageComplexity.error", icon: "🧮" };
    }
    let edges=0,cnt=0;const step=2;for(let y=0;y<h-1;y+=step)for(let x=0;x<w-1;x+=step){const i=(y*w+x)*4;const g=Math.abs(p[i]-p[i+4])+Math.abs(p[i]-p[i+w*4]);if(g>15)edges++;cnt++;}const complexity=cnt>0?edges/cnt:0;
    let score: number;
    if(complexity<0.1)score=65;else if(complexity<0.2)score=52;else if(complexity>0.5)score=30;else score=44;
    return {
        name: "Image Complexity", nameKey: "signal.imageComplexity", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Low image complexity — typical of AI-smoothed generation" : "Natural complexity level — consistent with real image",
        descriptionKey: score > 55 ? "signal.imageComplexity.ai" : "signal.imageComplexity.real", icon: "🧮",
        details: `Complexity index: ${complexity.toFixed(4)}`,
    };
}
