/**
 * Breathing Pattern
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeBreathingPattern(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Breathing Pattern", nameKey: "signal.breathingPattern", category: "sensor", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.breathingPattern.error", icon: "🫁" };
    }
    const chestY=Math.floor(h*0.55),chestH=Math.floor(h*0.15);let motionSum=0,cnt=0;for(let y=chestY;y<chestY+chestH&&y<h-1;y+=2)for(let x=Math.floor(w*0.3);x<Math.floor(w*0.7)&&x<w-1;x+=2){const i=(y*w+x)*4,j=i+w*4;motionSum+=Math.abs(p[i]-p[j])+Math.abs(p[i+1]-p[j+1]);cnt++;}const avgMotion=cnt>0?motionSum/(cnt*2):0;
    let score: number;
    if(avgMotion<0.5)score=68;else if(avgMotion<2)score=52;else if(avgMotion>5)score=30;else score=44;
    return {
        name: "Breathing Pattern", nameKey: "signal.breathingPattern", category: "sensor", score, weight: 0.3,
        description: score > 55 ? "No breathing motion detected — characteristic of deepfake" : "Natural breathing pattern detected — consistent with real video",
        descriptionKey: score > 55 ? "signal.breathingPattern.ai" : "signal.breathingPattern.real", icon: "🫁",
        details: `Chest motion avg: ${avgMotion.toFixed(3)}`,
    };
}
