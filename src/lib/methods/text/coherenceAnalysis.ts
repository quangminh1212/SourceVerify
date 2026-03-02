/**
 * Text Coherence Analysis
 * AI text may have unnaturally smooth logical flow and consistent cosine similarity
 * between adjacent sentence representations. Human text has more varied coherence
 * because of topic shifts, asides, and natural thinking patterns.
 *
 * We use a bag-of-words cosine similarity between adjacent sentences as a proxy
 * for semantic coherence measurement.
 *
 * Reference: Zellers et al. (2019) - Defending Against Neural Fake News, NeurIPS
 * Reference: Barzilay & Lapata (2008) - Modeling Local Coherence, Computational Linguistics
 */
import type { AnalysisMethod } from "../../types";

export function analyzeCoherenceAnalysis(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Coherence Analysis", nameKey: "signal.coherenceAnalysis", category: "statistical", score: 50, weight: 0.25, description: "Text too short", descriptionKey: "signal.coherenceAnalysis.error", icon: "🔗" };
    }

    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 5);
    if (sentences.length < 4) {
        return { name: "Coherence Analysis", nameKey: "signal.coherenceAnalysis", category: "statistical", score: 50, weight: 0.25, description: "Too few sentences", descriptionKey: "signal.coherenceAnalysis.error", icon: "🔗" };
    }

    // Build bag-of-words vectors for each sentence
    const sentVectors = sentences.map(sent => {
        const words = sent.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(w => w.length > 1);
        const vec = new Map<string, number>();
        for (const w of words) vec.set(w, (vec.get(w) || 0) + 1);
        return vec;
    });

    // Cosine similarity between adjacent sentences
    const cosineSim = (a: Map<string, number>, b: Map<string, number>): number => {
        let dot = 0, magA = 0, magB = 0;
        for (const [word, count] of a) {
            dot += count * (b.get(word) || 0);
            magA += count * count;
        }
        for (const count of b.values()) magB += count * count;
        return (Math.sqrt(magA) * Math.sqrt(magB)) > 0 ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
    };

    const similarities: number[] = [];
    for (let i = 0; i < sentVectors.length - 1; i++) {
        similarities.push(cosineSim(sentVectors[i], sentVectors[i + 1]));
    }

    const meanSim = similarities.reduce((a, b) => a + b, 0) / similarities.length;
    const varSim = similarities.reduce((a, b) => a + (b - meanSim) ** 2, 0) / similarities.length;
    const cvSim = meanSim > 0 ? Math.sqrt(varSim) / meanSim : 0;

    // AI text: high mean similarity + low variance (unnaturally smooth flow)
    // Human text: moderate mean similarity + higher variance
    let score: number;
    if (meanSim > 0.5 && cvSim < 0.3) score = 75;
    else if (meanSim > 0.35 && cvSim < 0.5) score = 62;
    else if (meanSim > 0.25) score = 48;
    else if (cvSim > 1.0 && meanSim < 0.15) score = 22;
    else if (cvSim > 0.8) score = 32;
    else score = 42;

    return {
        name: "Coherence Analysis", nameKey: "signal.coherenceAnalysis", category: "statistical", score, weight: 0.25,
        description: score > 55 ? "Unnaturally high coherence — AI text tends to maintain overly smooth logical flow" : "Natural coherence variation — consistent with human writing patterns",
        descriptionKey: score > 55 ? "signal.coherenceAnalysis.ai" : "signal.coherenceAnalysis.real", icon: "🔗",
        details: `Mean similarity: ${meanSim.toFixed(3)}, CV: ${cvSim.toFixed(3)}, Sentence pairs: ${similarities.length}.`,
    };
}
