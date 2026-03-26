/**
 * Posterization
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzePosterizationDetect(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Posterization", nameKey: "signal.posterization", category: "statistical", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.posterization.error", icon: "🎭" };
    }
    const hist=new Float64Array(256);const step=2;let cnt=0;for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4;hist[p[i]]++;cnt++;}let gaps=0;for(let i=1;i<255;i++)if(hist[i]===0&&hist[i-1]>cnt*0.001&&hist[i+1]>cnt*0.001)gaps++;
    let score: number;
    if(gaps>30)score=72;else if(gaps>10)score=55;else if(gaps<3)score=30;else score=44;
    return {
        name: "Posterization", nameKey: "signal.posterization", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Posterization pattern suggests AI generation" : "Natural posterization — consistent with real image",
        descriptionKey: score > 55 ? "signal.posterization.ai" : "signal.posterization.real", icon: "🎭",
        details: `Posterization gaps: ${gaps}`,
    };
}
