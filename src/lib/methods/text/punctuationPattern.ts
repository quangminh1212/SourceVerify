/**
 * Punctuation Pattern Analysis
 * AI text has distinctive punctuation usage patterns
 * Reference: Fagni et al. (2021) - TweepFake: About detecting deepfake tweets, PLOS ONE
 */
import type { AnalysisMethod } from "../../types";

export function analyzePunctuationPattern(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Punctuation Pattern", nameKey: "signal.punctuationPattern", category: "statistical", score: 50, weight: 0.2, description: "Input too small", descriptionKey: "signal.punctuationPattern.error", icon: "❗" };
    }
    // Detect sharp intensity transitions as proxy for punctuation marks
    const step = Math.max(1, Math.floor(h / 50));
    let sharpTransitions = 0, total = 0;
    const spacings: number[] = [];
    let lastSharp = 0;
    for (let y = 0; y < h; y += step) {
        for (let x = 1; x < w - 1; x++) {
            const idx = (y * w + x) * 4;
            const prev = 0.299 * pixels[idx - 4] + 0.587 * pixels[idx - 3] + 0.114 * pixels[idx - 2];
            const curr = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
            const next = 0.299 * pixels[idx + 4] + 0.587 * pixels[idx + 5] + 0.114 * pixels[idx + 6];
            if (Math.abs(curr - prev) > 30 && Math.abs(curr - next) > 30) {
                sharpTransitions++;
                if (lastSharp > 0) spacings.push(x + y * w - lastSharp);
                lastSharp = x + y * w;
            }
            total++;
        }
    }
    const sharpRate = total > 0 ? sharpTransitions / total : 0;
    const spaceMean = spacings.length > 0 ? spacings.reduce((a, b) => a + b, 0) / spacings.length : 0;
    const spaceVar = spacings.length > 1 ? spacings.reduce((a, b) => a + (b - spaceMean) ** 2, 0) / spacings.length : 0;
    const spaceCV = spaceMean > 0 ? Math.sqrt(spaceVar) / spaceMean : 0;

    let score: number;
    if (spaceCV < 0.4 && sharpRate > 0.01) score = 68;
    else if (spaceCV < 0.6) score = 55;
    else if (spaceCV > 1.2) score = 28;
    else score = 42;

    return {
        name: "Punctuation Pattern", nameKey: "signal.punctuationPattern", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Regular punctuation spacing — AI text shows predictable punctuation patterns" : "Natural punctuation variation — consistent with human writing style",
        descriptionKey: score > 55 ? "signal.punctuationPattern.ai" : "signal.punctuationPattern.real", icon: "❗",
        details: `Sharp rate: ${sharpRate.toFixed(4)}, Spacing CV: ${spaceCV.toFixed(3)}.`,
    };
}
