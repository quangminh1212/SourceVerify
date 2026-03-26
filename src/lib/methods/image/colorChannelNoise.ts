/**
 * Color Channel Noise
 * AI detection method - Color Channel Noise
 */
import type { AnalysisMethod } from "../../types";

export function analyzeColorChannelNoise(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Color Channel Noise", nameKey: "signal.colorChannelNoise", category: "sensor", score: 50, weight: 0.3, description: "Image too small", descriptionKey: "signal.colorChannelNoise.error", icon: "🎨" };
    }
    let rN=0,gN=0,bN=0,cnt=0;const step=3;for(let y=0;y<h-1;y+=step)for(let x=0;x<w-1;x+=step){const i=(y*w+x)*4,j=i+4;rN+=Math.abs(p[i]-p[j]);gN+=Math.abs(p[i+1]-p[j+1]);bN+=Math.abs(p[i+2]-p[j+2]);cnt++;}rN/=cnt;gN/=cnt;bN/=cnt;const avg=(rN+gN+bN)/3;const dev=Math.sqrt(((rN-avg)**2+(gN-avg)**2+(bN-avg)**2)/3);const ratio=avg>0?dev/avg:0;
    let score: number;
    if(ratio<0.05)score=68;else if(ratio<0.1)score=55;else if(ratio>0.25)score=30;else score=44;
    return {
        name: "Color Channel Noise", nameKey: "signal.colorChannelNoise", category: "sensor", score, weight: 0.3,
        description: score > 55 ? "Uniform cross-channel noise suggests AI generation" : "Natural channel noise variation — consistent with real sensor",
        descriptionKey: score > 55 ? "signal.colorChannelNoise.ai" : "signal.colorChannelNoise.real", icon: "🎨",
        details: `R:${rN.toFixed(2)} G:${gN.toFixed(2)} B:${bN.toFixed(2)}, Dev ratio: ${ratio.toFixed(3)}`,
    };
}
