/**
 * Lens Distortion
 * AI detection method - Lens Distortion
 */
import type { AnalysisMethod } from "../../types";

export function analyzeLensDistortionImage(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Lens Distortion", nameKey: "signal.lensDistortionImage", category: "sensor", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.lensDistortionImage.error", icon: "🔍" };
    }
    const cx=w/2,cy=h/2;let innerG=0,outerG=0,ic=0,oc=0;const step=3;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const g=Math.abs(p[i]-p[i+4])+Math.abs(p[i]-p[i+w*4]);const d=Math.sqrt((x-cx)**2+(y-cy)**2)/Math.max(cx,cy);if(d<0.3){innerG+=g;ic++;}else if(d>0.7){outerG+=g;oc++;}}const iAvg=ic>0?innerG/ic:0,oAvg=oc>0?outerG/oc:0;const distR=iAvg>0?oAvg/iAvg:1;
    let score: number;
    if(Math.abs(distR-1)<0.05)score=64;else if(distR>1.1&&distR<1.5)score=35;else if(distR<0.8)score=40;else score=48;
    return {
        name: "Lens Distortion", nameKey: "signal.lensDistortionImage", category: "sensor", score, weight: 0.2,
        description: score > 55 ? "No lens distortion detected — suggests AI generation" : "Lens distortion pattern detected — consistent with real optics",
        descriptionKey: score > 55 ? "signal.lensDistortionImage.ai" : "signal.lensDistortionImage.real", icon: "🔍",
        details: `Inner grad: ${iAvg.toFixed(2)}, Outer: ${oAvg.toFixed(2)}, Ratio: ${distR.toFixed(3)}`,
    };
}
