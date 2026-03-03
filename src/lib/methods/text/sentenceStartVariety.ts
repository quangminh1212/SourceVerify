/**
 * Sentence Start Variety
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSentenceStartVariety(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Sentence Start Variety", nameKey: "signal.sentStartVariety", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.sentStartVariety.error", icon: "🔤" };
    }
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0);const starts=new Map();for(const s of sents){const w=s.trim().split(/\s+/)[0]?.toLowerCase();if(w)starts.set(w,(starts.get(w)||0)+1);}let repeated=0;for(const v of starts.values())if(v>=3)repeated++;const ratio=sents.length>0?repeated/starts.size:0;
    let score: number;
    if(ratio>0.3)score=68;else if(ratio>0.1)score=52;else if(ratio<0.02)score=32;else score=44;
    return {
        name: "Sentence Start Variety", nameKey: "signal.sentStartVariety", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Sentence Start Variety pattern suggests AI generation" : "Natural sentence start variety — consistent with human writing",
        descriptionKey: score > 55 ? "signal.sentStartVariety.ai" : "signal.sentStartVariety.real", icon: "🔤",
        details: `Repeated starts: ${repeated}, Unique: ${starts.size}`,
    };
}
