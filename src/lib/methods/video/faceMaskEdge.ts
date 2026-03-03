/**
 * Face Mask Edge
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeFaceMaskEdge(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Face Mask Edge", nameKey: "signal.faceMaskEdge", category: "sensor", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.faceMaskEdge.error", icon: "🎭" };
    }
    const fX=Math.floor(w*0.2),fW=Math.floor(w*0.6),fY=Math.floor(h*0.1),fH=Math.floor(h*0.75);const borderW=6;let borderG=0,innerG=0,bc=0,ic=0;const step=2;for(let y=fY;y<fY+fH&&y<h-1;y+=step)for(let x=fX;x<fX+fW&&x<w-1;x+=step){const i=(y*w+x)*4;const g=Math.abs(p[i]-p[i+4]);const isB=(x<fX+borderW||x>fX+fW-borderW||y<fY+borderW||y>fY+fH-borderW);if(isB){borderG+=g;bc++;}else{innerG+=g;ic++;}}const bAvg=bc>0?borderG/bc:0,iAvg=ic>0?innerG/ic:0;const ratio=iAvg>0?bAvg/iAvg:1;
    let score: number;
    if(ratio>3)score=74;else if(ratio>2)score=58;else if(ratio<0.8)score=30;else score=44;
    return {
        name: "Face Mask Edge", nameKey: "signal.faceMaskEdge", category: "sensor", score, weight: 0.3,
        description: score > 55 ? "Face Mask Edge pattern suggests deepfake" : "Natural face mask edge — consistent with real video",
        descriptionKey: score > 55 ? "signal.faceMaskEdge.ai" : "signal.faceMaskEdge.real", icon: "🎭",
        details: `Border/Inner: ${ratio.toFixed(3)}`,
    };
}
