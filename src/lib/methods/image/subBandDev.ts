/**
 * Sub-band Deviation
 * Based on scientific research papers (2020)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSubBandDev(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Sub-band Deviation", nameKey: "signal.subBandDev", category: "frequency", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.subBandDev.error", icon: "📶" };
    }
    const bands=[[0,w/4],[w/4,w/2],[w/2,w*3/4],[w*3/4,w]];const avgs=[];const step=4;for(const[x1,x2]of bands){let s=0,c=0;for(let y=0;y<h;y+=step)for(let x=Math.floor(x1);x<Math.floor(x2)&&x<w;x+=step){const i=(y*w+x)*4;s+=p[i];c++;}avgs.push(c>0?s/c:128);}const mean=avgs.reduce((a,b)=>a+b,0)/4;const dev=Math.sqrt(avgs.reduce((a,b)=>a+(b-mean)**2,0)/4);
    let score: number;
    if(dev<3)score=66;else if(dev<8)score=50;else if(dev>20)score=28;else score=44;
    return {
        name: "Sub-band Deviation", nameKey: "signal.subBandDev", category: "frequency", score, weight: 0.3,
        description: score > 55 ? "Sub-band Deviation — suggests AI generation" : "Natural sub-band deviation — consistent with real image",
        descriptionKey: score > 55 ? "signal.subBandDev.ai" : "signal.subBandDev.real", icon: "📶",
        details: `Sub-band dev: ${dev.toFixed(2)}`,
    };
}
