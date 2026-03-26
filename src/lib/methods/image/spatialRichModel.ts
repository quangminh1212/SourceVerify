/**
 * Spatial Rich Model
 * Based on scientific research papers (2012)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSpatialRichModel(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Spatial Rich Model", nameKey: "signal.spatialRichModel", category: "statistical", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.spatialRichModel.error", icon: "🧬" };
    }
    const residuals=new Float64Array(5);const step=3;let cnt=0;for(let y=2;y<h-2;y+=step)for(let x=2;x<w-2;x+=step){const i=(y*w+x)*4;const r1=Math.abs(p[i]-p[i+4]);const r2=Math.abs(p[i]-2*p[i+4]+p[i+8]);const r3=Math.abs(p[i]-p[i+w*4]);const r4=Math.abs(p[i+4]-p[i+w*4]);const r5=Math.abs(p[i]-p[i+4]-p[i+w*4]+p[(y+1)*w*4+(x+1)*4]);residuals[0]+=r1;residuals[1]+=r2;residuals[2]+=r3;residuals[3]+=r4;residuals[4]+=r5;cnt++;}for(let i=0;i<5;i++)residuals[i]/=cnt||1;const avg=(residuals[0]+residuals[1]+residuals[2]+residuals[3]+residuals[4])/5;const dev=Math.sqrt(residuals.reduce((a,v)=>a+(v-avg)**2,0)/5);const cv=avg>0?dev/avg:0;
    let score: number;
    if(cv<0.15)score=68;else if(cv<0.3)score=52;else if(cv>0.6)score=28;else score=44;
    return {
        name: "Spatial Rich Model", nameKey: "signal.spatialRichModel", category: "statistical", score, weight: 0.3,
        description: score > 55 ? "Spatial Rich Model — suggests AI generation" : "Natural spatial rich model — consistent with real image",
        descriptionKey: score > 55 ? "signal.spatialRichModel.ai" : "signal.spatialRichModel.real", icon: "🧬",
        details: `SRM CV: ${cv.toFixed(4)}`,
    };
}
