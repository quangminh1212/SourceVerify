/**
 * Sentence Entropy
 * Based on NLP research papers
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSentenceEntropy(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Sentence Entropy", nameKey: "signal.sentenceEntropy", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.sentenceEntropy.error", icon: "🎲" };
    }
    const sents=text.split(/[.!?]+/).filter(s=>s.trim().length>0);const lens=sents.map(s=>s.trim().split(/\s+/).length);const bins=new Map();for(const l of lens)bins.set(l,(bins.get(l)||0)+1);let entropy=0;const n=lens.length;for(const c of bins.values()){const pr=c/n;entropy-=pr*Math.log2(pr);}
    let score: number;
    if(entropy<2)score=68;else if(entropy<3.5)score=50;else if(entropy>5)score=28;else score=44;
    return {
        name: "Sentence Entropy", nameKey: "signal.sentenceEntropy", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Sentence Entropy — suggests AI generation" : "Natural sentence entropy — consistent with human writing",
        descriptionKey: score > 55 ? "signal.sentenceEntropy.ai" : "signal.sentenceEntropy.real", icon: "🎲",
        details: `Sent entropy: ${entropy.toFixed(3)}`,
    };
}
