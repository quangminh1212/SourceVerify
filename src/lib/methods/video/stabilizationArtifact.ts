/**
 * Stabilization Artifact
 * Algorithm: borderCheck
 */
import type { AnalysisMethod } from "../../types";

export function analyzeStabilizationArtifact(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Stabilization Artifact", nameKey: "signal.stabilizationArtifact", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.stabilizationArtifact.error", icon: "📹" };
    }
const bw=Math.max(4,Math.floor(Math.min(w,h)*0.03));let borderVar=0,cnt=0;
for(let y=0;y<bw;y++){for(let x=0;x<w;x+=2){const i=(y*w+x)*4;borderVar+=pixels[i];cnt++;}}
for(let y=h-bw;y<h;y++){for(let x=0;x<w;x+=2){const i=(y*w+x)*4;borderVar+=pixels[i];cnt++;}}
const bMean=cnt>0?borderVar/cnt:128;let bVar2=0;cnt=0;
for(let y=0;y<bw;y++){for(let x=0;x<w;x+=4){const i=(y*w+x)*4;bVar2+=(pixels[i]-bMean)**2;cnt++;}}
const std=Math.sqrt(cnt>0?bVar2/cnt:0);
let score;if(std<5)score=68;else if(std<15)score=55;else if(std>40)score=30;else score=44;
const details=`Border std: ${std.toFixed(2)}.`;
    return {
        name: "Stabilization Artifact", nameKey: "signal.stabilizationArtifact", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Stabilization Artifact — potential AI artifact" : "Natural stabilization artifact — authentic",
        descriptionKey: score > 55 ? "signal.stabilizationArtifact.ai" : "signal.stabilizationArtifact.real", icon: "📹",
        details,
    };
}
