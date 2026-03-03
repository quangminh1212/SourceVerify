/**
 * Vocabulary Richness
 * Based on NLP research papers
 */
import type { AnalysisMethod } from "../../types";

export function analyzeVocabularyRichness(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Vocabulary Richness", nameKey: "signal.vocabRichness", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.vocabRichness.error", icon: "📚" };
    }
    const words=text.split(/\s+/).filter(w=>w.length>2).map(w=>w.toLowerCase().replace(/[^a-z]/g,''));const unique=new Set(words);const ttr=words.length>0?unique.size/words.length:0;const rootTTR=words.length>0?unique.size/Math.sqrt(words.length):0;
    let score: number;
    if(rootTTR>8)score=64;else if(rootTTR>6)score=48;else if(rootTTR<4)score=32;else score=44;
    return {
        name: "Vocabulary Richness", nameKey: "signal.vocabRichness", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Vocabulary Richness — suggests AI generation" : "Natural vocabulary richness — consistent with human writing",
        descriptionKey: score > 55 ? "signal.vocabRichness.ai" : "signal.vocabRichness.real", icon: "📚",
        details: `Root TTR: ${rootTTR.toFixed(2)}, TTR: ${ttr.toFixed(3)}`,
    };
}
