/**
 * Vignette Analysis
 * AI detection method - Vignette Analysis
 */
import type { AnalysisMethod } from "../../types";

export function analyzeVignetteNatural(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Vignette Analysis", nameKey: "signal.vignetteAnalysis", category: "sensor", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.vignetteAnalysis.error", icon: "🔅" };
    }
    const cx=w/2,cy=h/2,maxR=Math.sqrt(cx*cx+cy*cy);let cBright=0,eBright=0,cc=0,ec=0;const step=4;for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4,b=(p[i]+p[i+1]+p[i+2])/3,d=Math.sqrt((x-cx)**2+(y-cy)**2)/maxR;if(d<0.3){cBright+=b;cc++;}else if(d>0.7){eBright+=b;ec++;}}const avgC=cc>0?cBright/cc:128,avgE=ec>0?eBright/ec:128,vDrop=(avgC-avgE)/avgC;
    let score: number;
    if(Math.abs(vDrop)<0.01)score=65;else if(vDrop>0.05&&vDrop<0.2)score=30;else if(vDrop>0.2)score=40;else score=50;
    return {
        name: "Vignette Analysis", nameKey: "signal.vignetteAnalysis", category: "sensor", score, weight: 0.2,
        description: score > 55 ? "No natural vignetting — typical of AI-generated images" : "Natural lens vignetting detected — consistent with real photo",
        descriptionKey: score > 55 ? "signal.vignetteAnalysis.ai" : "signal.vignetteAnalysis.real", icon: "🔅",
        details: `Vignette drop: ${(vDrop*100).toFixed(1)}%, Center: ${avgC.toFixed(1)}, Edge: ${avgE.toFixed(1)}`,
    };
}
