/**
 * Sentence Opener Diversity
 * Unique algorithm for sentence opener diversity detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSentenceOpener(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Sentence Opener Diversity", nameKey: "signal.sentenceOpener", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.sentenceOpener.error", icon: "🔤" };
    }

    const sents=text.split(/[.!?]+/).map(s=>s.trim()).filter(s=>s.length>3);
    if(sents.length<5)return{name:"Sentence Opener Diversity",nameKey:"signal.sentenceOpener",category:"statistical",score:50,weight:0.2,description:"Too few sentences",descriptionKey:"signal.sentenceOpener.error",icon:"🔤"};
    const openers=sents.map(s=>{const ws=s.split(/\s+/);return ws.slice(0,Math.min(2,ws.length)).join(' ').toLowerCase();});
    const unique=new Set(openers).size;
    const diversity=unique/openers.length;
    let score;
    if(diversity<0.3)score=72;else if(diversity<0.5)score=60;else if(diversity>0.85)score=28;else score=44;
    const details=`Opener diversity: ${diversity.toFixed(3)}, Unique: ${unique}/${openers.length}.`;
    return {
        name: "Sentence Opener Diversity", nameKey: "signal.sentenceOpener", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Sentence Opener Diversity pattern suggests AI generation" : "Natural sentence opener diversity — consistent with human writing",
        descriptionKey: score > 55 ? "signal.sentenceOpener.ai" : "signal.sentenceOpener.real", icon: "🔤",
        details,
    };
}
