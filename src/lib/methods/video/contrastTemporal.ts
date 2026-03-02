/**
 * Contrast Temporal
 * Algorithm: contrast
 */
import type { AnalysisMethod } from "../../types";

export function analyzeContrastTemporal(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Contrast Temporal", nameKey: "signal.contrastTemporal", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.contrastTemporal.error", icon: "🔲" };
    }
let minV=255,maxV=0;
for(let i=0;i<pixels.length;i+=8){const g=Math.round(pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114);if(g<minV)minV=g;if(g>maxV)maxV=g;}
const contrast=maxV-minV;const michelson=maxV+minV>0?(maxV-minV)/(maxV+minV):0;
let score;if(michelson>0.95)score=40;else if(michelson>0.8)score=50;else if(michelson<0.3)score=68;else score=52;
const details=`Michelson: ${michelson.toFixed(3)}, Range: ${contrast}.`;
    return {
        name: "Contrast Temporal", nameKey: "signal.contrastTemporal", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Contrast Temporal — potential AI artifact" : "Natural contrast temporal — authentic",
        descriptionKey: score > 55 ? "signal.contrastTemporal.ai" : "signal.contrastTemporal.real", icon: "🔲",
        details,
    };
}
