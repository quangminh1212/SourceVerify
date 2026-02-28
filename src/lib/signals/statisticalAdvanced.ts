/**
 * Statistical Analysis Signals (6 methods)
 * Based on information theory and statistical forensics
 *
 * References:
 * - Shannon, "A Mathematical Theory of Communication", BSTJ 1948
 * - Lyu & Farid, "Detecting Hidden Messages Using Higher-Order Statistical Models", ICIP 2002
 * - Zipf, "Human Behavior and the Principle of Least Effort", 1949
 */

import type { AnalysisMethod } from "../types";

function gray(pixels: Uint8ClampedArray, idx: number): number {
    return pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;
}

/**
 * Signal 26: Entropy Map Analysis
 * Shannon (1948) - Regional entropy distribution
 * AI images have less entropy variation across regions
 */
export function analyzeEntropyMap(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const blockSize = 32;
    const blocksX = Math.floor(width / blockSize);
    const blocksY = Math.floor(height / blockSize);
    const entropies: number[] = [];
    const step = Math.max(1, Math.floor(blocksX * blocksY / 300));

    for (let by = 0; by < blocksY; by += step) {
        for (let bx = 0; bx < blocksX; bx += step) {
            const hist = new Array(256).fill(0);
            let count = 0;
            for (let y = by * blockSize; y < (by + 1) * blockSize; y++) {
                for (let x = bx * blockSize; x < (bx + 1) * blockSize; x++) {
                    const g = Math.floor(gray(pixels, (y * width + x) * 4));
                    hist[Math.min(255, Math.max(0, g))]++;
                    count++;
                }
            }
            if (count > 0) {
                let entropy = 0;
                for (let i = 0; i < 256; i++) {
                    const p = hist[i] / count;
                    if (p > 0) entropy -= p * Math.log2(p);
                }
                entropies.push(entropy);
            }
        }
    }

    if (entropies.length < 4) {
        return {
            name: "Entropy Map", nameKey: "signal.entropyMap",
            category: "statistical", score: 50, weight: 0.5,
            description: "Insufficient data for entropy analysis",
            descriptionKey: "signal.entropy.error", icon: "Ⓗ",
        };
    }

    const mean = entropies.reduce((a, b) => a + b, 0) / entropies.length;
    const variance = entropies.reduce((a, b) => a + (b - mean) ** 2, 0) / entropies.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

    // AI images: more uniform entropy (lower CV)
    let score: number;
    if (cv < 0.08) score = 82;
    else if (cv < 0.15) score = 68;
    else if (cv < 0.25) score = 52;
    else if (cv < 0.40) score = 38;
    else if (cv < 0.60) score = 22;
    else score = 10;

    return {
        name: "Entropy Map", nameKey: "signal.entropyMap",
        category: "statistical", score, weight: 0.5,
        description: score > 55
            ? "Entropy distribution is too uniform — AI images lack natural information variation"
            : "Entropy distribution varies naturally — consistent with real scene content",
        descriptionKey: score > 55 ? "signal.entropy.ai" : "signal.entropy.real",
        icon: "Ⓗ",
        details: `Mean entropy: ${mean.toFixed(3)} bits, CV: ${cv.toFixed(3)}, Blocks: ${entropies.length}.`,
    };
}

/**
 * Signal 27: Higher-Order Statistics (Kurtosis & Skewness)
 * Lyu & Farid (ICIP 2002) - Higher-order statistical models
 * AI images have different kurtosis/skewness profiles in gradient domain
 */
export function analyzeHigherOrderStatistics(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const gradients: number[] = [];
    const step = Math.max(2, Math.floor(Math.min(width, height) / 250));

    for (let y = 0; y < height - 1; y += step) {
        for (let x = 0; x < width - 1; x += step) {
            const g1 = gray(pixels, (y * width + x) * 4);
            const g2 = gray(pixels, (y * width + x + 1) * 4);
            gradients.push(g2 - g1);
        }
    }

    if (gradients.length < 100) {
        return {
            name: "Higher-Order Statistics", nameKey: "signal.higherOrderStats",
            category: "statistical", score: 50, weight: 0.5,
            description: "Insufficient data for HOS analysis",
            descriptionKey: "signal.hos.error", icon: "μ",
        };
    }

    const n = gradients.length;
    const mean = gradients.reduce((a, b) => a + b, 0) / n;
    const m2 = gradients.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
    const m3 = gradients.reduce((a, b) => a + (b - mean) ** 3, 0) / n;
    const m4 = gradients.reduce((a, b) => a + (b - mean) ** 4, 0) / n;

    const std = Math.sqrt(m2);
    const skewness = std > 0 ? m3 / (std ** 3) : 0;
    const kurtosis = m2 > 0 ? m4 / (m2 * m2) : 3;

    // Natural images: gradient kurtosis >> 3 (heavy tails), skewness ≈ 0
    // AI images: kurtosis closer to 3 (more Gaussian)
    let score = 50;
    if (kurtosis < 5) score += 20;
    else if (kurtosis < 10) score += 10;
    else if (kurtosis > 50) score -= 20;
    else if (kurtosis > 25) score -= 12;
    else if (kurtosis > 15) score -= 5;

    // High absolute skewness is unusual
    if (Math.abs(skewness) > 2.0) score += 8;
    else if (Math.abs(skewness) > 1.0) score += 3;
    else if (Math.abs(skewness) < 0.1) score -= 5;

    score = Math.max(5, Math.min(95, score));

    return {
        name: "Higher-Order Statistics", nameKey: "signal.higherOrderStats",
        category: "statistical", score, weight: 0.5,
        description: score > 55
            ? "Gradient statistics are too Gaussian — natural images have heavier-tailed distributions"
            : "Gradient statistics show natural heavy-tailed distribution",
        descriptionKey: score > 55 ? "signal.hos.ai" : "signal.hos.real",
        icon: "μ",
        details: `Kurtosis: ${kurtosis.toFixed(2)}, Skewness: ${skewness.toFixed(3)}, Std: ${std.toFixed(2)}.`,
    };
}

/**
 * Signal 28: Zipf's Law Compliance
 * Zipf (1949) - Rank-frequency distribution in images
 * Natural images follow Zipf-like intensity distributions
 */
export function analyzeZipfLaw(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const histogram = new Array(256).fill(0);
    const totalPixels = width * height;
    const step = Math.max(1, Math.floor(totalPixels / 100000));

    for (let i = 0; i < totalPixels * 4; i += step * 4) {
        const g = Math.floor(gray(pixels, i));
        histogram[Math.min(255, Math.max(0, g))]++;
    }

    // Sort by frequency (descending)
    const sorted = histogram.filter(v => v > 0).sort((a, b) => b - a);
    if (sorted.length < 10) {
        return {
            name: "Zipf's Law", nameKey: "signal.zipfLaw",
            category: "statistical", score: 50, weight: 0.3,
            description: "Insufficient data for Zipf analysis",
            descriptionKey: "signal.zipf.error", icon: "ℤ",
        };
    }

    // Linear regression on log(rank) vs log(frequency)
    const logRank: number[] = [], logFreq: number[] = [];
    for (let r = 0; r < sorted.length; r++) {
        logRank.push(Math.log10(r + 1));
        logFreq.push(Math.log10(sorted[r]));
    }

    const n = logRank.length;
    const sumX = logRank.reduce((a, b) => a + b, 0);
    const sumY = logFreq.reduce((a, b) => a + b, 0);
    const sumXY = logRank.reduce((a, b, i) => a + b * logFreq[i], 0);
    const sumX2 = logRank.reduce((a, b) => a + b * b, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R² (goodness of fit)
    const meanY = sumY / n;
    let ssTot = 0, ssRes = 0;
    for (let i = 0; i < n; i++) {
        ssTot += (logFreq[i] - meanY) ** 2;
        const predicted = slope * logRank[i] + intercept;
        ssRes += (logFreq[i] - predicted) ** 2;
    }
    const rSquared = ssTot > 0 ? 1 - ssRes / ssTot : 0;

    // Natural images: slope ≈ -1 to -1.5, high R²
    // AI images: deviation from Zipf distribution
    let score: number;
    if (rSquared < 0.7) score = 75;
    else if (rSquared < 0.85 || slope > -0.3) score = 62;
    else if (rSquared > 0.95 && slope < -0.8 && slope > -1.8) score = 22;
    else if (rSquared > 0.90) score = 35;
    else score = 48;

    return {
        name: "Zipf's Law", nameKey: "signal.zipfLaw",
        category: "statistical", score, weight: 0.3,
        description: score > 55
            ? "Intensity distribution deviates from Zipf's law — potential AI generation artifact"
            : "Intensity distribution follows natural Zipf-like pattern",
        descriptionKey: score > 55 ? "signal.zipf.ai" : "signal.zipf.real",
        icon: "ℤ",
        details: `Zipf slope: ${slope.toFixed(3)}, R²: ${rSquared.toFixed(4)}.`,
    };
}

/**
 * Signal 29: Chi-Square Uniformity Test
 * Statistical test for pixel value distribution uniformity
 * AI images may exhibit more uniform or biased distributions
 */
export function analyzeChiSquareUniformity(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    // Analyze LSB (Least Significant Bit) distribution per channel
    const lsbCountR = [0, 0]; // 0 or 1
    const lsbCountG = [0, 0];
    const lsbCountB = [0, 0];
    let totalSamples = 0;
    const totalPixels = width * height;
    const step = Math.max(1, Math.floor(totalPixels / 80000));

    for (let i = 0; i < totalPixels * 4; i += step * 4) {
        lsbCountR[pixels[i] & 1]++;
        lsbCountG[pixels[i + 1] & 1]++;
        lsbCountB[pixels[i + 2] & 1]++;
        totalSamples++;
    }

    if (totalSamples < 100) {
        return {
            name: "Chi-Square Uniformity", nameKey: "signal.chiSquareUniformity",
            category: "statistical", score: 50, weight: 0.3,
            description: "Insufficient data for chi-square test",
            descriptionKey: "signal.chiSquare.error", icon: "χ²",
        };
    }

    // Chi-square test for LSB uniformity
    const expected = totalSamples / 2;
    const chiR = ((lsbCountR[0] - expected) ** 2 + (lsbCountR[1] - expected) ** 2) / expected;
    const chiG = ((lsbCountG[0] - expected) ** 2 + (lsbCountG[1] - expected) ** 2) / expected;
    const chiB = ((lsbCountB[0] - expected) ** 2 + (lsbCountB[1] - expected) ** 2) / expected;
    const avgChi = (chiR + chiG + chiB) / 3;

    // Very high chi-square = biased LSBs (common in AI)
    // Very low chi-square = perfectly uniform (also suspicious)
    let score: number;
    if (avgChi < 0.1) score = 72; // suspiciously uniform
    else if (avgChi < 1.0) score = 35; // natural range
    else if (avgChi < 5.0) score = 45; // mild bias
    else if (avgChi < 20.0) score = 62; // significant bias
    else score = 78; // very biased

    return {
        name: "Chi-Square Uniformity", nameKey: "signal.chiSquareUniformity",
        category: "statistical", score, weight: 0.3,
        description: score > 55
            ? "LSB distribution shows statistical anomaly — potential AI generation artifact"
            : "LSB distribution appears statistically natural",
        descriptionKey: score > 55 ? "signal.chiSquare.ai" : "signal.chiSquare.real",
        icon: "χ²",
        details: `χ² R: ${chiR.toFixed(3)}, G: ${chiG.toFixed(3)}, B: ${chiB.toFixed(3)}, Avg: ${avgChi.toFixed(3)}.`,
    };
}

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

/**
 * Signal 31: Saturation Distribution Analysis
 * HSL color space saturation statistics
 * AI images often have over/under-saturated color profiles
 */
export function analyzeSaturationDistribution(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const saturations: number[] = [];
    const totalPixels = width * height;
    const step = Math.max(1, Math.floor(totalPixels / 50000));

    for (let i = 0; i < totalPixels * 4; i += step * 4) {
        const r = pixels[i] / 255;
        const g = pixels[i + 1] / 255;
        const b = pixels[i + 2] / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const l = (max + min) / 2;
        let s = 0;
        if (max !== min) {
            s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
        }
        saturations.push(s);
    }

    if (saturations.length < 100) {
        return {
            name: "Saturation Distribution", nameKey: "signal.saturationDist",
            category: "statistical", score: 50, weight: 0.4,
            description: "Insufficient data for saturation analysis",
            descriptionKey: "signal.saturation.error", icon: "◆",
        };
    }

    const mean = saturations.reduce((a, b) => a + b, 0) / saturations.length;
    const variance = saturations.reduce((a, b) => a + (b - mean) ** 2, 0) / saturations.length;

    // Count peaks in saturation histogram
    const satHist = new Array(20).fill(0);
    for (const s of saturations) {
        const bin = Math.min(19, Math.floor(s * 20));
        satHist[bin]++;
    }

    // Count how many bins have significant content
    const threshold = saturations.length * 0.02;
    let activeBins = 0;
    for (const count of satHist) {
        if (count > threshold) activeBins++;
    }

    // AI images: less diverse saturation, higher mean saturation
    let score = 50;
    if (mean > 0.55) score += 15;
    else if (mean > 0.45) score += 8;
    else if (mean < 0.15) score -= 5;

    if (activeBins < 5) score += 12;
    else if (activeBins < 8) score += 5;
    else if (activeBins > 14) score -= 10;
    else if (activeBins > 11) score -= 5;

    if (variance < 0.02) score += 8;
    else if (variance > 0.08) score -= 8;

    score = Math.max(5, Math.min(95, score));

    return {
        name: "Saturation Distribution", nameKey: "signal.saturationDist",
        category: "statistical", score, weight: 0.4,
        description: score > 55
            ? "Saturation profile is abnormal — AI images exhibit biased color saturation"
            : "Saturation distribution is natural — consistent with real photography",
        descriptionKey: score > 55 ? "signal.saturation.ai" : "signal.saturation.real",
        icon: "◆",
        details: `Mean saturation: ${mean.toFixed(3)}, Variance: ${variance.toFixed(4)}, Active bins: ${activeBins}/20.`,
    };
}
