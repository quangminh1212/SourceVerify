/**
 * Genre Conformity
 * Unique algorithm for genre conformity detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeGenreConformity(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Genre Conformity", nameKey: "signal.genreConformity", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.genreConformity.error", icon: "📚" };
    }

    const ws=text.toLowerCase().split(/[\s,.;:!?]+/).filter(w=>w.length>0);
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0);
    const avgSentLen=sents.length>0?ws.length/sents.length:0;
    const avgWordLen=ws.length>0?ws.reduce((a,w)=>a+w.length,0)/ws.length:0;
    const paraCount=text.split(/\n\s*\n/).filter(p=>p.trim().length>0).length;
    const uniformity=Math.abs(avgSentLen-18)/18+Math.abs(avgWordLen-5)/5;
    let score;
    if(uniformity<0.3)score=70;else if(uniformity<0.5)score=58;else if(uniformity>1.2)score=30;else score=44;
    const details=`Uniformity: ${uniformity.toFixed(3)}, AvgSent: ${avgSentLen.toFixed(1)}, AvgWord: ${avgWordLen.toFixed(2)}.`;
    return {
        name: "Genre Conformity", nameKey: "signal.genreConformity", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Genre Conformity pattern suggests AI generation" : "Natural genre conformity — consistent with human writing",
        descriptionKey: score > 55 ? "signal.genreConformity.ai" : "signal.genreConformity.real", icon: "📚",
        details,
    };
}
