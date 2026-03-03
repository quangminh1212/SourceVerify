/**
 * Nostril Darkness
 * Based on scientific research (2020)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeNostrilDarkness(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Nostril Darkness", nameKey: "signal.nostrilDarkness", category: "sensor", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.nostrilDarkness.error", icon: "👃" };
    }
    const nX=Math.floor(w*0.42),nY=Math.floor(h*0.42),nW=Math.floor(w*0.16),nH=Math.floor(h*0.06);let darkPx=0,cnt=0;for(let y=nY;y<nY+nH&&y<h;y++)for(let x=nX;x<nX+nW&&x<w;x++){const i=(y*w+x)*4;if(p[i]<50&&p[i+1]<50&&p[i+2]<50)darkPx++;cnt++;}const r=cnt>0?darkPx/cnt:0;
    let score: number;
    if(r<0.01)score=62;else if(r<0.08)score=46;else if(r>0.25)score=34;else score=44;
    return {
        name: "Nostril Darkness", nameKey: "signal.nostrilDarkness", category: "sensor", score, weight: 0.2,
        description: score > 55 ? "Nostril Darkness — suggests deepfake" : "Natural nostril darkness — consistent with real video",
        descriptionKey: score > 55 ? "signal.nostrilDarkness.ai" : "signal.nostrilDarkness.real", icon: "👃",
        details: `Nostril dark: ${r.toFixed(4)}`,
    };
}
