/**
 * Topic Shift Analysis
 * Unique algorithm for topic shift analysis detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeTopicShiftAnalysis(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Topic Shift Analysis", nameKey: "signal.topicShiftAnalysis", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.topicShiftAnalysis.error", icon: "🔄" };
    }

    const sents=text.split(/[.!?]+/).map(s=>s.trim().toLowerCase()).filter(s=>s.length>5);
    if(sents.length<4)return{name:"Topic Shift Analysis",nameKey:"signal.topicShiftAnalysis",category:"statistical",score:50,weight:0.2,description:"Too few sentences",descriptionKey:"signal.topicShiftAnalysis.error",icon:"🔄"};
    const sentWords=sents.map(s=>new Set(s.split(/\s+/).filter(w=>w.length>3)));
    let shiftCount=0;
    for(let i=1;i<sentWords.length;i++){let common=0;for(const w of sentWords[i])if(sentWords[i-1].has(w))common++;const overlap=sentWords[i].size>0?common/sentWords[i].size:0;if(overlap<0.1)shiftCount++;}
    const shiftRatio=shiftCount/(sentWords.length-1);
    let score;
    if(shiftRatio<0.1)score=68;else if(shiftRatio<0.25)score=56;else if(shiftRatio>0.6)score=30;else score=44;
    const details=`Shift ratio: ${shiftRatio.toFixed(3)}, Shifts: ${shiftCount}.`;
    return {
        name: "Topic Shift Analysis", nameKey: "signal.topicShiftAnalysis", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Topic Shift Analysis pattern suggests AI generation" : "Natural topic shift analysis — consistent with human writing",
        descriptionKey: score > 55 ? "signal.topicShiftAnalysis.ai" : "signal.topicShiftAnalysis.real", icon: "🔄",
        details,
    };
}
