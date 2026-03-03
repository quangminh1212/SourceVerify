/**
 * Skin Pore Simulation
 * Based on scientific research (2023)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSkinPoreSimulation(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Skin Pore Simulation", nameKey: "signal.skinPoreSim", category: "sensor", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.skinPoreSim.error", icon: "🔬" };
    }
    const fX=Math.floor(w*0.3),fY=Math.floor(h*0.3),sz=Math.floor(Math.min(w*0.4,h*0.2));let micro=0,cnt=0;for(let y=fY;y<fY+sz&&y<h-1;y++)for(let x=fX;x<fX+sz&&x<w-1;x++){const i=(y*w+x)*4;const d=Math.abs(p[i]-p[i+4]);if(d>=1&&d<=4)micro++;cnt++;}const r=cnt>0?micro/cnt:0;
    let score: number;
    if(r<0.1)score=70;else if(r<0.25)score=52;else if(r>0.5)score=28;else score=44;
    return {
        name: "Skin Pore Simulation", nameKey: "signal.skinPoreSim", category: "sensor", score, weight: 0.3,
        description: score > 55 ? "Skin Pore Simulation — suggests deepfake" : "Natural skin pore simulation — consistent with real video",
        descriptionKey: score > 55 ? "signal.skinPoreSim.ai" : "signal.skinPoreSim.real", icon: "🔬",
        details: `Pore sim: ${r.toFixed(4)}`,
    };
}
