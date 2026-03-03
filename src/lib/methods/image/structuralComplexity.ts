/**
 * Structural Complexity
 * Based on scientific research papers (2016)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeStructuralComplexity(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Structural Complexity", nameKey: "signal.structComplexity", category: "statistical", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.structComplexity.error", icon: "🏛️" };
    }
    const bSz=16,gx=Math.floor(w/bSz),gy=Math.floor(h/bSz);let diversity=0;const blocks=[];for(let by=0;by<gy;by++)for(let bx=0;bx<gx;bx++){let s=0;for(let y=0;y<bSz;y++)for(let x=0;x<bSz;x++){const i=((by*bSz+y)*w+(bx*bSz+x))*4;s+=p[i];}blocks.push(Math.floor(s/(bSz*bSz*16)));}const unique=new Set(blocks).size;const ratio=blocks.length>0?unique/blocks.length:0;
    let score: number;
    if(ratio<0.3)score=66;else if(ratio<0.6)score=50;else if(ratio>0.9)score=28;else score=44;
    return {
        name: "Structural Complexity", nameKey: "signal.structComplexity", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Structural Complexity — suggests AI generation" : "Natural structural complexity — consistent with real image",
        descriptionKey: score > 55 ? "signal.structComplexity.ai" : "signal.structComplexity.real", icon: "🏛️",
        details: `Struct complexity: ${ratio.toFixed(3)}`,
    };
}
