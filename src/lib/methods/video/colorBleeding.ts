/**
 * Color Bleeding
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeColorBleeding(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Color Bleeding", nameKey: "signal.colorBleeding", category: "pixel", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.colorBleeding.error", icon: "🩸" };
    }
    let bleed=0,cnt=0;const step=3;for(let y=0;y<h-1;y+=step)for(let x=0;x<w-1;x+=step){const i=(y*w+x)*4,j=i+4;const rDiff=Math.abs(p[i]-p[j]),gDiff=Math.abs(p[i+1]-p[j+1]),bDiff=Math.abs(p[i+2]-p[j+2]);if(rDiff>30&&gDiff<5&&bDiff<5||gDiff>30&&rDiff<5&&bDiff<5)bleed++;cnt++;}const r=cnt>0?bleed/cnt:0;
    let score: number;
    if(r<0.001)score=62;else if(r<0.01)score=48;else if(r>0.05)score=32;else score=44;
    return {
        name: "Color Bleeding", nameKey: "signal.colorBleeding", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Color Bleeding pattern suggests deepfake" : "Natural color bleeding — consistent with real video",
        descriptionKey: score > 55 ? "signal.colorBleeding.ai" : "signal.colorBleeding.real", icon: "🩸",
        details: `Color bleed: ${bleed}, Ratio: ${r.toFixed(5)}`,
    };
}
