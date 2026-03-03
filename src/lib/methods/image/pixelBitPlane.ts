/**
 * Pixel Bit Plane
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzePixelBitPlane(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Pixel Bit Plane", nameKey: "signal.pixelBitPlane", category: "frequency", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.pixelBitPlane.error", icon: "💾" };
    }
    const lsb=new Float64Array(256);const step=3;let cnt=0;for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4;const bit=p[i]&1;lsb[p[i]>>1]+=bit;cnt++;}let ones=0;for(let i=0;i<256;i++)ones+=lsb[i];const lsbR=cnt>0?ones/cnt:0.5;
    let score: number;
    if(Math.abs(lsbR-0.5)<0.02)score=65;else if(Math.abs(lsbR-0.5)<0.05)score=50;else if(Math.abs(lsbR-0.5)>0.15)score=30;else score=44;
    return {
        name: "Pixel Bit Plane", nameKey: "signal.pixelBitPlane", category: "frequency", score, weight: 0.3,
        description: score > 55 ? "Pixel Bit Plane pattern suggests AI generation" : "Natural pixel bit plane — consistent with real image",
        descriptionKey: score > 55 ? "signal.pixelBitPlane.ai" : "signal.pixelBitPlane.real", icon: "💾",
        details: `LSB ratio: ${lsbR.toFixed(4)}`,
    };
}
