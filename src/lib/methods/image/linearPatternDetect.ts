/**
 * Linear Pattern
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeLinearPatternDetect(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Linear Pattern", nameKey: "signal.linearPattern", category: "pixel", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.linearPattern.error", icon: "📏" };
    }
    let hStreak=0,vStreak=0,cnt=0;const step=2;for(let y=0;y<h;y+=step){let run=0;for(let x=1;x<w;x++){const i=(y*w+x)*4;if(Math.abs(p[i]-p[i-4])<3)run++;else{if(run>w*0.3)hStreak++;run=0;}cnt++;}if(run>w*0.3)hStreak++;}for(let x=0;x<w;x+=step){let run=0;for(let y=1;y<h;y++){const i=(y*w+x)*4,j=((y-1)*w+x)*4;if(Math.abs(p[i]-p[j])<3)run++;else{if(run>h*0.3)vStreak++;run=0;}}if(run>h*0.3)vStreak++;}const totalS=hStreak+vStreak;
    let score: number;
    if(totalS>20)score=70;else if(totalS>5)score=55;else if(totalS<2)score=32;else score=44;
    return {
        name: "Linear Pattern", nameKey: "signal.linearPattern", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Linear Pattern pattern suggests AI generation" : "Natural linear pattern — consistent with real image",
        descriptionKey: score > 55 ? "signal.linearPattern.ai" : "signal.linearPattern.real", icon: "📏",
        details: `H-streaks: ${hStreak}, V-streaks: ${vStreak}`,
    };
}
