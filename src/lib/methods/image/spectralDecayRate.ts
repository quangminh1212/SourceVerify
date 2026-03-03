/**
 * Spectral Decay Rate
 * AI detection method - Spectral Decay Rate
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSpectralDecayRate(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Spectral Decay Rate", nameKey: "signal.spectralDecayRate", category: "frequency", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.spectralDecayRate.error", icon: "📊" };
    }
    const sz=Math.min(64,Math.min(w,h)),ox=(w-sz)>>1,oy=(h-sz)>>1;const pw=new Float64Array(sz/2+1);for(let r=0;r<sz;r++){for(let k=0;k<=sz/2;k++){let re=0,im=0;for(let n=0;n<sz;n++){const a=-2*Math.PI*k*n/sz,i=((oy+r)*w+(ox+n))*4;re+=p[i]*Math.cos(a);im+=p[i]*Math.sin(a);}pw[k]+=re*re+im*im;}}for(let k=0;k<=sz/2;k++)pw[k]/=sz;let s1=0,s2=0,n=0;for(let k=2;k<=sz/2;k++){const lk=Math.log(k),lp=Math.log(pw[k]+1);s1+=lk*lp;s2+=lk*lk;n++;s1-=lp;s2-=lk;}const slope=n>0?-s1/s2:0;
    let score: number;
    if(slope<0.5)score=70;else if(slope<1.0)score=55;else if(slope>2.0)score=28;else score=42;
    return {
        name: "Spectral Decay Rate", nameKey: "signal.spectralDecayRate", category: "frequency", score, weight: 0.3,
        description: score > 55 ? "Unusual spectral decay — characteristic of synthetic generation" : "Natural spectral decay rate — consistent with real image",
        descriptionKey: score > 55 ? "signal.spectralDecayRate.ai" : "signal.spectralDecayRate.real", icon: "📊",
        details: `Spectral decay slope: ${slope.toFixed(3)}`,
    };
}
