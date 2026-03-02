/**
 * Coreference Chain Analysis
 * Examines coreference chains to detect AI text through entity tracking patterns.
 * AI text often shows shorter chains and less complex reference resolutions.
 *
 * Reference: Dugan et al. (2024) - RAID: Robust Evaluation of Machine-Generated Text Detectors, ACL
 * Reference: Clark & Manning (2016) - Deep Reinforcement Learning for Coreference Models, EMNLP
 */

import type { AnalysisMethod } from "../../types";

const THIRD_PERSON_PRONOUNS = new Set(["he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves"]);
const DEMONSTRATIVES = new Set(["this", "that", "these", "those"]);

export function analyzeCoreferenceChain(text: string): AnalysisMethod {
    if (text.length < 200) {
        return { name: "Coreference Chain", nameKey: "signal.coreferenceChain", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.coreferenceChain.error", icon: "🔄" };
    }

    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    if (sentences.length < 5) {
        return { name: "Coreference Chain", nameKey: "signal.coreferenceChain", category: "statistical", score: 50, weight: 0.2, description: "Too few sentences", descriptionKey: "signal.coreferenceChain.error", icon: "🔄" };
    }

    // Track pronoun usage and referential patterns per sentence
    let totalPronouns = 0;
    let totalDemonstratives = 0;
    let totalWords = 0;
    const referentialDistances: number[] = [];
    let lastPronounSent = -1;

    for (let si = 0; si < sentences.length; si++) {
        const words = sentences[si].toLowerCase().split(/\s+/).filter(w => w.length > 0);
        totalWords += words.length;
        let hasPronoun = false;
        for (const w of words) {
            if (THIRD_PERSON_PRONOUNS.has(w)) { totalPronouns++; hasPronoun = true; }
            if (DEMONSTRATIVES.has(w)) totalDemonstratives++;
        }
        if (hasPronoun) {
            if (lastPronounSent >= 0) referentialDistances.push(si - lastPronounSent);
            lastPronounSent = si;
        }
    }

    const pronounDensity = totalPronouns / (totalWords || 1);
    const demDensity = totalDemonstratives / (totalWords || 1);

    // Referential distance statistics
    const avgRefDist = referentialDistances.length > 0
        ? referentialDistances.reduce((a, b) => a + b, 0) / referentialDistances.length : 0;
    const refDistVar = referentialDistances.length > 1
        ? referentialDistances.reduce((a, b) => a + (b - avgRefDist) ** 2, 0) / referentialDistances.length : 0;
    const refDistCV = avgRefDist > 0 ? Math.sqrt(refDistVar) / avgRefDist : 0;

    // AI: lower pronoun density (prefers full noun phrases), uniform referential distance
    let score: number;
    if (pronounDensity < 0.02 && refDistCV < 0.4) score = 72;
    else if (pronounDensity < 0.03 && refDistCV < 0.6) score = 62;
    else if (pronounDensity < 0.04) score = 48;
    else if (pronounDensity > 0.06 && refDistCV > 1.0) score = 25;
    else if (pronounDensity > 0.05) score = 35;
    else score = 42;

    return {
        name: "Coreference Chain", nameKey: "signal.coreferenceChain", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Weak coreference patterns — simplified entity tracking suggests AI" : "Natural coreference chains — consistent with human writing",
        descriptionKey: score > 55 ? "signal.coreferenceChain.ai" : "signal.coreferenceChain.real", icon: "🔄",
        details: `Pronoun density: ${(pronounDensity * 100).toFixed(2)}%, Ref dist CV: ${refDistCV.toFixed(3)}, Avg ref dist: ${avgRefDist.toFixed(2)} sent.`,
    };
}
