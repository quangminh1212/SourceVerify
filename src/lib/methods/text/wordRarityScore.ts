/**
 * Word Rarity Score
 * Based on NLP research papers
 */
import type { AnalysisMethod } from "../../types";

export function analyzeWordRarityScore(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Word Rarity Score", nameKey: "signal.wordRarity", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.wordRarity.error", icon: "💎" };
    }
    const rare=new Set(['albeit','hitherto','inasmuch','notwithstanding','heretofore','forthwith','wherewithal','thereupon','whereupon','insofar','theretofore','aforementioned','hereinafter','thenceforth','wheresoever']);const words=text.split(/\s+/).filter(w=>w.length>0);let rareCount=0;for(const w of words)if(rare.has(w.toLowerCase()))rareCount++;const ratio=words.length>0?rareCount/words.length:0;
    let score: number;
    if(ratio>0.005)score=64;else if(ratio>0.001)score=48;else if(ratio===0)score=38;else score=44;
    return {
        name: "Word Rarity Score", nameKey: "signal.wordRarity", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Word Rarity Score — suggests AI generation" : "Natural word rarity score — consistent with human writing",
        descriptionKey: score > 55 ? "signal.wordRarity.ai" : "signal.wordRarity.real", icon: "💎",
        details: `Rare words: ${rareCount}, Ratio: ${ratio.toFixed(5)}`,
    };
}
