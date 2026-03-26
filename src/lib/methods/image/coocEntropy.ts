/**
 * Co-occurrence Entropy
 * Based on scientific research papers (2015)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeCoocEntropy(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Co-occurrence Entropy", nameKey: "signal.coocEntropy", category: "statistical", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.coocEntropy.error", icon: "🎲" };
    }
    const cooc=new Float64Array(256);let total=0;const step=2;for(let y=0;y<h;y+=step)for(let x=0;x<w-1;x+=step){const i=(y*w+x)*4;const pair=((p[i]>>4)<<4)|(p[i+4]>>4);cooc[pair]++;total++;}let entropy=0;for(let i=0;i<256;i++){if(cooc[i]>0){const pr=cooc[i]/total;entropy-=pr*Math.log2(pr);}}
    let score: number;
    if(entropy<5)score=68;else if(entropy<7)score=50;else if(entropy>8)score=28;else score=44;
    return {
        name: "Co-occurrence Entropy", nameKey: "signal.coocEntropy", category: "statistical", score, weight: 0.3,
        description: score > 55 ? "Co-occurrence Entropy — suggests AI generation" : "Natural co-occurrence entropy — consistent with real image",
        descriptionKey: score > 55 ? "signal.coocEntropy.ai" : "signal.coocEntropy.real", icon: "🎲",
        details: `Co-oc entropy: ${entropy.toFixed(3)}`,
    };
}
