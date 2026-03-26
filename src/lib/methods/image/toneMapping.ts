/**
 * Tone Mapping Detection
 * AI detection method - Tone Mapping Detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeToneMappingDetect(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Tone Mapping Detection", nameKey: "signal.toneMapping", category: "statistical", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.toneMapping.error", icon: "🎛️" };
    }
    const hist=new Float64Array(256);const step=2;let cnt=0;for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4;const lum=Math.round(0.299*p[i]+0.587*p[i+1]+0.114*p[i+2]);hist[lum]++;cnt++;}let gaps=0,plateaus=0;for(let i=1;i<255;i++){if(hist[i]===0&&hist[i-1]>0&&hist[i+1]>0)gaps++;if(Math.abs(hist[i]-hist[i-1])<cnt*0.0001&&hist[i]>0)plateaus++;}
    let score: number;
    if(gaps>10)score=65;else if(gaps>5)score=55;else if(plateaus>50)score=60;else score=38;
    return {
        name: "Tone Mapping Detection", nameKey: "signal.toneMapping", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Tone mapping artifacts detected — suggests post-processing or AI" : "Natural tonal distribution — consistent with real capture",
        descriptionKey: score > 55 ? "signal.toneMapping.ai" : "signal.toneMapping.real", icon: "🎛️",
        details: `Histogram gaps: ${gaps}, Plateaus: ${plateaus}`,
    };
}
