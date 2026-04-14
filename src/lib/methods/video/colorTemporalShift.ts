/**
 * Color Temporal Shift
 * Algorithm: colorChannel
 */
import type { AnalysisMethod } from "../../types";

export function analyzeColorTemporalShift(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Color Temporal Shift", nameKey: "signal.colorTemporalShift", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.colorTemporalShift.error", icon: "🎨" };
    }
const rH=new Array(256).fill(0),gH=new Array(256).fill(0),bH=new Array(256).fill(0);
for(let i=0;i<pixels.length;i+=4){rH[pixels[i]]++;gH[pixels[i+1]]++;bH[pixels[i+2]]++;}
const n=pixels.length/4;let rM=0,gM=0,bM=0;for(let i=0;i<256;i++){rM+=i*rH[i]/n;gM+=i*gH[i]/n;bM+=i*bH[i]/n;}
const rgDiff=Math.abs(rM-gM),rbDiff=Math.abs(rM-bM),gbDiff=Math.abs(gM-bM);
const channelBalance=(rgDiff+rbDiff+gbDiff)/3;
let score;if(channelBalance<8)score=70;else if(channelBalance<20)score=58;else if(channelBalance>60)score=30;else score=44;
const details=`Channel balance: ${channelBalance.toFixed(2)}, R:${rM.toFixed(1)} G:${gM.toFixed(1)} B:${bM.toFixed(1)}.`;
    return {
        name: "Color Temporal Shift", nameKey: "signal.colorTemporalShift", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Color Temporal Shift — potential AI artifact" : "Natural color temporal shift — authentic",
        descriptionKey: score > 55 ? "signal.colorTemporalShift.ai" : "signal.colorTemporalShift.real", icon: "🎨",
        details,
    };
}
