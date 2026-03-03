/**
 * Video Freq Spectrum
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeVideoFreqSpectrum(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Video Freq Spectrum", nameKey: "signal.videoFreqSpectrum", category: "frequency", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.videoFreqSpectrum.error", icon: "📡" };
    }
    const sz=Math.min(32,Math.min(w,h));let lowE=0,highE=0;for(let k=1;k<=sz/2;k++){let re=0,im=0;for(let n=0;n<sz;n++){const a=-2*Math.PI*k*n/sz;const i=(n*w)*4;re+=p[i]*Math.cos(a);im+=p[i]*Math.sin(a);}const pw=re*re+im*im;if(k<=sz/4)lowE+=pw;else highE+=pw;}const ratio=lowE>0?highE/lowE:0;
    let score: number;
    if(ratio<0.01)score=66;else if(ratio<0.05)score=50;else if(ratio>0.2)score=28;else score=44;
    return {
        name: "Video Freq Spectrum", nameKey: "signal.videoFreqSpectrum", category: "frequency", score, weight: 0.3,
        description: score > 55 ? "Video Freq Spectrum pattern suggests deepfake" : "Natural video freq spectrum — consistent with real video",
        descriptionKey: score > 55 ? "signal.videoFreqSpectrum.ai" : "signal.videoFreqSpectrum.real", icon: "📡",
        details: `HF/LF ratio: ${ratio.toFixed(4)}`,
    };
}
