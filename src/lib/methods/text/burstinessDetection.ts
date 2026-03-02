/**
 * Burstiness Detection
 * Measures the burstiness of sentence lengths and word frequencies.
 * Human writing exhibits bursty patterns (variable sentence lengths, topic-specific word clusters),
 * while AI text tends toward uniform distribution of sentence lengths.
 *
 * Burstiness B = (σ - μ) / (σ + μ) where σ=std dev, μ=mean of inter-event intervals.
 * B ∈ [-1, 1]: B→-1 is periodic (AI-like), B→0 is random, B→1 is bursty (human-like).
 *
 * Reference: Mitchell et al. (2023) - DetectGPT: Zero-Shot Machine-Generated Text Detection, ICML
 * Reference: Goh & Barabási (2008) - Burstiness and memory of human dynamics
 */

import type { AnalysisMethod } from "../../types";

export function analyzeBurstinessDetection(text: string): AnalysisMethod {
    if (text.length < 100) {
        return {
            name: "Burstiness Detection", nameKey: "signal.burstinessDetection",
            category: "statistical", score: 50, weight: 0.25,
            description: "Text too short for burstiness analysis",
            descriptionKey: "signal.burstinessDetection.error", icon: "💥",
        };
    }

    // Split into sentences
    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    if (sentences.length < 5) {
        return {
            name: "Burstiness Detection", nameKey: "signal.burstinessDetection",
            category: "statistical", score: 50, weight: 0.25,
            description: "Too few sentences for burstiness analysis",
            descriptionKey: "signal.burstinessDetection.error", icon: "💥",
        };
    }

    // Calculate word counts per sentence
    const wordCounts = sentences.map(s => s.split(/\s+/).filter(w => w.length > 0).length);

    // Burstiness of sentence lengths: B = (σ - μ) / (σ + μ)
    const mean = wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length;
    const variance = wordCounts.reduce((a, b) => a + (b - mean) ** 2, 0) / wordCounts.length;
    const stdDev = Math.sqrt(variance);
    const burstiness = (mean + stdDev) > 0 ? (stdDev - mean) / (stdDev + mean) : 0;

    // Also measure inter-sentence length differences (consecutive variation)
    const diffs: number[] = [];
    for (let i = 1; i < wordCounts.length; i++) {
        diffs.push(Math.abs(wordCounts[i] - wordCounts[i - 1]));
    }
    const meanDiff = diffs.length > 0 ? diffs.reduce((a, b) => a + b, 0) / diffs.length : 0;
    const diffVar = diffs.length > 0 ? diffs.reduce((a, b) => a + (b - meanDiff) ** 2, 0) / diffs.length : 0;
    const diffCV = meanDiff > 0 ? Math.sqrt(diffVar) / meanDiff : 0;

    // AI text: burstiness close to -1 (periodic), low diffCV
    // Human text: burstiness > 0 (bursty), high diffCV
    let score: number;
    if (burstiness < -0.3 && diffCV < 0.6) score = 75;
    else if (burstiness < -0.1 && diffCV < 0.8) score = 62;
    else if (burstiness < 0.1) score = 52;
    else if (burstiness > 0.3 && diffCV > 1.0) score = 22;
    else if (burstiness > 0.15) score = 35;
    else score = 42;

    return {
        name: "Burstiness Detection", nameKey: "signal.burstinessDetection",
        category: "statistical", score, weight: 0.25,
        description: score > 55
            ? "Low burstiness — overly uniform sentence structure suggests AI generation"
            : "Natural bursty writing pattern — consistent with human authorship",
        descriptionKey: score > 55 ? "signal.burstinessDetection.ai" : "signal.burstinessDetection.real",
        icon: "💥",
        details: `Burstiness: ${burstiness.toFixed(3)}, Sentence CV: ${(stdDev / (mean || 1)).toFixed(3)}, Diff CV: ${diffCV.toFixed(3)}, Sentences: ${sentences.length}.`,
    };
}
