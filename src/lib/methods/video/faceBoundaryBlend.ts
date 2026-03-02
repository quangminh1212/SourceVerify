/**
 * Face Boundary Blend
 * Algorithm: blendDetect
 */
import type { AnalysisMethod } from "../../types";

export function analyzeFaceBoundaryBlend(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Face Boundary Blend", nameKey: "signal.faceBoundaryBlend", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.faceBoundaryBlend.error", icon: "🎭" };
    }
let blendScore2=0,cnt=0;const cx2=w/2,cy2=h/3;const r2=Math.min(w,h)/4;
for(let a=0;a<360;a+=5){const x=Math.floor(cx2+r2*Math.cos(a*Math.PI/180));const y=Math.floor(cy2+r2*Math.sin(a*Math.PI/180));
if(x>1&&x<w-2&&y>1&&y<h-2){const i=(y*w+x)*4;const io=(y*w+x+2)*4;const ii=(y*w+x-2)*4;
blendScore2+=Math.abs(2*pixels[i]-pixels[io]-pixels[ii])+Math.abs(2*pixels[i+1]-pixels[io+1]-pixels[ii+1]);cnt++;}}
const avg=cnt>0?blendScore2/cnt:0;
let score;if(avg<8)score=68;else if(avg<20)score=55;else if(avg>40)score=30;else score=44;
const details=`Blend score: ${avg.toFixed(2)}.`;
    return {
        name: "Face Boundary Blend", nameKey: "signal.faceBoundaryBlend", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Face Boundary Blend — potential AI artifact" : "Natural face boundary blend — authentic",
        descriptionKey: score > 55 ? "signal.faceBoundaryBlend.ai" : "signal.faceBoundaryBlend.real", icon: "🎭",
        details,
    };
}
