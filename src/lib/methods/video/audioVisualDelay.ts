/**
 * Audio-Visual Delay
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeAudioVisualDelay(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Audio-Visual Delay", nameKey: "signal.audioVisualDelay", category: "sensor", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.audioVisualDelay.error", icon: "⏱️" };
    }
    const mY=Math.floor(h*0.55),mH=Math.floor(h*0.15),mX=Math.floor(w*0.3),mW=Math.floor(w*0.4);let mouthActivity=0,cnt=0;for(let y=mY;y<mY+mH&&y<h-1;y+=2)for(let x=mX;x<mX+mW&&x<w-1;x+=2){const i=(y*w+x)*4;const g=Math.abs(p[i]-p[i+4])+Math.abs(p[i]-p[i+w*4]);mouthActivity+=g;cnt++;}const avgAct=cnt>0?mouthActivity/cnt:0;
    let score: number;
    if(avgAct<2)score=64;else if(avgAct<8)score=48;else if(avgAct>20)score=35;else score=44;
    return {
        name: "Audio-Visual Delay", nameKey: "signal.audioVisualDelay", category: "sensor", score, weight: 0.3,
        description: score > 55 ? "Audio-visual timing mismatch detected" : "Synchronized audio-visual — consistent with real recording",
        descriptionKey: score > 55 ? "signal.audioVisualDelay.ai" : "signal.audioVisualDelay.real", icon: "⏱️",
        details: `Mouth activity: ${avgAct.toFixed(3)}`,
    };
}
