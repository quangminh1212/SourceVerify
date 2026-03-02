/**
 * Writing Rhythm Analysis
 * Human writing has natural cadence patterns; AI text is more metronomic.
 * We measure the autocorrelation of sentence lengths to detect periodic
 * patterns, which indicate machine-like regularity.
 *
 * Also analyzes variance clustering — human text tends to have bursts of
 * similar-length sentences followed by changes (paragraph-level rhythm).
 *
 * Reference: Tay et al. (2020) - Would You Rather? Comparative Study of Human vs. Machine Generated Text
 * Reference: Argamon et al. (2007) - Stylistic text classification using functional lexical features
 */
import type { AnalysisMethod } from "../../types";

export function analyzeWritingRhythm(text: string): AnalysisMethod {
    if (text.length < 100) {
        return { name: "Writing Rhythm", nameKey: "signal.writingRhythm", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.writingRhythm.error", icon: "🎵" };
    }

    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    if (sentences.length < 8) {
        return { name: "Writing Rhythm", nameKey: "signal.writingRhythm", category: "statistical", score: 50, weight: 0.2, description: "Too few sentences for rhythm analysis", descriptionKey: "signal.writingRhythm.error", icon: "🎵" };
    }

    const sentLengths = sentences.map(s => s.split(/\s+/).filter(w => w.length > 0).length);
    const n = sentLengths.length;

    // Mean and variance
    const mean = sentLengths.reduce((a, b) => a + b, 0) / n;
    let var0 = 0;
    for (const l of sentLengths) var0 += (l - mean) ** 2;
    var0 /= n;

    if (var0 < 0.5) {
        // Near-zero variance = virtually all sentences same length (very AI-like)
        return {
            name: "Writing Rhythm", nameKey: "signal.writingRhythm", category: "statistical", score: 80, weight: 0.2,
            description: "Metronomic sentence lengths — near-zero variance indicates AI generation",
            descriptionKey: "signal.writingRhythm.ai", icon: "🎵",
            details: `Variance: ${var0.toFixed(3)}, Mean length: ${mean.toFixed(1)}.`,
        };
    }

    // Autocorrelation of sentence lengths at multiple lags
    const maxLag = Math.min(5, Math.floor(n / 3));
    let maxCorr = 0;
    let peakLag = 0;
    for (let lag = 1; lag <= maxLag; lag++) {
        let corr = 0;
        for (let i = 0; i < n - lag; i++) {
            corr += (sentLengths[i] - mean) * (sentLengths[i + lag] - mean);
        }
        corr /= (n - lag) * var0;
        if (Math.abs(corr) > Math.abs(maxCorr)) {
            maxCorr = corr;
            peakLag = lag;
        }
    }

    // Rhythm regularity: consecutive length differences
    const diffs: number[] = [];
    for (let i = 1; i < n; i++) {
        diffs.push(Math.abs(sentLengths[i] - sentLengths[i - 1]));
    }
    const meanDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    const diffVar = diffs.reduce((a, b) => a + (b - meanDiff) ** 2, 0) / diffs.length;
    const diffCV = meanDiff > 0 ? Math.sqrt(diffVar) / meanDiff : 0;

    // AI: high autocorrelation (periodic), low diffCV (regular rhythm)
    // Human: low autocorrelation, high diffCV (irregular rhythm)
    let score: number;
    if (maxCorr > 0.5 && diffCV < 0.6) score = 75;
    else if (maxCorr > 0.3 && diffCV < 0.8) score = 62;
    else if (maxCorr > 0.15) score = 48;
    else if (maxCorr < 0.05 && diffCV > 1.2) score = 22;
    else if (diffCV > 1.0) score = 32;
    else score = 42;

    return {
        name: "Writing Rhythm", nameKey: "signal.writingRhythm", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Strong periodic rhythm detected — AI text shows metronomic regularity" : "Natural rhythm variation — consistent with human writing cadence",
        descriptionKey: score > 55 ? "signal.writingRhythm.ai" : "signal.writingRhythm.real", icon: "🎵",
        details: `Max autocorr: ${maxCorr.toFixed(3)} at lag ${peakLag}, Diff CV: ${diffCV.toFixed(3)}, Mean sent-len: ${mean.toFixed(1)}.`,
    };
}
