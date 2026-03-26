/**
 * Moiré Pattern
 * AI detection method - Moiré Pattern
 */
import type { AnalysisMethod } from "../../types";

export function analyzeMoirePattern(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Moiré Pattern", nameKey: "signal.moirePattern", category: "sensor", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.moirePattern.error", icon: "🔲" };
    }
    const s=Math.min(64,Math.min(w,h)),ox=(w-s)>>1,oy=(h-s)>>1;let ac=0;for(let y=0;y<s-2;y++)for(let x=0;x<s-2;x++){const i=((oy+y)*w+(ox+x))*4,j=i+8,k=i+w*8;const d=Math.abs(p[i]-2*p[i+4]+p[j])+Math.abs(p[i]-2*p[i+w*4]+p[k]);if(d>30)ac++;}const r=ac/(s*s);
    let score: number;
    if(r<0.02)score=70;else if(r<0.06)score=55;else if(r>0.15)score=30;else score=42;
    return {
        name: "Moiré Pattern", nameKey: "signal.moirePattern", category: "sensor", score, weight: 0.3,
        description: score > 55 ? "Lack of moiré pattern suggests synthetic generation" : "Natural moiré interference detected — consistent with real camera",
        descriptionKey: score > 55 ? "signal.moirePattern.ai" : "signal.moirePattern.real", icon: "🔲",
        details: `Moiré density: ${r.toFixed(4)}`,
    };
}
