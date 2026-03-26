/**
 * Sobel Magnitude Dist
 * Based on scientific research papers (2007)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSobelMagnitude(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Sobel Magnitude Dist", nameKey: "signal.sobelMagDist", category: "pixel", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.sobelMagDist.error", icon: "📏" };
    }
    const bins=new Float64Array(20);let cnt=0;const step=2;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const gx=-p[i-w*4-4]+p[i-w*4+4]-2*p[i-4]+2*p[i+4]-p[i+w*4-4]+p[i+w*4+4];const gy=-p[i-w*4-4]-2*p[i-w*4]-p[i-w*4+4]+p[i+w*4-4]+2*p[i+w*4]+p[i+w*4+4];const mag=Math.sqrt(gx*gx+gy*gy);const bin=Math.min(19,Math.floor(mag/15));bins[bin]++;cnt++;}const lowR=cnt>0?bins[0]/cnt:0;
    let score: number;
    if(lowR>0.75)score=66;else if(lowR>0.5)score=50;else if(lowR<0.25)score=28;else score=44;
    return {
        name: "Sobel Magnitude Dist", nameKey: "signal.sobelMagDist", category: "pixel", score, weight: 0.3,
        description: score > 55 ? "Sobel Magnitude Dist — suggests AI generation" : "Natural sobel magnitude dist — consistent with real image",
        descriptionKey: score > 55 ? "signal.sobelMagDist.ai" : "signal.sobelMagDist.real", icon: "📏",
        details: `Low Sobel ratio: ${lowR.toFixed(3)}`,
    };
}
