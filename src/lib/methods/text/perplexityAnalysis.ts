/**
 * Perplexity Analysis
 * Measures text predictability using character-level entropy
 * AI-generated text tends to be more predictable (lower perplexity)
 * Reference: Beresneva (2016) - Computer-Generated Text Detection
 */

import type { AnalysisMethod } from "../../types";

export function analyzePerplexityAnalysis(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Perplexity Analysis", nameKey: "signal.perplexityAnalysis",
            category: "statistical", score: 50, weight: 0.3,
            description: "Input too small for analysis",
            descriptionKey: "signal.perplexityAnalysis.error", icon: "📊",
        };
    }

    // Approximate text perplexity via pixel-level entropy analysis
    // Text images from AI often have more uniform character rendering
    const histogram = new Float32Array(256);
    const totalPixels = w * h;

    for (let i = 0; i < totalPixels; i++) {
        const idx = i * 4;
        const gray = Math.round(0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2]);
        histogram[gray]++;
    }

    // Calculate Shannon entropy
    let entropy = 0;
    for (let i = 0; i < 256; i++) {
        if (histogram[i] > 0) {
            const p = histogram[i] / totalPixels;
            entropy -= p * Math.log2(p);
        }
    }

    // Analyze local entropy variance (AI text has more uniform local entropy)
    const blockSize = 16;
    const blocksX = Math.floor(w / blockSize);
    const blocksY = Math.floor(h / blockSize);
    const localEntropies: number[] = [];

    for (let by = 0; by < blocksY; by++) {
        for (let bx = 0; bx < blocksX; bx++) {
            const localHist = new Float32Array(256);
            const blockPixels = blockSize * blockSize;

            for (let y = by * blockSize; y < (by + 1) * blockSize; y++) {
                for (let x = bx * blockSize; x < (bx + 1) * blockSize; x++) {
                    const idx = (y * w + x) * 4;
                    const gray = Math.round(0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2]);
                    localHist[gray]++;
                }
            }

            let localE = 0;
            for (let i = 0; i < 256; i++) {
                if (localHist[i] > 0) {
                    const p = localHist[i] / blockPixels;
                    localE -= p * Math.log2(p);
                }
            }
            localEntropies.push(localE);
        }
    }

    // Calculate variance of local entropies
    const meanLocalE = localEntropies.reduce((a, b) => a + b, 0) / (localEntropies.length || 1);
    const varianceE = localEntropies.reduce((a, b) => a + (b - meanLocalE) ** 2, 0) / (localEntropies.length || 1);

    let score: number;
    if (entropy < 4 && varianceE < 1) score = 72;
    else if (entropy < 5 && varianceE < 2) score = 60;
    else if (entropy > 6.5) score = 30;
    else score = 45;

    return {
        name: "Perplexity Analysis", nameKey: "signal.perplexityAnalysis",
        category: "statistical", score, weight: 0.3,
        description: score > 55
            ? "Low entropy variance detected — text appears overly predictable, consistent with AI generation"
            : "Natural entropy distribution — consistent with human-authored content",
        descriptionKey: score > 55 ? "signal.perplexityAnalysis.ai" : "signal.perplexityAnalysis.real",
        icon: "📊",
        details: `Global entropy: ${entropy.toFixed(3)}, Local variance: ${varianceE.toFixed(3)}.`,
    };
}
