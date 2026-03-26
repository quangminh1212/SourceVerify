/**
 * Channel Independence
 * AI detection method - Channel Independence
 */
import type { AnalysisMethod } from "../../types";

export function analyzeChannelIndependence(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Channel Independence", nameKey: "signal.channelIndependence", category: "statistical", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.channelIndependence.error", icon: "🔗" };
    }
    let rg=0,rb=0,gb=0,cnt=0;const step=4;for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4;rg+=Math.abs(p[i]-p[i+1]);rb+=Math.abs(p[i]-p[i+2]);gb+=Math.abs(p[i+1]-p[i+2]);cnt++;}rg/=cnt;rb/=cnt;gb/=cnt;const avgDiff=(rg+rb+gb)/3;const dev=Math.sqrt(((rg-avgDiff)**2+(rb-avgDiff)**2+(gb-avgDiff)**2)/3);
    let score: number;
    if(dev<2)score=66;else if(dev<5)score=52;else if(dev>15)score=30;else score=42;
    return {
        name: "Channel Independence", nameKey: "signal.channelIndependence", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Low channel independence — suggests correlated AI generation" : "Natural channel independence — consistent with real sensor",
        descriptionKey: score > 55 ? "signal.channelIndependence.ai" : "signal.channelIndependence.real", icon: "🔗",
        details: `RG:${rg.toFixed(1)} RB:${rb.toFixed(1)} GB:${gb.toFixed(1)}, Dev:${dev.toFixed(2)}`,
    };
}
