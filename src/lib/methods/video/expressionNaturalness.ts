/**
 * Expression Naturalness
 * Algorithm: freqApprox
 */
import type { AnalysisMethod } from "../../types";

export function analyzeExpressionNaturalness(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Expression Naturalness", nameKey: "signal.expressionNaturalness", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.expressionNaturalness.error", icon: "😐" };
    }
const row=new Float64Array(w);let energy=0,total=0;
for(let y=0;y<h;y+=4){for(let x=0;x<w;x++){const i=(y*w+x)*4;row[x]=pixels[i]*0.299+pixels[i+1]*0.587+pixels[i+2]*0.114;}
for(let k=1;k<Math.min(w/2,64);k++){let re=0,im=0;for(let x=0;x<w;x++){const a=2*Math.PI*k*x/w;re+=row[x]*Math.cos(a);im+=row[x]*Math.sin(a);}
energy+=Math.sqrt(re*re+im*im);total++;}}
const avgEnergy=total>0?energy/(total*w):0;
let score;if(avgEnergy<0.3)score=68;else if(avgEnergy<0.6)score=56;else if(avgEnergy>1.2)score=30;else score=44;
const details=`Freq energy: ${avgEnergy.toFixed(4)}.`;
    return {
        name: "Expression Naturalness", nameKey: "signal.expressionNaturalness", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Expression Naturalness — potential AI artifact" : "Natural expression naturalness — authentic",
        descriptionKey: score > 55 ? "signal.expressionNaturalness.ai" : "signal.expressionNaturalness.real", icon: "😐",
        details,
    };
}
