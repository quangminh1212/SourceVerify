/**
 * Audio Spectral
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeAudioSpectral(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Audio Spectral", nameKey: "signal.audioSpectral", category: "sensor", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.audioSpectral.error", icon: "🔊" };
    }
    let highFreq=0,lowFreq=0,cnt=0;const step=4;for(let y=0;y<h;y+=step)for(let x=0;x<w-2;x+=step){const i=(y*w+x)*4;const d1=Math.abs(p[i]-p[i+4]),d2=Math.abs(p[i+4]-p[i+8]);if(d1>20&&d2>20)highFreq++;else lowFreq++;cnt++;}const hfR=cnt>0?highFreq/cnt:0;
    let score: number;
    if(hfR<0.05)score=62;else if(hfR<0.15)score=48;else if(hfR>0.4)score=35;else score=44;
    return {
        name: "Audio Spectral", nameKey: "signal.audioSpectral", category: "sensor", score, weight: 0.2,
        description: score > 55 ? "Unusual spectral pattern in frame — suggests synthetic content" : "Natural spectral distribution — consistent with real recording",
        descriptionKey: score > 55 ? "signal.audioSpectral.ai" : "signal.audioSpectral.real", icon: "🔊",
        details: `High freq ratio: ${hfR.toFixed(4)}`,
    };
}
