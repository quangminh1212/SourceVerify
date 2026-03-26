/**
 * Kirsch Edge Response
 * Based on scientific research papers (2008)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeKirschEdge(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Kirsch Edge Response", nameKey: "signal.kirschEdge", category: "pixel", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.kirschEdge.error", icon: "🔳" };
    }
    let maxSum=0,cnt=0;const step=3;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const n=[p[i-w*4-4],p[i-w*4],p[i-w*4+4],p[i-4],p[i+4],p[i+w*4-4],p[i+w*4],p[i+w*4+4]];const k1=5*(n[0]+n[1]+n[2])-3*(n[3]+n[4]+n[5]+n[6]+n[7]);maxSum+=Math.abs(k1);cnt++;}const avg=cnt>0?maxSum/cnt:0;
    let score: number;
    if(avg<50)score=66;else if(avg<150)score=50;else if(avg>400)score=28;else score=44;
    return {
        name: "Kirsch Edge Response", nameKey: "signal.kirschEdge", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Kirsch Edge Response — suggests AI generation" : "Natural kirsch edge response — consistent with real image",
        descriptionKey: score > 55 ? "signal.kirschEdge.ai" : "signal.kirschEdge.real", icon: "🔳",
        details: `Kirsch avg: ${avg.toFixed(1)}`,
    };
}
