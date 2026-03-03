/**
 * Phoneme Correlation
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzePhonemeCorrelation(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Phoneme Correlation", nameKey: "signal.phonemeCorrelation", category: "sensor", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.phonemeCorrelation.error", icon: "🗣️" };
    }
    const mX=Math.floor(w*0.3),mY=Math.floor(h*0.6),mW=Math.floor(w*0.4),mH=Math.floor(h*0.15);let openness=0,cnt=0;for(let y=mY;y<mY+mH&&y<h;y+=2)for(let x=mX;x<mX+mW&&x<w;x+=2){const i=(y*w+x)*4;const dark=(p[i]<60&&p[i+1]<60&&p[i+2]<60)?1:0;openness+=dark;cnt++;}const openR=cnt>0?openness/cnt:0;let lipEdge=0,lc=0;for(let x=mX;x<mX+mW&&x<w-1;x+=2){const y2=mY+Math.floor(mH/2);const i=(y2*w+x)*4;lipEdge+=Math.abs(p[i]-p[i+4]);lc++;}const avgLip=lc>0?lipEdge/lc:0;
    let score: number;
    if(openR<0.01&&avgLip<3)score=65;else if(avgLip>10)score=35;else score=48;
    return {
        name: "Phoneme Correlation", nameKey: "signal.phonemeCorrelation", category: "sensor", score, weight: 0.3,
        description: score > 55 ? "Lip-phoneme mismatch — suggests synthetic speech" : "Natural lip-phoneme correlation — consistent with real speech",
        descriptionKey: score > 55 ? "signal.phonemeCorrelation.ai" : "signal.phonemeCorrelation.real", icon: "🗣️",
        details: `Mouth open: ${openR.toFixed(3)}, Lip edge: ${avgLip.toFixed(2)}`,
    };
}
