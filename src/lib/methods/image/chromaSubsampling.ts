/**
 * Chroma Subsampling
 * AI detection method - Chroma Subsampling
 */
import type { AnalysisMethod } from "../../types";

export function analyzeChromaSubsampling(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Chroma Subsampling", nameKey: "signal.chromaSubsampling", category: "frequency", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.chromaSubsampling.error", icon: "🔲" };
    }
    let chromaDiff=0,lumaDiff=0,cnt=0;for(let y=0;y<h-2;y+=2)for(let x=0;x<w-2;x+=2){const i=(y*w+x)*4;const cb1=(p[i+2]-p[i])/2,cb2=(p[(y*w+x+2)*4+2]-p[(y*w+x+2)*4])/2;chromaDiff+=Math.abs(cb1-cb2);const l1=p[i],l2=p[(y*w+x+2)*4];lumaDiff+=Math.abs(l1-l2);cnt++;}const cAvg=cnt>0?chromaDiff/cnt:0;const lAvg=cnt>0?lumaDiff/cnt:0;const ratio=lAvg>0?cAvg/lAvg:1;
    let score: number;
    if(ratio<0.3)score=65;else if(ratio<0.6)score=50;else if(ratio>1.2)score=30;else score=44;
    return {
        name: "Chroma Subsampling", nameKey: "signal.chromaSubsampling", category: "frequency", score, weight: 0.2,
        description: score > 55 ? "Unusual chroma subsampling — suggests AI generation" : "Normal chroma subsampling — consistent with real compression",
        descriptionKey: score > 55 ? "signal.chromaSubsampling.ai" : "signal.chromaSubsampling.real", icon: "🔲",
        details: `Chroma: ${cAvg.toFixed(2)}, Luma: ${lAvg.toFixed(2)}, Ratio: ${ratio.toFixed(3)}`,
    };
}
