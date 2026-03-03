/**
 * Bloom Artifact
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeBloomArtifact(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Bloom Artifact", nameKey: "signal.bloomArtifact", category: "pixel", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.bloomArtifact.error", icon: "💡" };
    }
    let bloom=0,c=0;const step=3;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;if(p[i]>230&&p[i+1]>230&&p[i+2]>230){const nb=[p[(y*w+x-1)*4],p[(y*w+x+1)*4],p[((y-1)*w+x)*4],p[((y+1)*w+x)*4]];const avg=nb.reduce((a,b)=>a+b,0)/4;if(avg>180)bloom++;}c++;}const r=c>0?bloom/c:0;
    let score: number;
    if(r<0.001)score=62;else if(r<0.01)score=45;else if(r>0.05)score=35;else score=48;
    return {
        name: "Bloom Artifact", nameKey: "signal.bloomArtifact", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Bloom Artifact pattern suggests AI generation" : "Natural bloom artifact — consistent with real image",
        descriptionKey: score > 55 ? "signal.bloomArtifact.ai" : "signal.bloomArtifact.real", icon: "💡",
        details: `Bloom: ${bloom}, Ratio: ${r.toFixed(5)}`,
    };
}
