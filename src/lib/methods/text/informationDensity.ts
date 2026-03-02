/**
 * Information Density
 * Unique algorithm for information density detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeInformationDensity(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Information Density", nameKey: "signal.informationDensity", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.informationDensity.error", icon: "📊" };
    }

    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0);
    const ws=text.split(/\s+/).filter(w=>w.length>0);
    const uniqueWords=new Set(ws.map(w=>w.toLowerCase())).size;
    const density=ws.length>0?uniqueWords/ws.length:0;
    const wordsPerSent=sents.length>0?ws.length/sents.length:0;
    const infoDensity=density*wordsPerSent;
    let score;
    if(infoDensity<5)score=66;else if(infoDensity<8)score=54;else if(infoDensity>15)score=30;else score=44;
    const details=`Info density: ${infoDensity.toFixed(2)}, Lexical diversity: ${density.toFixed(3)}.`;
    return {
        name: "Information Density", nameKey: "signal.informationDensity", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Information Density pattern suggests AI generation" : "Natural information density — consistent with human writing",
        descriptionKey: score > 55 ? "signal.informationDensity.ai" : "signal.informationDensity.real", icon: "📊",
        details,
    };
}
