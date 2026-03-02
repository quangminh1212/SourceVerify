/**
 * Text Coherence Score
 * Unique algorithm for text coherence score detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeTextCoherence(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Text Coherence Score", nameKey: "signal.textCoherence", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.textCoherence.error", icon: "📋" };
    }

    const sents=text.split(/[.!?]+/).map(s=>s.trim()).filter(s=>s.length>5);
    if(sents.length<3)return{name:"Text Coherence Score",nameKey:"signal.textCoherence",category:"statistical",score:50,weight:0.2,description:"Too few sentences",descriptionKey:"signal.textCoherence.error",icon:"📋"};
    const ws=text.split(/\s+/);const uniqueRatio=new Set(ws.map(w=>w.toLowerCase())).size/ws.length;
    const sentLens=sents.map(s=>s.split(/\s+/).length);
    const meanLen=sentLens.reduce((a,b)=>a+b,0)/sentLens.length;
    const lenCV=meanLen>0?Math.sqrt(sentLens.reduce((a,b)=>a+(b-meanLen)**2,0)/sentLens.length)/meanLen:0;
    const coherence=uniqueRatio*(1-lenCV*0.5);
    let score;
    if(coherence>0.7)score=30;else if(coherence>0.55)score=42;else if(coherence<0.3)score=70;else score=55;
    const details=`Coherence: ${coherence.toFixed(3)}, LenCV: ${lenCV.toFixed(3)}, LexDiv: ${uniqueRatio.toFixed(3)}.`;
    return {
        name: "Text Coherence Score", nameKey: "signal.textCoherence", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Text Coherence Score pattern suggests AI generation" : "Natural text coherence score — consistent with human writing",
        descriptionKey: score > 55 ? "signal.textCoherence.ai" : "signal.textCoherence.real", icon: "📋",
        details,
    };
}
