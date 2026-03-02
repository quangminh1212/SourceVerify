/**
 * Type-Token Ratio (MATTR)
 * Moving-Average Type-Token Ratio to measure lexical diversity.
 * AI text shows more uniform TTR across windows.
 *
 * Reference: Covington & McFall (2010) - The Moving-Average TTR, J. Quantitative Linguistics
 * Reference: Tulchinskii et al. (2024) - Intrinsic Dimension Estimation for AI Text Detection, NeurIPS
 */

import type { AnalysisMethod } from "../../types";

export function analyzeTypeTokenRatio(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Type-Token Ratio", nameKey: "signal.typeTokenRatio", category: "statistical", score: 50, weight: 0.15, description: "Text too short", descriptionKey: "signal.typeTokenRatio.error", icon: "📊" };
    }

    const words = text.toLowerCase().replace(/[^a-z\s'-]/g, "").split(/\s+/).filter(w => w.length > 0);
    if (words.length < 30) {
        return { name: "Type-Token Ratio", nameKey: "signal.typeTokenRatio", category: "statistical", score: 50, weight: 0.15, description: "Too few words", descriptionKey: "signal.typeTokenRatio.error", icon: "📊" };
    }

    // MATTR with sliding window
    const windowSize = Math.min(50, Math.floor(words.length / 2));
    const windowTTRs: number[] = [];
    for (let start = 0; start <= words.length - windowSize; start++) {
        const windowWords = new Set(words.slice(start, start + windowSize));
        windowTTRs.push(windowWords.size / windowSize);
    }

    const mattr = windowTTRs.reduce((a, b) => a + b, 0) / windowTTRs.length;
    const mattrMean = mattr;
    const mattrVar = windowTTRs.reduce((a, b) => a + (b - mattrMean) ** 2, 0) / windowTTRs.length;
    const mattrCV = mattrMean > 0 ? Math.sqrt(mattrVar) / mattrMean : 0;

    // AI: uniform MATTR (low CV), moderate MATTR value
    // Human: variable MATTR (high CV)
    let score: number;
    if (mattrCV < 0.03 && mattr < 0.7) score = 72;
    else if (mattrCV < 0.05 && mattr < 0.72) score = 62;
    else if (mattrCV < 0.07) score = 50;
    else if (mattrCV > 0.12 && mattr > 0.75) score = 25;
    else if (mattrCV > 0.09) score = 35;
    else score = 42;

    return {
        name: "Type-Token Ratio", nameKey: "signal.typeTokenRatio", category: "statistical", score, weight: 0.15,
        description: score > 55 ? "Uniform lexical diversity — suggests AI generation" : "Natural vocabulary variation — consistent with human writing",
        descriptionKey: score > 55 ? "signal.typeTokenRatio.ai" : "signal.typeTokenRatio.real", icon: "📊",
        details: `MATTR: ${mattr.toFixed(3)}, MATTR CV: ${mattrCV.toFixed(4)}, Windows: ${windowTTRs.length}.`,
    };
}
