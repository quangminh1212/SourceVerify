/**
 * Hot Pixel Detection
 * AI detection method - Hot Pixel Detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeHotPixelDetection(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Hot Pixel Detection", nameKey: "signal.hotPixelDetection", category: "sensor", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.hotPixelDetection.error", icon: "⚡" };
    }
    let hotCount=0,deadCount=0,cnt=0;const step=2;for(let y=1;y<h-1;y+=step)for(let x=1;x<w-1;x+=step){const i=(y*w+x)*4;const c=p[i]+p[i+1]+p[i+2];const nb=[p[(y*w+x-1)*4],p[(y*w+x+1)*4],p[((y-1)*w+x)*4],p[((y+1)*w+x)*4]];const avg=nb.reduce((a,b)=>a+b,0)/4;if(c>740&&avg<500)hotCount++;if(c<15&&avg>100)deadCount++;cnt++;}const hR=cnt>0?(hotCount+deadCount)/cnt:0;
    let score: number;
    if(hR<0.00001)score=62;else if(hR<0.0005)score=38;else if(hR>0.005)score=45;else score=42;
    return {
        name: "Hot Pixel Detection", nameKey: "signal.hotPixelDetection", category: "sensor", score, weight: 0.2,
        description: score > 55 ? "No hot/dead pixels — suggests synthetic generation" : "Sensor artifacts detected — consistent with real hardware",
        descriptionKey: score > 55 ? "signal.hotPixelDetection.ai" : "signal.hotPixelDetection.real", icon: "⚡",
        details: `Hot: ${hotCount}, Dead: ${deadCount}, Ratio: ${hR.toFixed(6)}`,
    };
}
