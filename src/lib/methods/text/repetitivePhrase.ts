/**
 * Repetitive Phrase
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeRepetitivePhrase(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Repetitive Phrase", nameKey: "signal.repetitivePhrase", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.repetitivePhrase.error", icon: "🔁" };
    }
    const words=text.toLowerCase().split(/\s+/);const trigrams=new Map();for(let i=0;i<words.length-2;i++){const tri=words.slice(i,i+3).join(' ');trigrams.set(tri,(trigrams.get(tri)||0)+1);}let repeated=0;for(const v of trigrams.values())if(v>=3)repeated++;const ratio=trigrams.size>0?repeated/trigrams.size:0;
    let score: number;
    if(ratio>0.05)score=68;else if(ratio>0.02)score=52;else if(ratio<0.005)score=32;else score=44;
    return {
        name: "Repetitive Phrase", nameKey: "signal.repetitivePhrase", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Repetitive Phrase pattern suggests AI generation" : "Natural repetitive phrase — consistent with human writing",
        descriptionKey: score > 55 ? "signal.repetitivePhrase.ai" : "signal.repetitivePhrase.real", icon: "🔁",
        details: `Repeated trigrams: ${repeated}, Ratio: ${ratio.toFixed(4)}`,
    };
}
