/**
 * Lexical Chain Repetition
 * Unique algorithm for lexical chain repetition detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeLexicalChainRepetition(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Lexical Chain Repetition", nameKey: "signal.lexicalChainRepetition", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.lexicalChainRepetition.error", icon: "🔗" };
    }

    const ws=text.toLowerCase().replace(/[^\w\s]/g,'').split(/\s+/).filter(w=>w.length>3);
    if(ws.length<20)return{name:"Lexical Chain Repetition",nameKey:"signal.lexicalChainRepetition",category:"statistical",score:50,weight:0.2,description:"Too few words",descriptionKey:"signal.lexicalChainRepetition.error",icon:"🔗"};
    const freq=new Map();for(const w of ws)freq.set(w,(freq.get(w)||0)+1);
    const sorted=[...freq.entries()].sort((a,b)=>b[1]-a[1]);
    const top10=sorted.slice(0,10);
    const top10Count=top10.reduce((a,b)=>a+b[1],0);
    const concentration=ws.length>0?top10Count/ws.length:0;
    let score;
    if(concentration>0.4)score=70;else if(concentration>0.25)score=58;else if(concentration<0.1)score=30;else score=44;
    const details=`Top-10 concentration: ${concentration.toFixed(3)}, Total words: ${ws.length}.`;
    return {
        name: "Lexical Chain Repetition", nameKey: "signal.lexicalChainRepetition", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Lexical Chain Repetition pattern suggests AI generation" : "Natural lexical chain repetition — consistent with human writing",
        descriptionKey: score > 55 ? "signal.lexicalChainRepetition.ai" : "signal.lexicalChainRepetition.real", icon: "🔗",
        details,
    };
}
