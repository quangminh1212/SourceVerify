/**
 * Gabor Energy Dist
 * Based on scientific research papers (2010)
 */
import type { AnalysisMethod } from "../../types";

export function analyzeGaborEnergy(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Gabor Energy Dist", nameKey: "signal.gaborEnergy", category: "frequency", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.gaborEnergy.error", icon: "🌈" };
    }
    const freqs=[0.1,0.2,0.3];const energies=[];const sz=Math.min(32,Math.min(w,h));for(const f of freqs){let e=0;for(let y=0;y<sz;y++)for(let x=0;x<sz;x++){const val=Math.cos(2*Math.PI*f*x)*Math.exp(-(x*x+y*y)/50);const i=(y*w+x)*4;e+=p[i]*val;}energies.push(Math.abs(e));}const total=energies.reduce((a,b)=>a+b,0)||1;const ratios=energies.map(e2=>e2/total);const dev=Math.sqrt(ratios.reduce((a,r)=>a+(r-1/3)**2,0)/3);
    let score: number;
    if(dev<0.05)score=66;else if(dev<0.15)score=50;else if(dev>0.3)score=28;else score=44;
    return {
        name: "Gabor Energy Dist", nameKey: "signal.gaborEnergy", category: "frequency", score, weight: 0.3,
        description: score > 55 ? "Gabor Energy Dist — suggests AI generation" : "Natural gabor energy dist — consistent with real image",
        descriptionKey: score > 55 ? "signal.gaborEnergy.ai" : "signal.gaborEnergy.real", icon: "🌈",
        details: `Gabor dev: ${dev.toFixed(4)}`,
    };
}
