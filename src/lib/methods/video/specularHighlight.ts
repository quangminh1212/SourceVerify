/**
 * Specular Highlight
 * Based on scientific research (2020)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSpecularHighlight(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Specular Highlight", nameKey: "signal.specularHighlight", category: "sensor", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.specularHighlight.error", icon: "✨" };
    }
    let specCount=0,cnt=0;const step=3;for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4;if(p[i]>250&&p[i+1]>250&&p[i+2]>250)specCount++;cnt++;}const r=cnt>0?specCount/cnt:0;let coherent=0;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;if(p[i]>250){const nb=p[i+4]+p[i-4]+p[i+w*4]+p[i-w*4];if(nb>900)coherent++;}}const cohR=specCount>0?coherent/specCount:0;
    let score: number;
    if(r<0.001&&cohR<0.3)score=64;else if(cohR>0.7)score=38;else score=48;
    return {
        name: "Specular Highlight", nameKey: "signal.specularHighlight", category: "sensor", score, weight: 0.2,
        description: score > 55 ? "Specular Highlight — suggests deepfake" : "Natural specular highlight — consistent with real video",
        descriptionKey: score > 55 ? "signal.specularHighlight.ai" : "signal.specularHighlight.real", icon: "✨",
        details: `Specular: ${specCount}, Coherent: ${cohR.toFixed(3)}`,
    };
}
