/**
 * Lexical Sophistication
 * Measures word frequency bands to detect AI's preference for common vocabulary.
 *
 * Reference: Kyle & Crossley (2015) - Automatically Assessing Lexical Sophistication, TESOL
 * Reference: Kobak et al. (2024) - Delving into ChatGPT Usage Through Excess Vocabulary
 */

import type { AnalysisMethod } from "../../types";

// High-frequency words (top 1000 most common)
const HIGH_FREQ = new Set(["the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"]);

export function analyzeLexicalSophistication(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Lexical Sophistication", nameKey: "signal.lexicalSophistication", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.lexicalSophistication.error", icon: "📚" };
    }

    const words = text.toLowerCase().replace(/[^a-z\s'-]/g, "").split(/\s+/).filter(w => w.length > 1);
    if (words.length < 30) {
        return { name: "Lexical Sophistication", nameKey: "signal.lexicalSophistication", category: "statistical", score: 50, weight: 0.2, description: "Too few words", descriptionKey: "signal.lexicalSophistication.error", icon: "📚" };
    }

    let highFreqCount = 0;
    let longWordCount = 0; // words > 8 chars as sophistication proxy
    let rareWordCount = 0; // words > 10 chars

    for (const w of words) {
        if (HIGH_FREQ.has(w)) highFreqCount++;
        if (w.length > 8) longWordCount++;
        if (w.length > 10) rareWordCount++;
    }

    const highFreqRatio = highFreqCount / words.length;
    const longWordRatio = longWordCount / words.length;
    const rareWordRatio = rareWordCount / words.length;
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;

    // AI: moderate high-freq ratio (avoids extremes), low rare word ratio, uniform word length
    // Human: more variation, more rare/colloquial words
    let score: number;
    if (highFreqRatio > 0.35 && rareWordRatio < 0.03 && avgWordLength < 4.8) score = 70;
    else if (highFreqRatio > 0.30 && rareWordRatio < 0.05) score = 60;
    else if (highFreqRatio > 0.25) score = 48;
    else if (rareWordRatio > 0.08 && avgWordLength > 5.5) score = 28;
    else if (rareWordRatio > 0.06) score = 35;
    else score = 42;

    return {
        name: "Lexical Sophistication", nameKey: "signal.lexicalSophistication", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Low lexical sophistication — safe vocabulary preference suggests AI" : "Natural vocabulary sophistication — consistent with human writing",
        descriptionKey: score > 55 ? "signal.lexicalSophistication.ai" : "signal.lexicalSophistication.real", icon: "📚",
        details: `High-freq: ${(highFreqRatio * 100).toFixed(1)}%, Rare: ${(rareWordRatio * 100).toFixed(1)}%, Avg len: ${avgWordLength.toFixed(2)}.`,
    };
}
