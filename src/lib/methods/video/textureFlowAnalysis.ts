/**
 * Texture Flow
 * Algorithm: coherence
 */
import type { AnalysisMethod } from "../../types";

export function analyzeTextureFlowAnalysis(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Texture Flow", nameKey: "signal.textureFlowAnalysis", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.textureFlowAnalysis.error", icon: "🌊" };
    }
let coh=0,cnt=0;
for(let y=1;y<h-1;y+=3){for(let x=1;x<w-1;x+=3){const i=(y*w+x)*4;
const gx=pixels[i+4]-pixels[i-4];const gy=pixels[i+w*4]-pixels[i-w*4];
const j=((y+1)*w+x)*4;const gx2=pixels[j+4]-pixels[j-4];const gy2=pixels[j+w*4]-pixels[j-w*4];
const dot=gx*gx2+gy*gy2;const m1=Math.sqrt(gx*gx+gy*gy);const m2=Math.sqrt(gx2*gx2+gy2*gy2);
if(m1>2&&m2>2)coh+=dot/(m1*m2);cnt++;}}
const avg=cnt>0?coh/cnt:0;
let score;if(avg>0.8)score=68;else if(avg>0.5)score=55;else if(avg<0.1)score=32;else score=44;
const details=`Flow coherence: ${avg.toFixed(4)}.`;
    return {
        name: "Texture Flow", nameKey: "signal.textureFlowAnalysis", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Texture Flow — potential AI artifact" : "Natural texture flow — authentic",
        descriptionKey: score > 55 ? "signal.textureFlowAnalysis.ai" : "signal.textureFlowAnalysis.real", icon: "🌊",
        details,
    };
}
