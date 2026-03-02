/**
 * Redundancy Detection
 * Unique algorithm for redundancy detection detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeRedundancyDetection(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Redundancy Detection", nameKey: "signal.redundancyDetection", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.redundancyDetection.error", icon: "🔁" };
    }

    const sents=text.split(/[.!?]+/).map(s=>s.trim().toLowerCase()).filter(s=>s.length>5);
    if(sents.length<3)return{name:"Redundancy Detection",nameKey:"signal.redundancyDetection",category:"statistical",score:50,weight:0.2,description:"Too few sentences",descriptionKey:"signal.redundancyDetection.error",icon:"🔁"};
    let overlapSum=0,pairs=0;
    for(let i=0;i<sents.length-1;i++){const w1=new Set(sents[i].split(/\s+/));const w2=new Set(sents[i+1].split(/\s+/));let common=0;for(const w of w1)if(w2.has(w))common++;const union=new Set([...w1,...w2]).size;if(union>0){overlapSum+=common/union;pairs++;}}
    const avgOverlap=pairs>0?overlapSum/pairs:0;
    let score;
    if(avgOverlap>0.6)score=72;else if(avgOverlap>0.4)score=60;else if(avgOverlap<0.1)score=30;else score=44;
    const details=`Avg Jaccard overlap: ${avgOverlap.toFixed(3)}, Pairs: ${pairs}.`;
    return {
        name: "Redundancy Detection", nameKey: "signal.redundancyDetection", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Redundancy Detection pattern suggests AI generation" : "Natural redundancy detection — consistent with human writing",
        descriptionKey: score > 55 ? "signal.redundancyDetection.ai" : "signal.redundancyDetection.real", icon: "🔁",
        details,
    };
}
