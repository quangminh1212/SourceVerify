/**
 * Method 52: Histogram Gradient Analysis
 * Farid, "Digital Image Forensics: A Booklet for Beginners", 2016
 * Studies smoothness/discontinuities in pixel value histograms — editing/AI leaves histogram gaps
 */

import type { AnalysisMethod } from "../types";

export function analyzeHistogramGradient(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    if (width < 16 || height < 16) {
        return {
            name: "Histogram Gradient", nameKey: "signal.histogramGradient",
            category: "statistical", score: 50, weight: 0.35,
            description: "Image too small for histogram gradient analysis",
            descriptionKey: "signal.histGrad.error", icon: "▥",
        };
    }

    const totalPixels = width * height;
    const step = Math.max(1, Math.floor(totalPixels / 100000));

    // Build luminance histogram
    const histogram = new Float32Array(256);
    let sampleCount = 0;

    for (let i = 0; i < totalPixels * 4; i += step * 4) {
        const lum = Math.round(0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2]);
        histogram[lum]++;
        sampleCount++;
    }

    // Normalize
    for (let i = 0; i < 256; i++) histogram[i] /= sampleCount;

    // Compute first-order gradient of histogram
    let gradientSum = 0;
    let gradientMax = 0;
    let zeroGapCount = 0; // consecutive zero bins (histogram gaps)
    let consecutiveZeros = 0;
    let maxConsecutiveZeros = 0;

    for (let i = 1; i < 255; i++) {
        const grad = Math.abs(histogram[i + 1] - histogram[i - 1]) / 2;
        gradientSum += grad;
        gradientMax = Math.max(gradientMax, grad);

        if (histogram[i] < 1e-7) {
            consecutiveZeros++;
            maxConsecutiveZeros = Math.max(maxConsecutiveZeros, consecutiveZeros);
        } else {
            if (consecutiveZeros > 0) zeroGapCount++;
            consecutiveZeros = 0;
        }
    }

    const avgGradient = gradientSum / 253;

    // Compute second-order smoothness (Laplacian of histogram)
    let laplacianSum = 0;
    for (let i = 1; i < 254; i++) {
        const lap = Math.abs(histogram[i + 1] - 2 * histogram[i] + histogram[i - 1]);
        laplacianSum += lap;
    }
    const avgLaplacian = laplacianSum / 252;

    // AI images: very smooth histograms, few gaps; edited: may have gaps from value manipulation
    // Real photos: natural histogram shape with smooth transitions
    let score = 50;

    // Very smooth = suspicious AI
    if (avgLaplacian < 0.00005) score += 15;
    else if (avgLaplacian < 0.0001) score += 8;
    else if (avgLaplacian > 0.001) score -= 5;

    // Histogram gaps suggest manipulation
    if (maxConsecutiveZeros > 10) score += 10;
    else if (maxConsecutiveZeros > 5) score += 5;
    else if (maxConsecutiveZeros === 0) score -= 3;

    // Very uniform gradient = AI
    if (avgGradient < 0.0005) score += 8;
    else if (avgGradient > 0.002) score -= 5;

    score = Math.max(5, Math.min(95, score));

    return {
        name: "Histogram Gradient", nameKey: "signal.histogramGradient",
        category: "statistical", score, weight: 0.35,
        description: score > 55
            ? "Histogram shows unnatural smoothness or gaps — AI images have atypical intensity distributions"
            : "Histogram gradient is natural — consistent with camera-captured intensity distribution",
        descriptionKey: score > 55 ? "signal.histGrad.ai" : "signal.histGrad.real",
        icon: "▥",
        details: `Avg gradient: ${avgGradient.toFixed(6)}, Avg Laplacian: ${avgLaplacian.toFixed(6)}, Max zero gap: ${maxConsecutiveZeros}.`,
    };
}
