/**
 * Laws Texture Energy
 * Based on scientific research papers (1980)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeLawsTextureE(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Laws Texture Energy", nameKey: "signal.lawsTextureE", category: "pixel", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.lawsTextureE.error", icon: "🏗️" };
    }
    const L5=[1,4,6,4,1],E5=[-1,-2,0,2,1];let leSum=0,cnt=0;const step=3;for(let y=2;y<h-2;y+=step)for(let x=2;x<w-2;x+=step){let le=0;for(let k=-2;k<=2;k++){const i=(y*w+(x+k))*4;le+=p[i]*E5[k+2];}leSum+=Math.abs(le);cnt++;}const avg=cnt>0?leSum/cnt:0;
    let score: number;
    if(avg<10)score=68;else if(avg<30)score=50;else if(avg>80)score=28;else score=44;
    return {
        name: "Laws Texture Energy", nameKey: "signal.lawsTextureE", category: "pixel", score, weight: 0.3,
        description: score > 55 ? "Laws Texture Energy — suggests AI generation" : "Natural laws texture energy — consistent with real image",
        descriptionKey: score > 55 ? "signal.lawsTextureE.ai" : "signal.lawsTextureE.real", icon: "🏗️",
        details: `Laws LE energy: ${avg.toFixed(2)}`,
    };
}
