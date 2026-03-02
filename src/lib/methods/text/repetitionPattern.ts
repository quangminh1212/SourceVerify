/**
 * Repetition Pattern Detection
 * Detects repeated phrases, sentence structures, and ideas.
 * AI text often repeats phrases, transition patterns, and syntactic structures
 * more frequently than human writing.
 *
 * We detect: repeated n-grams (phrase-level), repeated sentence openings,
 * and structural repetition (sentence-start patterns).
 *
 * Reference: Krishna et al. (2024) - Paraphrasing Evades Detectors of AI-Generated Text
 * Reference: Tulchinskii et al. (2024) - Intrinsic Dimension Estimation for Robust Detection
 */
import type { AnalysisMethod } from "../../types";

export function analyzeRepetitionPattern(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Repetition Pattern", nameKey: "signal.repetitionPattern", category: "statistical", score: 50, weight: 0.25, description: "Text too short", descriptionKey: "signal.repetitionPattern.error", icon: "🔁" };
    }

    const words = text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(w => w.length > 0);
    if (words.length < 20) {
        return { name: "Repetition Pattern", nameKey: "signal.repetitionPattern", category: "statistical", score: 50, weight: 0.25, description: "Too few words", descriptionKey: "signal.repetitionPattern.error", icon: "🔁" };
    }

    // 1. Word trigram repetition rate
    const trigramCounts = new Map<string, number>();
    for (let i = 0; i <= words.length - 3; i++) {
        const trigram = words.slice(i, i + 3).join(" ");
        trigramCounts.set(trigram, (trigramCounts.get(trigram) || 0) + 1);
    }
    let repeatedTrigrams = 0;
    const totalTrigrams = words.length - 2;
    for (const count of trigramCounts.values()) {
        if (count > 1) repeatedTrigrams += count;
    }
    const trigramRepRate = totalTrigrams > 0 ? repeatedTrigrams / totalTrigrams : 0;

    // 2. Sentence opening repetition (first 3 words of each sentence)
    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    const openings = new Map<string, number>();
    for (const sent of sentences) {
        const sentWords = sent.toLowerCase().split(/\s+/).filter(w => w.length > 0);
        if (sentWords.length >= 3) {
            const opening = sentWords.slice(0, 3).join(" ");
            openings.set(opening, (openings.get(opening) || 0) + 1);
        }
    }
    let repeatedOpenings = 0;
    for (const count of openings.values()) {
        if (count > 1) repeatedOpenings += count;
    }
    const openingRepRate = sentences.length > 0 ? repeatedOpenings / sentences.length : 0;

    // 3. Word 4-gram uniqueness ratio
    const fourgramSet = new Set<string>();
    let totalFourgrams = 0;
    for (let i = 0; i <= words.length - 4; i++) {
        fourgramSet.add(words.slice(i, i + 4).join(" "));
        totalFourgrams++;
    }
    const fourgramUniqueness = totalFourgrams > 0 ? fourgramSet.size / totalFourgrams : 1;

    // Combined scoring
    // AI text: higher trigram repetition, more repeated openings, lower 4-gram uniqueness
    const combinedRep = trigramRepRate * 0.4 + openingRepRate * 0.3 + (1 - fourgramUniqueness) * 0.3;

    let score: number;
    if (combinedRep > 0.5) score = 78;
    else if (combinedRep > 0.35) score = 65;
    else if (combinedRep > 0.2) score = 52;
    else if (combinedRep < 0.08) score = 22;
    else if (combinedRep < 0.12) score = 32;
    else score = 42;

    return {
        name: "Repetition Pattern", nameKey: "signal.repetitionPattern", category: "statistical", score, weight: 0.25,
        description: score > 55 ? "High repetition rate — AI text tends to reuse phrases and structures" : "Low repetition — consistent with natural human variation",
        descriptionKey: score > 55 ? "signal.repetitionPattern.ai" : "signal.repetitionPattern.real", icon: "🔁",
        details: `Trigram rep: ${trigramRepRate.toFixed(3)}, Opening rep: ${openingRepRate.toFixed(3)}, 4-gram unique: ${fourgramUniqueness.toFixed(3)}, Combined: ${combinedRep.toFixed(3)}.`,
    };
}
