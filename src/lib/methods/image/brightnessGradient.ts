/**
 * Brightness Gradient
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeBrightnessGradient(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Brightness Gradient", nameKey: "signal.brightnessGradient", category: "pixel", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.brightnessGradient.error", icon: "🌓" };
    }
    const rows=[];const step=4;for(let y=0;y<h;y+=step){let sum=0,cnt=0;for(let x=0;x<w;x+=step){const i=(y*w+x)*4;sum+=(p[i]+p[i+1]+p[i+2])/3;cnt++;}rows.push(cnt>0?sum/cnt:128);}let gradSum=0;for(let i=1;i<rows.length;i++)gradSum+=Math.abs(rows[i]-rows[i-1]);const avgGrad=rows.length>1?gradSum/(rows.length-1):0;
    let score: number;
    if(avgGrad<0.5)score=66;else if(avgGrad<2)score=50;else if(avgGrad>5)score=30;else score=44;
    return {
        name: "Brightness Gradient", nameKey: "signal.brightnessGradient", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Brightness Gradient pattern suggests AI generation" : "Natural brightness gradient — consistent with real image",
        descriptionKey: score > 55 ? "signal.brightnessGradient.ai" : "signal.brightnessGradient.real", icon: "🌓",
        details: `Brightness gradient: ${avgGrad.toFixed(3)}`,
    };
}
