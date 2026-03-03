/**
 * JPEG Coefficient Distribution
 * AI detection method - JPEG Coefficient Distribution
 */
import type { AnalysisMethod } from "../../types";

export function analyzeJpegCoefficientDist(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "JPEG Coefficient Distribution", nameKey: "signal.jpegCoefficientDist", category: "frequency", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.jpegCoefficientDist.error", icon: "📦" };
    }
    const bSz=8,bins=new Float64Array(256);let total=0;for(let by=0;by<Math.min(h,64);by+=bSz)for(let bx=0;bx<Math.min(w,64);bx+=bSz){for(let y=0;y<bSz&&by+y<h;y++)for(let x=0;x<bSz&&bx+x<w;x++){const i=((by+y)*w+(bx+x))*4;const v=p[i]&0xFF;bins[v]++;total++;}}let nonZero=0,peak=0;for(let i=0;i<256;i++){if(bins[i]>0)nonZero++;if(bins[i]>bins[peak])peak=i;}const spread=nonZero/256;
    let score: number;
    if(spread<0.3)score=70;else if(spread<0.5)score=55;else if(spread>0.85)score=30;else score=44;
    return {
        name: "JPEG Coefficient Distribution", nameKey: "signal.jpegCoefficientDist", category: "frequency", score, weight: 0.2,
        description: score > 55 ? "Unusual coefficient distribution — suggests synthetic image" : "Natural JPEG coefficient distribution",
        descriptionKey: score > 55 ? "signal.jpegCoefficientDist.ai" : "signal.jpegCoefficientDist.real", icon: "📦",
        details: `Spread: ${spread.toFixed(3)}, Peak bin: ${peak}`,
    };
}
