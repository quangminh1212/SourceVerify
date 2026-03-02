/**
 * Burstiness Detection
 * Analyzes burstiness patterns — human writing has variable bursts,
 * AI text tends to be more uniform in distribution
 * Reference: Mitchell et al. (2023) - DetectGPT
 */

import type { AnalysisMethod } from "../../types";

export function analyzeBurstinessDetection(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Burstiness Detection", nameKey: "signal.burstinessDetection",
            category: "statistical", score: 50, weight: 0.25,
            description: "Input too small for analysis",
            descriptionKey: "signal.burstinessDetection.error", icon: "💥",
        };
    }

    // Analyze spatial burstiness in horizontal scan lines
    // Human-written text images have bursty intensity patterns; AI is more uniform
    const sampleLines = Math.min(h, 64);
    const lineStep = Math.max(1, Math.floor(h / sampleLines));
    const runLengths: number[] = [];

    for (let y = 0; y < h; y += lineStep) {
        let runLen = 1;
        let prevIntensity = "low";

        for (let x = 1; x < w; x++) {
            const idx = (y * w + x) * 4;
            const gray = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
            const curIntensity = gray > 128 ? "high" : "low";

            if (curIntensity === prevIntensity) {
                runLen++;
            } else {
                runLengths.push(runLen);
                runLen = 1;
                prevIntensity = curIntensity;
            }
        }
        runLengths.push(runLen);
    }

    if (runLengths.length === 0) {
        return {
            name: "Burstiness Detection", nameKey: "signal.burstinessDetection",
            category: "statistical", score: 50, weight: 0.25,
            description: "Could not compute burstiness",
            descriptionKey: "signal.burstinessDetection.error", icon: "💥",
        };
    }

    // Calculate coefficient of variation (CV) of run lengths
    const mean = runLengths.reduce((a, b) => a + b, 0) / runLengths.length;
    const variance = runLengths.reduce((a, b) => a + (b - mean) ** 2, 0) / runLengths.length;
    const stdDev = Math.sqrt(variance);
    const cv = mean > 0 ? stdDev / mean : 0;

    // Low CV = uniform (AI-like), High CV = bursty (human-like)
    let score: number;
    if (cv < 0.5) score = 70;
    else if (cv < 0.8) score = 58;
    else if (cv > 1.5) score = 28;
    else score = 42;

    return {
        name: "Burstiness Detection", nameKey: "signal.burstinessDetection",
        category: "statistical", score, weight: 0.25,
        description: score > 55
            ? "Low burstiness — overly uniform distribution suggests AI-generated content"
            : "Natural burstiness pattern — consistent with human-created content",
        descriptionKey: score > 55 ? "signal.burstinessDetection.ai" : "signal.burstinessDetection.real",
        icon: "💥",
        details: `CV: ${cv.toFixed(3)}, Mean run: ${mean.toFixed(1)}, StdDev: ${stdDev.toFixed(1)}.`,
    };
}
