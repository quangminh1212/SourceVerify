/**
 * POS Tag Distribution Analysis
 * Analyzes part-of-speech tag distribution to detect AI text.
 * AI text tends to show flatter POS distributions or unusual category ratios.
 *
 * Reference: Fröhling & Zubiaga (2021) - Feature-based Detection of Automated Language Models, PeerJ CS
 * Reference: Bakhtin et al. (2019) - Real or Fake? Learning to Discriminate Machine from Human Generated Text
 */

import type { AnalysisMethod } from "../../types";

// Simplified POS categories based on word characteristics
const DETERMINERS = new Set(["the", "a", "an", "this", "that", "these", "those", "my", "your", "his", "her", "its", "our", "their", "some", "any", "no", "every", "each", "all", "both", "few", "many", "much", "several"]);
const PREPOSITIONS = new Set(["in", "on", "at", "to", "for", "with", "by", "from", "of", "about", "between", "through", "during", "before", "after", "above", "below", "into", "out", "up", "down", "over", "under", "across", "along", "against", "around", "among", "upon", "within", "without", "beyond", "toward", "towards"]);
const CONJUNCTIONS = new Set(["and", "but", "or", "nor", "so", "yet", "for", "because", "although", "though", "while", "whereas", "unless", "until", "since", "if", "whether", "however", "therefore", "moreover", "furthermore", "nevertheless", "nonetheless", "meanwhile"]);
const AUXILIARIES = new Set(["is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "shall", "can", "must"]);
const PRONOUNS = new Set(["i", "me", "my", "mine", "myself", "you", "your", "yours", "yourself", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "we", "us", "our", "ours", "ourselves", "they", "them", "their", "theirs", "themselves", "who", "whom", "whose", "which", "that", "what"]);
const ADVERBS_SUFFIXES = ["ly", "ward", "wards", "wise"];

export function analyzePosTagAnalysis(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "POS Tag Distribution", nameKey: "signal.posTagAnalysis", category: "statistical", score: 50, weight: 0.2, description: "Text too short for POS analysis", descriptionKey: "signal.posTagAnalysis.error", icon: "🏷️" };
    }

    const words = text.toLowerCase().replace(/[^a-z\s'-]/g, "").split(/\s+/).filter(w => w.length > 0);
    if (words.length < 30) {
        return { name: "POS Tag Distribution", nameKey: "signal.posTagAnalysis", category: "statistical", score: 50, weight: 0.2, description: "Too few words", descriptionKey: "signal.posTagAnalysis.error", icon: "🏷️" };
    }

    // Classify words into POS categories
    let detCount = 0, prepCount = 0, conjCount = 0, auxCount = 0, pronCount = 0, advCount = 0, otherCount = 0;
    for (const w of words) {
        if (DETERMINERS.has(w)) detCount++;
        else if (PREPOSITIONS.has(w)) prepCount++;
        else if (CONJUNCTIONS.has(w)) conjCount++;
        else if (AUXILIARIES.has(w)) auxCount++;
        else if (PRONOUNS.has(w)) pronCount++;
        else if (ADVERBS_SUFFIXES.some(s => w.endsWith(s) && w.length > s.length + 2)) advCount++;
        else otherCount++; // nouns, verbs, adjectives
    }

    const N = words.length;
    const ratios = [detCount / N, prepCount / N, conjCount / N, auxCount / N, pronCount / N, advCount / N, otherCount / N];

    // Chi-squared test against expected human distribution
    const expected = [0.08, 0.10, 0.05, 0.06, 0.08, 0.05, 0.58]; // typical human ratios
    let chiSquared = 0;
    for (let i = 0; i < ratios.length; i++) {
        const diff = ratios[i] - expected[i];
        chiSquared += (diff * diff) / (expected[i] || 0.01);
    }

    // Also measure distribution flatness (entropy)
    const entropy = -ratios.filter(r => r > 0).reduce((sum, r) => sum + r * Math.log2(r), 0);
    const maxEntropy = Math.log2(ratios.length);
    const normalizedEntropy = entropy / maxEntropy;

    // AI text: higher chi-squared (deviates from human norms), potentially flatter distribution
    let score: number;
    if (chiSquared > 0.15 && normalizedEntropy > 0.85) score = 72;
    else if (chiSquared > 0.10 && normalizedEntropy > 0.80) score = 62;
    else if (chiSquared > 0.06) score = 52;
    else if (chiSquared < 0.03 && normalizedEntropy < 0.75) score = 28;
    else if (chiSquared < 0.04) score = 35;
    else score = 42;

    return {
        name: "POS Tag Distribution", nameKey: "signal.posTagAnalysis", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "POS distribution deviates from human norms — suggests AI generation" : "Natural POS distribution — consistent with human writing",
        descriptionKey: score > 55 ? "signal.posTagAnalysis.ai" : "signal.posTagAnalysis.real", icon: "🏷️",
        details: `Chi²: ${chiSquared.toFixed(4)}, Entropy: ${normalizedEntropy.toFixed(3)}, Content words: ${(otherCount / N * 100).toFixed(1)}%, Words: ${N}.`,
    };
}
