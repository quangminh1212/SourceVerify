/**
 * Aperture Diffraction
 * AI detection method - Aperture Diffraction
 */
import type { AnalysisMethod } from "../../types";

export function analyzeApertureDiffraction(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Aperture Diffraction", nameKey: "signal.apertureDiffraction", category: "sensor", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.apertureDiffraction.error", icon: "💎" };
    }
    let starCount=0,cnt=0;const step=3;for(let y=2;y<h-2;y+=step)for(let x=2;x<w-2;x+=step){const i=(y*w+x)*4;if(p[i]>240&&p[i+1]>240&&p[i+2]>240){const around=[p[(y*w+x-2)*4],p[(y*w+x+2)*4],p[((y-2)*w+x)*4],p[((y+2)*w+x)*4]];const avgA=around.reduce((a,b)=>a+b,0)/4;if(p[i]-avgA>50)starCount++;}cnt++;}const starR=cnt>0?starCount/cnt:0;
    let score: number;
    if(starR<0.0001)score=60;else if(starR<0.001)score=40;else if(starR>0.01)score=35;else score=48;
    return {
        name: "Aperture Diffraction", nameKey: "signal.apertureDiffraction", category: "sensor", score, weight: 0.2,
        description: score > 55 ? "No diffraction artifacts — suggests synthetic generation" : "Diffraction patterns detected — consistent with real optics",
        descriptionKey: score > 55 ? "signal.apertureDiffraction.ai" : "signal.apertureDiffraction.real", icon: "💎",
        details: `Diffraction points: ${starCount}, Ratio: ${starR.toFixed(6)}`,
    };
}
