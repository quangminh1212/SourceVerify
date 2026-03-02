/**
 * Collocation Strength Analysis
 * Measures word co-occurrence patterns using PMI to detect formulaic AI text.
 *
 * Reference: Church & Hanks (1990) - Word Association Norms, Mutual Information, Computational Linguistics
 * Reference: Evert (2008) - Corpora and Collocations
 */

import type { AnalysisMethod } from "../../types";

export function analyzeCollocationStrength(text: string): AnalysisMethod {
    if (text.length < 150) {
        return { name: "Collocation Strength", nameKey: "signal.collocationStrength", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.collocationStrength.error", icon: "🔗" };
    }

    const words = text.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter(w => w.length > 2);
    if (words.length < 30) {
        return { name: "Collocation Strength", nameKey: "signal.collocationStrength", category: "statistical", score: 50, weight: 0.2, description: "Too few words", descriptionKey: "signal.collocationStrength.error", icon: "🔗" };
    }

    // Build unigram and bigram frequency counts
    const unigramCounts = new Map<string, number>();
    const bigramCounts = new Map<string, number>();
    const N = words.length;

    for (let i = 0; i < N; i++) {
        unigramCounts.set(words[i], (unigramCounts.get(words[i]) || 0) + 1);
        if (i < N - 1) {
            const bigram = words[i] + " " + words[i + 1];
            bigramCounts.set(bigram, (bigramCounts.get(bigram) || 0) + 1);
        }
    }

    // Compute PMI for all bigrams occurring >= 2 times
    const pmiValues: number[] = [];
    for (const [bigram, count] of bigramCounts.entries()) {
        if (count < 2) continue;
        const [w1, w2] = bigram.split(" ");
        const c1 = unigramCounts.get(w1) || 1;
        const c2 = unigramCounts.get(w2) || 1;
        const pmi = Math.log2((count * N) / (c1 * c2));
        pmiValues.push(pmi);
    }

    if (pmiValues.length < 3) {
        return { name: "Collocation Strength", nameKey: "signal.collocationStrength", category: "statistical", score: 50, weight: 0.2, description: "Too few repeated collocations", descriptionKey: "signal.collocationStrength.error", icon: "🔗" };
    }

    const meanPMI = pmiValues.reduce((a, b) => a + b, 0) / pmiValues.length;
    const pmiVar = pmiValues.reduce((a, b) => a + (b - meanPMI) ** 2, 0) / pmiValues.length;
    const pmiCV = meanPMI !== 0 ? Math.sqrt(pmiVar) / Math.abs(meanPMI) : 0;

    // Bigram diversity
    const uniqueBigrams = bigramCounts.size;
    const bigramDiversity = uniqueBigrams / (N - 1);

    // AI: lower PMI variance (formulaic collocations), lower bigram diversity
    let score: number;
    if (pmiCV < 0.3 && bigramDiversity < 0.75) score = 72;
    else if (pmiCV < 0.5 && bigramDiversity < 0.80) score = 62;
    else if (pmiCV < 0.6) score = 50;
    else if (pmiCV > 0.9 && bigramDiversity > 0.90) score = 25;
    else if (pmiCV > 0.7) score = 35;
    else score = 42;

    return {
        name: "Collocation Strength", nameKey: "signal.collocationStrength", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Formulaic collocations — stereotyped word pairings suggest AI" : "Natural collocation patterns — diverse word combinations consistent with human writing",
        descriptionKey: score > 55 ? "signal.collocationStrength.ai" : "signal.collocationStrength.real", icon: "🔗",
        details: `Mean PMI: ${meanPMI.toFixed(3)}, PMI CV: ${pmiCV.toFixed(3)}, Bigram diversity: ${(bigramDiversity * 100).toFixed(1)}%.`,
    };
}
