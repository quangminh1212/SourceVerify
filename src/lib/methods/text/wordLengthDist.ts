/**
 * Word Length Distribution
 * Unique algorithm for word length distribution detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeWordLengthDist(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Word Length Distribution", nameKey: "signal.wordLengthDist", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.wordLengthDist.error", icon: "📏" };
    }

    const ws=text.split(/\s+/).filter(w=>w.length>0);
    const lens=ws.map(w=>w.replace(/[^a-zA-Z]/g,'').length).filter(l=>l>0);
    if(lens.length<10)return{name:"Word Length Distribution",nameKey:"signal.wordLengthDist",category:"statistical",score:50,weight:0.2,description:"Too few words",descriptionKey:"signal.wordLengthDist.error",icon:"📏"};
    const bins=new Array(15).fill(0);for(const l of lens)bins[Math.min(l,14)]++;
    const total=lens.length;const probs=bins.map(b=>b/total);
    let entropy=0;for(const p of probs)if(p>0)entropy-=p*Math.log2(p);
    let score;
    if(entropy<2.5)score=68;else if(entropy<3.0)score=56;else if(entropy>3.5)score=32;else score=44;
    const details=`Length entropy: ${entropy.toFixed(3)}, Mean len: ${(lens.reduce((a,b)=>a+b,0)/lens.length).toFixed(2)}.`;
    return {
        name: "Word Length Distribution", nameKey: "signal.wordLengthDist", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Word Length Distribution pattern suggests AI generation" : "Natural word length distribution — consistent with human writing",
        descriptionKey: score > 55 ? "signal.wordLengthDist.ai" : "signal.wordLengthDist.real", icon: "📏",
        details,
    };
}
