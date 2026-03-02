/**
 * Sentence Length Variance
 * AI text tends to produce more uniform sentence lengths than human writing.
 * Human writing has naturally high variance in sentence length due to
 * emphasis, rhythm, and rhetorical devices.
 *
 * We measure: CV of word count per sentence, consecutive length difference
 * patterns, and short/long sentence ratio.
 *
 * Reference: Uchendu et al. (2020) - Authorship Attribution for Neural Text Generation, EMNLP
 * Reference: Mosteller & Wallace (1963) - Inference in an Authorship Problem
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSentenceLengthVariance(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Sentence Length Variance", nameKey: "signal.sentenceLengthVariance", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.sentenceLengthVariance.error", icon: "📏" };
    }

    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    if (sentences.length < 5) {
        return { name: "Sentence Length Variance", nameKey: "signal.sentenceLengthVariance", category: "statistical", score: 50, weight: 0.2, description: "Too few sentences", descriptionKey: "signal.sentenceLengthVariance.error", icon: "📏" };
    }

    const wordCounts = sentences.map(s => s.split(/\s+/).filter(w => w.length > 0).length);

    const mean = wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length;
    const variance = wordCounts.reduce((a, b) => a + (b - mean) ** 2, 0) / wordCounts.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

    // Consecutive sentence length differences
    const diffs: number[] = [];
    for (let i = 1; i < wordCounts.length; i++) {
        diffs.push(Math.abs(wordCounts[i] - wordCounts[i - 1]));
    }
    const meanDiff = diffs.reduce((a, b) => a + b, 0) / (diffs.length || 1);
    const diffCV = meanDiff > 0
        ? Math.sqrt(diffs.reduce((a, b) => a + (b - meanDiff) ** 2, 0) / diffs.length) / meanDiff
        : 0;

    // Short:long sentence ratio (human text has more extreme lengths)
    const shortSent = wordCounts.filter(c => c <= 5).length;
    const longSent = wordCounts.filter(c => c >= 25).length;
    const extremeRatio = (shortSent + longSent) / wordCounts.length;

    // AI text: low CV (uniform lengths), low diffCV, low extremeRatio
    // Human text: high CV, varied consecutive diffs, presence of very short/long sentences
    let score: number;
    if (cv < 0.3 && extremeRatio < 0.05) score = 72;
    else if (cv < 0.4 && extremeRatio < 0.1) score = 60;
    else if (cv < 0.5) score = 48;
    else if (cv > 0.7 && extremeRatio > 0.2) score = 22;
    else if (cv > 0.6) score = 32;
    else score = 42;

    return {
        name: "Sentence Length Variance", nameKey: "signal.sentenceLengthVariance", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Uniform sentence structure — AI tends to produce sentences of similar length" : "Natural sentence length diversity — consistent with human writing",
        descriptionKey: score > 55 ? "signal.sentenceLengthVariance.ai" : "signal.sentenceLengthVariance.real", icon: "📏",
        details: `CV: ${cv.toFixed(3)}, Diff CV: ${diffCV.toFixed(3)}, Mean words/sent: ${mean.toFixed(1)}, Extreme ratio: ${extremeRatio.toFixed(3)}, Sentences: ${wordCounts.length}.`,
    };
}
