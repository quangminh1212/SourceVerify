/**
 * Video Artifact Grid
 * Algorithm: gridDetect
 */
import type { AnalysisMethod } from "../../types";

export function analyzeVideoArtifactGrid(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Video Artifact Grid", nameKey: "signal.videoArtifactGrid", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.videoArtifactGrid.error", icon: "📐" };
    }
const gs=16;let gridE=0,nonGridE=0,gC=0,nC=0;
for(let y=1;y<h;y++){const onGrid=y%gs===0;for(let x=0;x<w;x+=4){const i=(y*w+x)*4;const j=((y-1)*w+x)*4;
const d=Math.abs(pixels[i]-pixels[j]);if(onGrid){gridE+=d;gC++;}else{nonGridE+=d;nC++;}}}
const gAvg=gC>0?gridE/gC:0;const nAvg=nC>0?nonGridE/nC:1;const ratio=nAvg>0?gAvg/nAvg:1;
let score;if(ratio>1.8)score=70;else if(ratio>1.3)score=56;else if(ratio<0.8)score=35;else score=44;
const details=`Grid/non-grid: ${ratio.toFixed(3)}.`;
    return {
        name: "Video Artifact Grid", nameKey: "signal.videoArtifactGrid", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Video Artifact Grid — potential AI artifact" : "Natural video artifact grid — authentic",
        descriptionKey: score > 55 ? "signal.videoArtifactGrid.ai" : "signal.videoArtifactGrid.real", icon: "📐",
        details,
    };
}
