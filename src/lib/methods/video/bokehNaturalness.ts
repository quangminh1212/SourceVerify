/**
 * Bokeh Naturalness
 * Algorithm: blurEst
 */
import type { AnalysisMethod } from "../../types";

export function analyzeBokehNaturalness(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Bokeh Naturalness", nameKey: "signal.bokehNaturalness", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.bokehNaturalness.error", icon: "📸" };
    }
let sharpPx=0,total=0;
for(let y=2;y<h-2;y+=3){for(let x=2;x<w-2;x+=3){const i=(y*w+x)*4;
const c=pixels[i];const lap=Math.abs(-4*c+pixels[i-4]+pixels[i+4]+pixels[i-w*4]+pixels[i+w*4]);
if(lap>15)sharpPx++;total++;}}
const ratio=total>0?sharpPx/total:0;
let score;if(ratio<0.1)score=65;else if(ratio<0.3)score=52;else if(ratio>0.6)score=32;else score=44;
const details=`Sharp ratio: ${ratio.toFixed(4)}.`;
    return {
        name: "Bokeh Naturalness", nameKey: "signal.bokehNaturalness", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Bokeh Naturalness — potential AI artifact" : "Natural bokeh naturalness — authentic",
        descriptionKey: score > 55 ? "signal.bokehNaturalness.ai" : "signal.bokehNaturalness.real", icon: "📸",
        details,
    };
}
