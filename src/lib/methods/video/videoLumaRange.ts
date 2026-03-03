/**
 * Video Luma Range
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeVideoLumaRange(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Video Luma Range", nameKey: "signal.videoLumaRange", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.videoLumaRange.error", icon: "🔆" };
    }
    let mn=255,mx=0;const step=4;for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4;const v=Math.round(0.299*p[i]+0.587*p[i+1]+0.114*p[i+2]);if(v<mn)mn=v;if(v>mx)mx=v;}const dr=mx-mn;
    let score: number;
    if(dr<40)score=66;else if(dr<100)score=50;else if(dr>220)score=30;else score=44;
    return {
        name: "Video Luma Range", nameKey: "signal.videoLumaRange", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Video Luma Range pattern suggests deepfake" : "Natural video luma range — consistent with real video",
        descriptionKey: score > 55 ? "signal.videoLumaRange.ai" : "signal.videoLumaRange.real", icon: "🔆",
        details: `Luma range: ${dr}, Min: ${mn}, Max: ${mx}`,
    };
}
