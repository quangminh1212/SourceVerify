/**
 * Face X-Ray Boundary
 * Based on scientific research (2020)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeFaceXray(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Face X-Ray Boundary", nameKey: "signal.faceXray", category: "sensor", score: 50, weight: 0.4, description: "Frame too small", descriptionKey: "signal.faceXray.error", icon: "☢️" };
    }
    const fX=Math.floor(w*0.15),fW=Math.floor(w*0.7),fY=Math.floor(h*0.1),fH=Math.floor(h*0.75);const borderW=4;let borderVar=0,innerVar=0,bc=0,ic=0;for(let y=fY;y<fY+fH&&y<h-1;y+=2)for(let x=fX;x<fX+fW&&x<w-1;x+=2){const i=(y*w+x)*4;const d=Math.abs(p[i]-p[i+4])+Math.abs(p[i]-p[i+w*4]);const isB=x<fX+borderW||x>fX+fW-borderW||y<fY+borderW||y>fY+fH-borderW;if(isB){borderVar+=d;bc++;}else{innerVar+=d;ic++;}}const bA=bc>0?borderVar/bc:0,iA=ic>0?innerVar/ic:0;const ratio=iA>0?bA/iA:1;
    let score: number;
    if(ratio>3)score=76;else if(ratio>2)score=60;else if(ratio<0.9)score=28;else score=44;
    return {
        name: "Face X-Ray Boundary", nameKey: "signal.faceXray", category: "sensor", score, weight: 0.4,
        description: score > 55 ? "Face X-Ray Boundary — suggests deepfake" : "Natural face x-ray boundary — consistent with real video",
        descriptionKey: score > 55 ? "signal.faceXray.ai" : "signal.faceXray.real", icon: "☢️",
        details: `X-Ray ratio: ${ratio.toFixed(3)}`,
    };
}
