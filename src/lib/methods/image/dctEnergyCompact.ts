/**
 * DCT Energy Compaction
 * Based on scientific research papers (2020)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeDctEnergyCompact(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "DCT Energy Compaction", nameKey: "signal.dctEnergyCompact", category: "frequency", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.dctEnergyCompact.error", icon: "⚡" };
    }
    const bSz=8,gx=Math.min(8,Math.floor(w/bSz)),gy=Math.min(8,Math.floor(h/bSz));let lowE=0,highE=0;for(let by=0;by<gy;by++)for(let bx=0;bx<gx;bx++){for(let y=0;y<bSz;y++)for(let x=0;x<bSz;x++){const i=((by*bSz+y)*w+(bx*bSz+x))*4;if(x+y<4)lowE+=p[i]*p[i];else highE+=p[i]*p[i];}}const ratio=lowE>0?highE/lowE:0;
    let score: number;
    if(ratio<0.05)score=68;else if(ratio<0.15)score=52;else if(ratio>0.4)score=28;else score=44;
    return {
        name: "DCT Energy Compaction", nameKey: "signal.dctEnergyCompact", category: "frequency", score, weight: 0.3,
        description: score > 55 ? "DCT Energy Compaction — suggests AI generation" : "Natural dct energy compaction — consistent with real image",
        descriptionKey: score > 55 ? "signal.dctEnergyCompact.ai" : "signal.dctEnergyCompact.real", icon: "⚡",
        details: `DCT HF/LF: ${ratio.toFixed(4)}`,
    };
}
