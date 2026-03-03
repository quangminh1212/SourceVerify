/**
 * Skin Color Drift
 * AI video detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSkinColorDrift(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Skin Color Drift", nameKey: "signal.skinColorDrift", category: "sensor", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.skinColorDrift.error", icon: "🎨" };
    }
    const fX=Math.floor(w*0.3),fY=Math.floor(h*0.2),fW=Math.floor(w*0.4),fH=Math.floor(h*0.3);const rows=[];const step=4;for(let y=fY;y<fY+fH&&y<h;y+=step){let sum=0,cnt=0;for(let x=fX;x<fX+fW&&x<w;x+=step){const i=(y*w+x)*4;sum+=(p[i]+p[i+1]+p[i+2])/3;cnt++;}rows.push(cnt>0?sum/cnt:128);}let drift=0;for(let i=1;i<rows.length;i++)drift+=Math.abs(rows[i]-rows[i-1]);const avgD=rows.length>1?drift/(rows.length-1):0;
    let score: number;
    if(avgD<0.5)score=66;else if(avgD<2)score=50;else if(avgD>5)score=30;else score=44;
    return {
        name: "Skin Color Drift", nameKey: "signal.skinColorDrift", category: "sensor", score, weight: 0.3,
        description: score > 55 ? "Skin Color Drift pattern suggests deepfake" : "Natural skin color drift — consistent with real video",
        descriptionKey: score > 55 ? "signal.skinColorDrift.ai" : "signal.skinColorDrift.real", icon: "🎨",
        details: `Skin drift: ${avgD.toFixed(3)}`,
    };
}
