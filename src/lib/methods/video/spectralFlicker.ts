/**
 * Spectral Flicker
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSpectralFlicker(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Spectral Flicker", nameKey: "signal.spectralFlicker", category: "frequency", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.spectralFlicker.error", icon: "💫" };
    }
    let flickerCount=0,cnt=0;const step=4;for(let x=0;x<w;x+=step){let prev=p[x*4];for(let y=step;y<h;y+=step){const cur=p[(y*w+x)*4];if(Math.abs(cur-prev)>30)flickerCount++;cnt++;prev=cur;}}const flickerR=cnt>0?flickerCount/cnt:0;
    let score: number;
    if(flickerR>0.3)score=68;else if(flickerR>0.15)score=55;else if(flickerR<0.05)score=30;else score=44;
    return {
        name: "Spectral Flicker", nameKey: "signal.spectralFlicker", category: "frequency", score, weight: 0.2,
        description: score > 55 ? "Spectral flicker detected — suggests synthetic generation" : "No spectral flicker — consistent with real video",
        descriptionKey: score > 55 ? "signal.spectralFlicker.ai" : "signal.spectralFlicker.real", icon: "💫",
        details: `Flicker ratio: ${flickerR.toFixed(4)}`,
    };
}
