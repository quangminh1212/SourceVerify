/**
 * Inter-Frame Blend
 * Based on scientific research (2021)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeInterFrameBlend(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Inter-Frame Blend", nameKey: "signal.interFrameBlend", category: "frequency", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.interFrameBlend.error", icon: "🔀" };
    }
    let blendZone=0,cnt=0;const step=4;for(let y=step;y<h-step;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4;const above=p[((y-step)*w+x)*4];const below=p[((y+step)*w+x)*4];const predicted=(above+below)/2;if(Math.abs(p[i]-predicted)<3)blendZone++;cnt++;}const r=cnt>0?blendZone/cnt:0;
    let score: number;
    if(r>0.8)score=68;else if(r>0.6)score=52;else if(r<0.3)score=28;else score=44;
    return {
        name: "Inter-Frame Blend", nameKey: "signal.interFrameBlend", category: "frequency", score, weight: 0.3,
        description: score > 55 ? "Inter-Frame Blend — suggests deepfake" : "Natural inter-frame blend — consistent with real video",
        descriptionKey: score > 55 ? "signal.interFrameBlend.ai" : "signal.interFrameBlend.real", icon: "🔀",
        details: `Blend zone: ${r.toFixed(4)}`,
    };
}
