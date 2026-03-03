/**
 * Edge Antialiasing
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeEdgeAntiAliasingVideo(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Edge Antialiasing", nameKey: "signal.edgeAAVideo", category: "pixel", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.edgeAAVideo.error", icon: "🔲" };
    }
    let smooth=0,hard=0;const step=3;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const g=Math.abs(p[i]-p[i+4])+Math.abs(p[i]-p[i+w*4]);if(g>20){const mid=(p[i-4]+p[i+4])/2;if(Math.abs(p[i]-mid)<10)smooth++;else hard++;}}const r=(smooth+hard)>0?smooth/(smooth+hard):0.5;
    let score: number;
    if(r>0.8)score=66;else if(r>0.5)score=48;else if(r<0.2)score=30;else score=44;
    return {
        name: "Edge Antialiasing", nameKey: "signal.edgeAAVideo", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Edge Antialiasing pattern suggests deepfake" : "Natural edge antialiasing — consistent with real video",
        descriptionKey: score > 55 ? "signal.edgeAAVideo.ai" : "signal.edgeAAVideo.real", icon: "🔲",
        details: `Smooth: ${smooth}, Hard: ${hard}`,
    };
}
