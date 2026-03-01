/**
 * Method: Histogram Distribution Analysis
 * Popescu & Farid (2005) — Statistical Tools for Digital Forensics
 * Analyzes color and luminance histogram distributions for anomalies
 * AI-generated images often produce unnaturally smooth or periodic patterns
 */

import type { AnalysisMethod } from "../types";

export function analyzeHistogramDistribution(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    if (width < 16 || height < 16) {
        return {
            name: "Histogram Analysis", nameKey: "signal.histogram",
            category: "statistical", score: 50, weight: 0.30,
            description: "Image too small for histogram analysis",
            descriptionKey: "signal.hist.error", icon: "📊",
        };
    }

    const totalPixels = width * height;
    const step = Math.max(1, Math.floor(totalPixels / 120000));

    // Build per-channel histograms: R, G, B, Luminance
    const histR = new Float64Array(256);
    const histG = new Float64Array(256);
    const histB = new Float64Array(256);
    const histL = new Float64Array(256);
    let sampleCount = 0;

    for (let i = 0; i < totalPixels * 4; i += step * 4) {
        const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
        histR[r]++;
        histG[g]++;
        histB[b]++;
        const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        histL[Math.min(255, lum)]++;
        sampleCount++;
    }

    // Normalize histograms
    for (let i = 0; i < 256; i++) {
        histR[i] /= sampleCount;
        histG[i] /= sampleCount;
        histB[i] /= sampleCount;
        histL[i] /= sampleCount;
    }

    // === Metric 1: Gap detection — count empty bins ===
    let gapCountL = 0, gapCountR = 0, gapCountG = 0, gapCountB = 0;
    // Only check inner range (5-250) to avoid edge effects
    for (let i = 5; i < 251; i++) {
        if (histL[i] < 1e-8) gapCountL++;
        if (histR[i] < 1e-8) gapCountR++;
        if (histG[i] < 1e-8) gapCountG++;
        if (histB[i] < 1e-8) gapCountB++;
    }
    const avgGaps = (gapCountL + gapCountR + gapCountG + gapCountB) / 4;

    // === Metric 2: Smoothness — variance of first-order differences ===
    function computeSmoothness(hist: Float64Array): number {
        const diffs: number[] = [];
        for (let i = 1; i < 255; i++) {
            diffs.push(hist[i + 1] - hist[i]);
        }
        const mean = diffs.reduce((s, v) => s + v, 0) / diffs.length;
        const variance = diffs.reduce((s, v) => s + (v - mean) ** 2, 0) / diffs.length;
        return variance;
    }

    const smoothL = computeSmoothness(histL);
    const smoothR = computeSmoothness(histR);
    const smoothG = computeSmoothness(histG);
    const smoothB = computeSmoothness(histB);
    const avgSmoothness = (smoothL + smoothR + smoothG + smoothB) / 4;

    // === Metric 3: Kurtosis — peakedness of distribution ===
    function computeKurtosis(hist: Float64Array): number {
        let mean = 0, n = 0;
        for (let i = 0; i < 256; i++) { mean += i * hist[i]; n += hist[i]; }
        mean /= n;
        let m2 = 0, m4 = 0;
        for (let i = 0; i < 256; i++) {
            const d = (i - mean);
            m2 += hist[i] * d * d;
            m4 += hist[i] * d * d * d * d;
        }
        m2 /= n; m4 /= n;
        return m2 > 1e-10 ? (m4 / (m2 * m2)) - 3 : 0;
    }

    const kurtosisL = computeKurtosis(histL);

    // === Metric 4: Entropy of luminance histogram ===
    let entropy = 0;
    for (let i = 0; i < 256; i++) {
        if (histL[i] > 1e-10) {
            entropy -= histL[i] * Math.log2(histL[i]);
        }
    }

    // === Metric 5: Periodicity detection ===
    let periodicityScore = 0;
    for (let period = 2; period <= 8; period++) {
        let correlation = 0;
        let count = 0;
        for (let i = period; i < 256; i++) {
            const diff = Math.abs(histL[i] - histL[i - period]);
            const maxVal = Math.max(histL[i], histL[i - period]);
            if (maxVal > 1e-8) {
                correlation += 1 - (diff / (maxVal + 1e-10));
                count++;
            }
        }
        if (count > 0) {
            periodicityScore = Math.max(periodicityScore, correlation / count);
        }
    }

    // === Scoring ===
    let score = 50;

    // Gap analysis: many gaps → possible manipulation, very few gaps → possible AI
    if (avgGaps < 5) score += 10;       // Too few gaps — AI generates smooth distributions
    else if (avgGaps > 80) score += 8;  // Many gaps — heavy manipulation
    else if (avgGaps > 30) score -= 3;  // Moderate gaps — natural for 8-bit images

    // Smoothness: very smooth → AI typical
    if (avgSmoothness < 1e-8) score += 12;
    else if (avgSmoothness < 1e-6) score += 6;
    else if (avgSmoothness > 1e-4) score -= 5;

    // Kurtosis: extreme values suggest AI
    if (Math.abs(kurtosisL) > 10) score += 5;
    else if (Math.abs(kurtosisL) < 0.5) score += 3;

    // Entropy: AI images tend to have specific entropy ranges
    if (entropy < 4.0) score += 5;
    else if (entropy > 7.5) score -= 3;

    // Periodicity: high periodicity → quantization / AI
    if (periodicityScore > 0.95) score += 8;
    else if (periodicityScore > 0.9) score += 4;

    score = Math.max(5, Math.min(95, score));

    return {
        name: "Histogram Analysis", nameKey: "signal.histogram",
        category: "statistical", score, weight: 0.30,
        description: score > 55
            ? "Histogram distributions show anomalies — AI images have unnaturally smooth or periodic patterns"
            : "Histogram distributions appear natural — consistent with camera-captured image characteristics",
        descriptionKey: score > 55 ? "signal.hist.ai" : "signal.hist.real",
        icon: "📊",
        details: `Gaps: ${avgGaps.toFixed(1)}, Smoothness: ${avgSmoothness.toExponential(2)}, Kurtosis: ${kurtosisL.toFixed(2)}, Entropy: ${entropy.toFixed(2)}, Periodicity: ${periodicityScore.toFixed(3)}.`,
    };
}
