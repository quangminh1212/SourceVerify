/**
 * Readability Score Analysis
 * AI text often maintains consistent readability; human text varies naturally.
 * We compute Flesch-Kincaid Grade Level and Automated Readability Index (ARI)
 * across text segments and measure their consistency.
 *
 * Flesch-Kincaid: 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
 * ARI: 4.71 * (chars/words) + 0.5 * (words/sentences) - 21.43
 *
 * Reference: Ippolito et al. (2020) - Automatic Detection of Generated Text, ACL
 * Reference: Flesch, R. (1948) - A New Readability Yardstick, Journal of Applied Psychology
 */
import type { AnalysisMethod } from "../../types";

function countSyllables(word: string): number {
    const w = word.toLowerCase().replace(/[^a-z]/g, "");
    if (w.length <= 2) return 1;
    let count = 0;
    const vowels = "aeiouy";
    let prevIsVowel = false;
    for (const ch of w) {
        const isVowel = vowels.includes(ch);
        if (isVowel && !prevIsVowel) count++;
        prevIsVowel = isVowel;
    }
    if (w.endsWith("e") && count > 1) count--;
    return Math.max(1, count);
}

export function analyzeReadabilityScore(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Readability Score", nameKey: "signal.readabilityScore", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.readabilityScore.error", icon: "📚" };
    }

    // Split text into segments for consistency analysis
    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    if (sentences.length < 4) {
        return { name: "Readability Score", nameKey: "signal.readabilityScore", category: "statistical", score: 50, weight: 0.2, description: "Too few sentences", descriptionKey: "signal.readabilityScore.error", icon: "📚" };
    }

    // Calculate ARI per sentence group (3 sentences each)
    const groupSize = 3;
    const ariScores: number[] = [];
    for (let i = 0; i <= sentences.length - groupSize; i += groupSize) {
        const group = sentences.slice(i, i + groupSize).join(". ");
        const words = group.split(/\s+/).filter(w => w.length > 0);
        const chars = words.reduce((a, w) => a + w.replace(/[^\w]/g, "").length, 0);
        const sentCount = groupSize;
        if (words.length > 0) {
            const ari = 4.71 * (chars / words.length) + 0.5 * (words.length / sentCount) - 21.43;
            ariScores.push(ari);
        }
    }

    if (ariScores.length < 2) {
        return { name: "Readability Score", nameKey: "signal.readabilityScore", category: "statistical", score: 50, weight: 0.2, description: "Insufficient data", descriptionKey: "signal.readabilityScore.error", icon: "📚" };
    }

    // Overall readability
    const allWords = text.split(/\s+/).filter(w => w.length > 0);
    const totalSyllables = allWords.reduce((a, w) => a + countSyllables(w), 0);
    const fleschKincaid = 0.39 * (allWords.length / sentences.length) + 11.8 * (totalSyllables / allWords.length) - 15.59;

    // Consistency of readability across sections
    const ariMean = ariScores.reduce((a, b) => a + b, 0) / ariScores.length;
    const ariVar = ariScores.reduce((a, b) => a + (b - ariMean) ** 2, 0) / ariScores.length;
    const ariCV = ariMean !== 0 ? Math.sqrt(ariVar) / Math.abs(ariMean) : 0;

    // AI text: very consistent readability (low ariCV)
    // Human text: varying readability across sections
    let score: number;
    if (ariCV < 0.1) score = 72;
    else if (ariCV < 0.2) score = 60;
    else if (ariCV < 0.3) score = 48;
    else if (ariCV > 0.6) score = 22;
    else if (ariCV > 0.45) score = 32;
    else score = 42;

    return {
        name: "Readability Score", nameKey: "signal.readabilityScore", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Uniform readability throughout — AI text maintains consistent complexity" : "Natural readability variation — consistent with human authoring",
        descriptionKey: score > 55 ? "signal.readabilityScore.ai" : "signal.readabilityScore.real", icon: "📚",
        details: `Flesch-Kincaid: ${fleschKincaid.toFixed(1)}, ARI CV: ${ariCV.toFixed(3)}, ARI mean: ${ariMean.toFixed(1)}, Segments: ${ariScores.length}.`,
    };
}
