/**
 * Sentence Connectivity
 * Unique algorithm for sentence connectivity detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSentenceConnectivity(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Sentence Connectivity", nameKey: "signal.sentenceConnectivity", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.sentenceConnectivity.error", icon: "🔗" };
    }

    const sents=text.split(/[.!?]+/).map(s=>s.trim().toLowerCase()).filter(s=>s.length>5);
    if(sents.length<3)return{name:"Sentence Connectivity",nameKey:"signal.sentenceConnectivity",category:"statistical",score:50,weight:0.2,description:"Too few sentences",descriptionKey:"signal.sentenceConnectivity.error",icon:"🔗"};
    let totalOverlap=0;
    for(let i=1;i<sents.length;i++){const prev=new Set(sents[i-1].split(/\s+/).filter(w=>w.length>3));const curr=sents[i].split(/\s+/).filter(w=>w.length>3);let shared=0;for(const w of curr)if(prev.has(w))shared++;totalOverlap+=curr.length>0?shared/curr.length:0;}
    const avgConnect=totalOverlap/(sents.length-1);
    let score;
    if(avgConnect>0.35)score=68;else if(avgConnect>0.2)score=56;else if(avgConnect<0.05)score=30;else score=44;
    const details=`Avg connectivity: ${avgConnect.toFixed(3)}, Sentences: ${sents.length}.`;
    return {
        name: "Sentence Connectivity", nameKey: "signal.sentenceConnectivity", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Sentence Connectivity pattern suggests AI generation" : "Natural sentence connectivity — consistent with human writing",
        descriptionKey: score > 55 ? "signal.sentenceConnectivity.ai" : "signal.sentenceConnectivity.real", icon: "🔗",
        details,
    };
}
