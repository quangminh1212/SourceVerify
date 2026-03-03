/**
 * Anti-aliasing Consistency
 * AI detection method - Anti-aliasing Consistency
 */
import type { AnalysisMethod } from "../../types";

export function analyzeAntiAliasingConsistency(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Anti-aliasing Consistency", nameKey: "signal.antiAliasingConsistency", category: "pixel", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.antiAliasingConsistency.error", icon: "〰️" };
    }
    let sharpE=0,smoothE=0,cnt=0;const step=2;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const gx=Math.abs(p[i-4]-p[i+4]),gy=Math.abs(p[i-w*4]-p[i+w*4]),g=gx+gy;if(g>40){const nx=(p[i-4]+p[i+4])/2,diff=Math.abs(p[i]-nx);if(diff>20)sharpE++;else smoothE++;cnt++;}}const ratio=cnt>0?sharpE/(sharpE+smoothE):0.5;
    let score: number;
    if(ratio>0.8||ratio<0.1)score=65;else if(ratio>0.3&&ratio<0.6)score=35;else score=48;
    return {
        name: "Anti-aliasing Consistency", nameKey: "signal.antiAliasingConsistency", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Inconsistent anti-aliasing pattern suggests AI generation" : "Consistent anti-aliasing — typical of real image processing",
        descriptionKey: score > 55 ? "signal.antiAliasingConsistency.ai" : "signal.antiAliasingConsistency.real", icon: "〰️",
        details: `Sharp edges: ${sharpE}, Smooth: ${smoothE}, Ratio: ${ratio.toFixed(3)}`,
    };
}
