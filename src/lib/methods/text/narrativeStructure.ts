/**
 * Narrative Structure
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeNarrativeStructure(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Narrative Structure", nameKey: "signal.narrativeStructure", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.narrativeStructure.error", icon: "📖" };
    }
    const lower=text.toLowerCase();const timeWords=['then','after','before','when','while','during','finally','eventually','meanwhile','suddenly','later','soon','next','first','last','once'];let timeCount=0;for(const t of timeWords){const regex=new RegExp('\\b'+t+'\\b','gi');const m=lower.match(regex);if(m)timeCount+=m.length;}const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;const ratio=sents>0?timeCount/sents:0;
    let score: number;
    if(ratio<0.02)score=60;else if(ratio<0.08)score=46;else if(ratio>0.2)score=35;else score=44;
    return {
        name: "Narrative Structure", nameKey: "signal.narrativeStructure", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Weak narrative structure — suggests AI generation" : "Natural narrative flow — consistent with human writing",
        descriptionKey: score > 55 ? "signal.narrativeStructure.ai" : "signal.narrativeStructure.real", icon: "📖",
        details: `Temporal words: ${timeCount}, Ratio: ${ratio.toFixed(3)}`,
    };
}
