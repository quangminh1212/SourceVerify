/**
 * Text Formality
 * Unique algorithm for text formality detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeTextFormality(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Text Formality", nameKey: "signal.textFormality", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.textFormality.error", icon: "🎩" };
    }

    const informal=["gonna","wanna","gotta","kinda","sorta","dunno","ain't","y'all","yeah","nah","ok","okay","lol","omg","btw","idk","imo","tbh","ngl","bruh","dude","stuff","things","cool","awesome","totally","super","really","pretty","basically","literally","actually"];
    const ws=text.toLowerCase().split(/[\s,.;:!?]+/).filter(w=>w.length>0);
    let infCount=0;for(const w of ws)if(informal.includes(w))infCount++;
    const ratio=ws.length>0?infCount/ws.length:0;
    const avgWordLen=ws.length>0?ws.reduce((a,w)=>a+w.length,0)/ws.length:0;
    const formality=1-ratio+avgWordLen/20;
    let score;
    if(formality>0.95&&ratio<0.005)score=68;else if(formality>0.9)score=56;else if(formality<0.7)score=30;else score=44;
    const details=`Formality: ${formality.toFixed(3)}, Informal ratio: ${ratio.toFixed(4)}.`;
    return {
        name: "Text Formality", nameKey: "signal.textFormality", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Text Formality pattern suggests AI generation" : "Natural text formality — consistent with human writing",
        descriptionKey: score > 55 ? "signal.textFormality.ai" : "signal.textFormality.real", icon: "🎩",
        details,
    };
}
