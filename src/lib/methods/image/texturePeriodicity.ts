/**
 * Texture Periodicity
 * AI detection method - Texture Periodicity
 */
import type { AnalysisMethod } from "../../types";

export function analyzeTexturePeriodicity(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Texture Periodicity", nameKey: "signal.texturePeriodicity", category: "pixel", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.texturePeriodicity.error", icon: "🔁" };
    }
    const sz=Math.min(64,Math.min(w,h));let repCount=0,total=0;for(let y=0;y<sz;y++){for(let lag=2;lag<sz/2;lag++){let corr=0;for(let x=0;x<sz-lag;x++){const i=((y)*w+x)*4,j=((y)*w+x+lag)*4;corr+=Math.abs(p[i]-p[j]);}corr/=(sz-lag);if(corr<8)repCount++;total++;}}const pRatio=total>0?repCount/total:0;
    let score: number;
    if(pRatio>0.3)score=75;else if(pRatio>0.15)score=60;else if(pRatio<0.05)score=30;else score=45;
    return {
        name: "Texture Periodicity", nameKey: "signal.texturePeriodicity", category: "pixel", score, weight: 0.3,
        description: score > 55 ? "High texture periodicity — characteristic of AI generation" : "Natural texture variation — consistent with real image",
        descriptionKey: score > 55 ? "signal.texturePeriodicity.ai" : "signal.texturePeriodicity.real", icon: "🔁",
        details: `Periodic ratio: ${pRatio.toFixed(4)}`,
    };
}
