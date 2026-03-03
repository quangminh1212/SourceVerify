/**
 * Sentence Fragment
 * AI text detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSentenceFragmentUsage(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Sentence Fragment", nameKey: "signal.sentenceFragment", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.sentenceFragment.error", icon: "📎" };
    }
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0);let fragments=0;for(const s of sents){const words=s.trim().split(/\s+/);if(words.length<=3&&words.length>0)fragments++;}const fragR=sents.length>0?fragments/sents.length:0;
    let score: number;
    if(fragR<0.02)score=64;else if(fragR<0.1)score=48;else if(fragR>0.3)score=35;else score=44;
    return {
        name: "Sentence Fragment", nameKey: "signal.sentenceFragment", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "No sentence fragments — suggests polished AI generation" : "Natural sentence fragments — consistent with human writing",
        descriptionKey: score > 55 ? "signal.sentenceFragment.ai" : "signal.sentenceFragment.real", icon: "📎",
        details: `Fragments: ${fragments}, Ratio: ${fragR.toFixed(4)}`,
    };
}
