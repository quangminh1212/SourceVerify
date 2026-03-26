/**
 * Spatial Coherence
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSpatialCoherence(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Spatial Coherence", nameKey: "signal.spatialCoherence", category: "pixel", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.spatialCoherence.error", icon: "🌀" };
    }
    let coherent=0,incoherent=0;const step=4;for(let y=2;y<h-2;y+=step)for(let x=2;x<w-2;x+=step){const i=(y*w+x)*4;const c=p[i];const ring=[];for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(dx!==0||dy!==0)ring.push(p[((y+dy)*w+(x+dx))*4]);const avg=ring.reduce((a,b)=>a+b,0)/ring.length;if(Math.abs(c-avg)<10)coherent++;else incoherent++;}const r=(coherent+incoherent)>0?coherent/(coherent+incoherent):0.5;
    let score: number;
    if(r>0.9)score=68;else if(r>0.75)score=50;else if(r<0.5)score=28;else score=44;
    return {
        name: "Spatial Coherence", nameKey: "signal.spatialCoherence", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Spatial Coherence pattern suggests AI generation" : "Natural spatial coherence — consistent with real image",
        descriptionKey: score > 55 ? "signal.spatialCoherence.ai" : "signal.spatialCoherence.real", icon: "🌀",
        details: `Coherence: ${r.toFixed(4)}`,
    };
}
