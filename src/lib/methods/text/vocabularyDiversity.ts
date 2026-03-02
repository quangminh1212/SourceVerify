/**
 * Vocabulary Diversity Analysis
 * Measures type-token ratio and lexical diversity proxies
 * AI text often shows less lexical variety within local windows
 * Reference: Gehrmann et al. (2019) - GLTR
 */

import type { AnalysisMethod } from "../../types";

export function analyzeVocabularyDiversity(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Vocabulary Diversity", nameKey: "signal.vocabularyDiversity",
            category: "statistical", score: 50, weight: 0.25,
            description: "Input too small for analysis",
            descriptionKey: "signal.vocabularyDiversity.error", icon: "📖",
        };
    }

    // Proxy vocabulary diversity via unique intensity pattern diversity
    // Human content tends to have more diverse micro-patterns
    const patchSize = 4;
    const patchesX = Math.floor(w / patchSize);
    const patchesY = Math.floor(h / patchSize);
    const patternSet = new Set<string>();
    let totalPatches = 0;

    const step = Math.max(1, Math.floor(patchesX * patchesY / 500));

    for (let py = 0; py < patchesY; py += step) {
        for (let px = 0; px < patchesX; px += step) {
            // Create a quantized pattern signature for each patch
            let signature = "";
            for (let y = py * patchSize; y < (py + 1) * patchSize; y++) {
                for (let x = px * patchSize; x < (px + 1) * patchSize; x++) {
                    const idx = (y * w + x) * 4;
                    const gray = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
                    // Quantize to 8 levels
                    signature += String.fromCharCode(Math.floor(gray / 32));
                }
            }
            patternSet.add(signature);
            totalPatches++;
        }
    }

    // Type-token ratio analog
    const diversity = totalPatches > 0 ? patternSet.size / totalPatches : 0;

    let score: number;
    if (diversity < 0.3) score = 70;
    else if (diversity < 0.5) score = 58;
    else if (diversity > 0.8) score = 25;
    else score = 42;

    return {
        name: "Vocabulary Diversity", nameKey: "signal.vocabularyDiversity",
        category: "statistical", score, weight: 0.25,
        description: score > 55
            ? "Low pattern diversity — repetitive structure suggests AI-generated content"
            : "High pattern diversity — consistent with naturally created content",
        descriptionKey: score > 55 ? "signal.vocabularyDiversity.ai" : "signal.vocabularyDiversity.real",
        icon: "📖",
        details: `Diversity ratio: ${diversity.toFixed(3)}, Unique patterns: ${patternSet.size}/${totalPatches}.`,
    };
}
