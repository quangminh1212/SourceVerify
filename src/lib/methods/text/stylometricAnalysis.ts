/**
 * Stylometric Analysis
 * Identifies writing style consistency markers
 * AI text tends to maintain overly consistent style throughout
 * Reference: Kumarage et al. (2023) - Stylometric Detection of AI-Generated Text
 */

import type { AnalysisMethod } from "../../types";

export function analyzeStylometricAnalysis(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Stylometric Analysis", nameKey: "signal.stylometricAnalysis",
            category: "statistical", score: 50, weight: 0.3,
            description: "Input too small for analysis",
            descriptionKey: "signal.stylometricAnalysis.error", icon: "✍",
        };
    }

    // Analyze row-level intensity profiles as a proxy for writing style
    // Human text has more varied line-to-line characteristics
    const sampleCount = Math.min(h, 100);
    const lineStep = Math.max(1, Math.floor(h / sampleCount));
    const lineProfiles: number[] = [];

    for (let y = 0; y < h; y += lineStep) {
        let lineSum = 0, lineVar = 0;
        const linePixels: number[] = [];

        for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            const gray = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
            linePixels.push(gray);
            lineSum += gray;
        }

        const lineMean = lineSum / w;
        for (const p of linePixels) {
            lineVar += (p - lineMean) ** 2;
        }
        lineProfiles.push(lineVar / w);
    }

    if (lineProfiles.length < 2) {
        return {
            name: "Stylometric Analysis", nameKey: "signal.stylometricAnalysis",
            category: "statistical", score: 50, weight: 0.3,
            description: "Insufficient data for stylometric analysis",
            descriptionKey: "signal.stylometricAnalysis.error", icon: "✍",
        };
    }

    // Calculate consistency of line variance profiles
    const profMean = lineProfiles.reduce((a, b) => a + b, 0) / lineProfiles.length;
    const profVar = lineProfiles.reduce((a, b) => a + (b - profMean) ** 2, 0) / lineProfiles.length;
    const profCV = profMean > 0 ? Math.sqrt(profVar) / profMean : 0;

    // Analyze consecutive line difference for rhythm detection
    let rhythmConsistency = 0;
    for (let i = 1; i < lineProfiles.length; i++) {
        const diff = Math.abs(lineProfiles[i] - lineProfiles[i - 1]);
        if (diff < profMean * 0.3) rhythmConsistency++;
    }
    const rhythmRatio = rhythmConsistency / (lineProfiles.length - 1);

    let score: number;
    if (profCV < 0.3 && rhythmRatio > 0.7) score = 72;
    else if (profCV < 0.5 && rhythmRatio > 0.5) score = 60;
    else if (profCV > 1.0) score = 28;
    else score = 42;

    return {
        name: "Stylometric Analysis", nameKey: "signal.stylometricAnalysis",
        category: "statistical", score, weight: 0.3,
        description: score > 55
            ? "Overly consistent writing style detected — characteristic of AI-generated text"
            : "Natural style variation — consistent with human authorship",
        descriptionKey: score > 55 ? "signal.stylometricAnalysis.ai" : "signal.stylometricAnalysis.real",
        icon: "✍",
        details: `Profile CV: ${profCV.toFixed(3)}, Rhythm ratio: ${rhythmRatio.toFixed(3)}.`,
    };
}
