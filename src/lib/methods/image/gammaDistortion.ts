/**
 * Gamma Distortion
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeGammaDistortion(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Gamma Distortion", nameKey: "signal.gammaDistortion", category: "statistical", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.gammaDistortion.error", icon: "📐" };
    }
    const hist=new Float64Array(256);const step=3;let cnt=0;for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4;const lum=Math.round(0.299*p[i]+0.587*p[i+1]+0.114*p[i+2]);hist[lum]++;cnt++;}let mid=0;for(let i=0;i<128;i++)mid+=hist[i];const midR=cnt>0?mid/cnt:0.5;const gammaEst=Math.log(midR)/Math.log(0.5);
    let score: number;
    if(Math.abs(gammaEst-1)<0.1)score=65;else if(Math.abs(gammaEst-1)<0.3)score=50;else if(gammaEst>2)score=30;else score=42;
    return {
        name: "Gamma Distortion", nameKey: "signal.gammaDistortion", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Gamma Distortion pattern suggests AI generation" : "Natural gamma distortion — consistent with real image",
        descriptionKey: score > 55 ? "signal.gammaDistortion.ai" : "signal.gammaDistortion.real", icon: "📐",
        details: `Gamma est: ${gammaEst.toFixed(3)}, Mid ratio: ${midR.toFixed(3)}`,
    };
}
