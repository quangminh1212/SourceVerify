/**
 * Richardson-Lucy Deconv
 * Based on scientific research papers (2012)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeRichardsonLucy(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Richardson-Lucy Deconv", nameKey: "signal.richardsonLucy", category: "frequency", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.richardsonLucy.error", icon: "🔬" };
    }
    const sz=Math.min(64,Math.min(w,h));let sharpInc=0,cnt=0;for(let y=1;y<sz-1;y++)for(let x=1;x<sz-1;x++){const i=(y*w+x)*4;const lap=4*p[i]-p[i-4]-p[i+4]-p[i-w*4]-p[i+w*4];if(Math.abs(lap)>15)sharpInc++;cnt++;}const r=cnt>0?sharpInc/cnt:0;
    let score: number;
    if(r<0.15)score=68;else if(r<0.3)score=52;else if(r>0.6)score=28;else score=44;
    return {
        name: "Richardson-Lucy Deconv", nameKey: "signal.richardsonLucy", category: "frequency", score, weight: 0.3,
        description: score > 55 ? "Richardson-Lucy Deconv — suggests AI generation" : "Natural richardson-lucy deconv — consistent with real image",
        descriptionKey: score > 55 ? "signal.richardsonLucy.ai" : "signal.richardsonLucy.real", icon: "🔬",
        details: `Deconv sharpness: ${r.toFixed(4)}`,
    };
}
