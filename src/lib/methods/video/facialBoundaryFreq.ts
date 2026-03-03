/**
 * Facial Boundary Frequency
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeFacialBoundaryFreq(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Facial Boundary Frequency", nameKey: "signal.facialBoundaryFreq", category: "frequency", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.facialBoundaryFreq.error", icon: "🎭" };
    }
    const fX=Math.floor(w*0.2),fW=Math.floor(w*0.6),fY=Math.floor(h*0.1),fH=Math.floor(h*0.7);let boundG=0,innerG=0,bc=0,ic=0;const step=2;for(let y=fY;y<fY+fH&&y<h-1;y+=step)for(let x=fX;x<fX+fW&&x<w-1;x+=step){const i=(y*w+x)*4;const g=Math.abs(p[i]-p[i+4])+Math.abs(p[i]-p[i+w*4]);const isB=(x<fX+8||x>fX+fW-8||y<fY+8||y>fY+fH-8);if(isB){boundG+=g;bc++;}else{innerG+=g;ic++;}}const bAvg=bc>0?boundG/bc:0,iAvg=ic>0?innerG/ic:0;const ratio=iAvg>0?bAvg/iAvg:1;
    let score: number;
    if(ratio>2.5)score=72;else if(ratio>1.8)score=58;else if(ratio<0.8)score=30;else score=44;
    return {
        name: "Facial Boundary Frequency", nameKey: "signal.facialBoundaryFreq", category: "frequency", score, weight: 0.3,
        description: score > 55 ? "Sharp facial boundary — characteristic of face-swapping deepfake" : "Natural face-background transition — consistent with real video",
        descriptionKey: score > 55 ? "signal.facialBoundaryFreq.ai" : "signal.facialBoundaryFreq.real", icon: "🎭",
        details: `Boundary: ${bAvg.toFixed(2)}, Inner: ${iAvg.toFixed(2)}, Ratio: ${ratio.toFixed(3)}`,
    };
}
