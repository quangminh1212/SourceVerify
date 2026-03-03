/**
 * Entropy Per Word
 * Based on NLP research papers
 */
import type { AnalysisMethod } from "../../types";

export function analyzeEntropyPerWord(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Entropy Per Word", nameKey: "signal.entropyPerWord", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.entropyPerWord.error", icon: "🧮" };
    }
    const words=text.split(/\s+/).filter(w=>w.length>0);const freq=new Map();for(const w of words)freq.set(w.toLowerCase(),(freq.get(w.toLowerCase())||0)+1);let entropy=0;const n=words.length;for(const c of freq.values()){const pr=c/n;entropy-=pr*Math.log2(pr);}const perWord=words.length>0?entropy/Math.log2(words.length||2):0;
    let score: number;
    if(perWord>0.9)score=64;else if(perWord>0.8)score=48;else if(perWord<0.6)score=32;else score=44;
    return {
        name: "Entropy Per Word", nameKey: "signal.entropyPerWord", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Entropy Per Word — suggests AI generation" : "Natural entropy per word — consistent with human writing",
        descriptionKey: score > 55 ? "signal.entropyPerWord.ai" : "signal.entropyPerWord.real", icon: "🧮",
        details: `Entropy/word: ${perWord.toFixed(4)}`,
    };
}
