/**
 * Color Entropy
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeColorEntropy(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Color Entropy", nameKey: "signal.colorEntropy", category: "statistical", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.colorEntropy.error", icon: "🎲" };
    }
    const cHist=new Map();const step=4;let total=0;for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4;const key=((p[i]>>4)<<8)|((p[i+1]>>4)<<4)|(p[i+2]>>4);cHist.set(key,(cHist.get(key)||0)+1);total++;}let entropy=0;for(const cnt of cHist.values()){const pr=cnt/total;entropy-=pr*Math.log2(pr);}
    let score: number;
    if(entropy<6)score=66;else if(entropy<8)score=50;else if(entropy>11)score=30;else score=42;
    return {
        name: "Color Entropy", nameKey: "signal.colorEntropy", category: "statistical", score, weight: 0.3,
        description: score > 55 ? "Color Entropy pattern suggests AI generation" : "Natural color entropy — consistent with real image",
        descriptionKey: score > 55 ? "signal.colorEntropy.ai" : "signal.colorEntropy.real", icon: "🎲",
        details: `Color entropy: ${entropy.toFixed(3)}`,
    };
}
