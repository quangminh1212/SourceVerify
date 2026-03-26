import type { AnalysisMethod } from "../../types";
import { gray } from "../pixelUtils";

/**
 * Signal 30: Markov Chain Transition Probability
 * Pixel-to-pixel transition patterns
 * AI images have different transition probability matrices
 */
export function analyzeMarkovTransition(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const levels = 16; // Quantize to 16 levels
    const transition = Array.from({ length: levels }, () => new Array(levels).fill(0));
    let totalTransitions = 0;
    const step = Math.max(1, Math.floor(Math.min(width, height) / 300));

    // Horizontal transitions
    for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width - 1; x += step) {
            const g1 = Math.min(levels - 1, Math.floor(gray(pixels, (y * width + x) * 4) / 256 * levels));
            const g2 = Math.min(levels - 1, Math.floor(gray(pixels, (y * width + x + 1) * 4) / 256 * levels));
            transition[g1][g2]++;
            totalTransitions++;
        }
    }

    if (totalTransitions < 100) {
        return {
            name: "Markov Transition", nameKey: "signal.markovTransition",
            category: "statistical", score: 50, weight: 0.4,
            description: "Insufficient data for Markov analysis",
            descriptionKey: "signal.markov.error", icon: "⇌",
        };
    }

    // Normalize to probabilities
    for (let i = 0; i < levels; i++) {
        const rowSum = transition[i].reduce((a: number, b: number) => a + b, 0);
        if (rowSum > 0) {
            for (let j = 0; j < levels; j++) transition[i][j] /= rowSum;
        }
    }

    // Compute diagonal dominance (self-transition probability)
    let diagSum = 0;
    for (let i = 0; i < levels; i++) diagSum += transition[i][i];
    const diagDominance = diagSum / levels;

    // Compute transition entropy
    let transEntropy = 0;
    for (let i = 0; i < levels; i++) {
        for (let j = 0; j < levels; j++) {
            if (transition[i][j] > 0) {
                transEntropy -= transition[i][j] * Math.log2(transition[i][j]);
            }
        }
    }
    transEntropy /= levels; // average per row

    // AI images: higher diagonal dominance (smoother), lower transition entropy
    let score = 50;
    if (diagDominance > 0.85) score += 18;
    else if (diagDominance > 0.75) score += 10;
    else if (diagDominance > 0.65) score += 3;
    else if (diagDominance < 0.40) score -= 15;
    else if (diagDominance < 0.50) score -= 8;

    if (transEntropy < 1.5) score += 12;
    else if (transEntropy < 2.5) score += 5;
    else if (transEntropy > 3.5) score -= 10;

    score = Math.max(5, Math.min(95, score));

    return {
        name: "Markov Transition", nameKey: "signal.markovTransition",
        category: "statistical", score, weight: 0.4,
        description: score > 55
            ? "Pixel transitions show abnormal smoothness — AI images have over-correlated pixels"
            : "Pixel transition patterns appear natural — consistent with real image content",
        descriptionKey: score > 55 ? "signal.markov.ai" : "signal.markov.real",
        icon: "⇌",
        details: `Diagonal dominance: ${diagDominance.toFixed(3)}, Transition entropy: ${transEntropy.toFixed(3)} bits.`,
    };
}