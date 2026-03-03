/**
 * Accessory Consistency
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeAccessoryConsistency(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Accessory Consistency", nameKey: "signal.accessoryConsistency", category: "pixel", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.accessoryConsistency.error", icon: "👓" };
    }
    const step=3;let specular=0,cnt=0;for(let y=Math.floor(h*0.15);y<Math.floor(h*0.45)&&y<h;y+=step)for(let x=Math.floor(w*0.2);x<Math.floor(w*0.8)&&x<w;x+=step){const i=(y*w+x)*4;if(p[i]>245&&p[i+1]>245&&p[i+2]>245)specular++;cnt++;}const specR=cnt>0?specular/cnt:0;let edgeVar=0,ec=0;for(let y=Math.floor(h*0.15);y<Math.floor(h*0.35)&&y<h-1;y+=step)for(let x=Math.floor(w*0.15);x<Math.floor(w*0.85)&&x<w-1;x+=step){const i=(y*w+x)*4;const g=Math.abs(p[i]-p[i+4]);edgeVar+=g;ec++;}const avgEdge=ec>0?edgeVar/ec:0;
    let score: number;
    if(specR<0.001&&avgEdge<5)score=62;else if(specR>0.005)score=38;else score=48;
    return {
        name: "Accessory Consistency", nameKey: "signal.accessoryConsistency", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Inconsistent accessory rendering — suggests deepfake" : "Natural accessory detail — consistent with real video",
        descriptionKey: score > 55 ? "signal.accessoryConsistency.ai" : "signal.accessoryConsistency.real", icon: "👓",
        details: `Specular: ${specR.toFixed(4)}, Edge avg: ${avgEdge.toFixed(2)}`,
    };
}
