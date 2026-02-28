/**
 * Spatial Domain Analysis Signals (6 methods)
 * Based on peer-reviewed research in image forensics
 *
 * References:
 * - Ojala et al., "Multiresolution Gray-Scale and Rotation Invariant Texture Classification with LBP", IEEE PAMI 2002
 * - Dalal & Triggs, "Histograms of Oriented Gradients for Human Detection", CVPR 2005
 * - Haralick et al., "Textural Features for Image Classification", IEEE SMC 1973
 * - Chen et al., "WLD: A Robust Local Image Descriptor", IEEE PAMI 2010
 */

import type { AnalysisSignal } from "../types";

// Helper: convert pixel to grayscale
function gray(pixels: Uint8ClampedArray, idx: number): number {
    return pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;
}

/**
 * Signal 14: Local Binary Pattern (LBP) Analysis
 * Ojala et al. (IEEE PAMI 2002) - Texture micro-patterns
 * AI images tend to have less diverse LBP patterns than natural images
 */
export function analyzeLocalBinaryPattern(pixels: Uint8ClampedArray, width: number, height: number): AnalysisSignal {
    const lbpHistogram = new Array(256).fill(0);
    let totalSamples = 0;
    const step = Math.max(2, Math.floor(Math.min(width, height) / 200));

    for (let y = 1; y < height - 1; y += step) {
        for (let x = 1; x < width - 1; x += step) {
            const center = gray(pixels, (y * width + x) * 4);
            let lbp = 0;
            // 8-neighbor LBP
            const neighbors = [
                [-1, -1], [-1, 0], [-1, 1], [0, 1],
                [1, 1], [1, 0], [1, -1], [0, -1]
            ];
            for (let i = 0; i < 8; i++) {
                const ny = y + neighbors[i][0], nx = x + neighbors[i][1];
                const val = gray(pixels, (ny * width + nx) * 4);
                if (val >= center) lbp |= (1 << i);
            }
            lbpHistogram[lbp]++;
            totalSamples++;
        }
    }

    // Calculate LBP uniformity - ratio of uniform patterns (transitions <= 2)
    let uniformCount = 0;
    for (let i = 0; i < 256; i++) {
        let bits = i;
        let transitions = 0;
        for (let b = 0; b < 8; b++) {
            const curr = (bits >> b) & 1;
            const next = (bits >> ((b + 1) % 8)) & 1;
            if (curr !== next) transitions++;
        }
        if (transitions <= 2) uniformCount += lbpHistogram[i];
    }
    const uniformRatio = totalSamples > 0 ? uniformCount / totalSamples : 0;

    // Calculate entropy of LBP distribution
    let lbpEntropy = 0;
    for (let i = 0; i < 256; i++) {
        const p = totalSamples > 0 ? lbpHistogram[i] / totalSamples : 0;
        if (p > 0) lbpEntropy -= p * Math.log2(p);
    }

    // AI images: higher uniform ratio (smoother textures), lower entropy
    let score: number;
    if (uniformRatio > 0.92 && lbpEntropy < 4.5) score = 82;
    else if (uniformRatio > 0.88) score = 70;
    else if (uniformRatio > 0.82) score = 55;
    else if (uniformRatio > 0.75) score = 42;
    else if (uniformRatio > 0.65) score = 28;
    else score = 15;

    return {
        name: "Local Binary Pattern", nameKey: "signal.localBinaryPattern",
        category: "spatial", score, weight: 0.6,
        description: score > 55
            ? "LBP texture patterns lack diversity — characteristic of AI-generated surfaces"
            : "LBP texture shows natural diversity — consistent with real photography",
        descriptionKey: score > 55 ? "signal.lbp.ai" : "signal.lbp.real",
        icon: "⊞",
        details: `Uniform ratio: ${uniformRatio.toFixed(3)}, LBP entropy: ${lbpEntropy.toFixed(2)} bits, Samples: ${totalSamples}.`,
    };
}

/**
 * Signal 15: Histogram of Oriented Gradients (HOG) Anomaly
 * Dalal & Triggs (CVPR 2005) - Gradient orientation distribution
 * AI images exhibit more uniform gradient orientations than natural scenes
 */
export function analyzeHOGAnomaly(pixels: Uint8ClampedArray, width: number, height: number): AnalysisSignal {
    const numBins = 9;
    const binSize = Math.PI / numBins;
    const globalHist = new Array(numBins).fill(0);
    let totalMag = 0;
    const step = Math.max(2, Math.floor(Math.min(width, height) / 200));

    for (let y = 1; y < height - 1; y += step) {
        for (let x = 1; x < width - 1; x += step) {
            const idx = (y * width + x) * 4;
            const gx = gray(pixels, (y * width + x + 1) * 4) - gray(pixels, (y * width + x - 1) * 4);
            const gy = gray(pixels, ((y + 1) * width + x) * 4) - gray(pixels, ((y - 1) * width + x) * 4);
            const mag = Math.sqrt(gx * gx + gy * gy);
            let angle = Math.atan2(gy, gx);
            if (angle < 0) angle += Math.PI; // unsigned orientation [0, PI]
            const bin = Math.min(numBins - 1, Math.floor(angle / binSize));
            globalHist[bin] += mag;
            totalMag += mag;
        }
    }

    // Normalize
    if (totalMag > 0) {
        for (let i = 0; i < numBins; i++) globalHist[i] /= totalMag;
    }

    // HOG entropy - higher entropy = more uniform = more AI-like
    let hogEntropy = 0;
    for (let i = 0; i < numBins; i++) {
        if (globalHist[i] > 0) hogEntropy -= globalHist[i] * Math.log2(globalHist[i]);
    }
    const maxEntropy = Math.log2(numBins); // ~3.17
    const normalizedEntropy = hogEntropy / maxEntropy;

    // Peak dominance - real images have more dominant orientations
    const maxBin = Math.max(...globalHist);
    const peakDominance = maxBin / (1 / numBins); // ratio to uniform

    let score: number;
    if (normalizedEntropy > 0.97 && peakDominance < 1.1) score = 80;
    else if (normalizedEntropy > 0.94) score = 68;
    else if (normalizedEntropy > 0.88) score = 52;
    else if (normalizedEntropy > 0.80) score = 38;
    else if (normalizedEntropy > 0.70) score = 25;
    else score = 12;

    return {
        name: "HOG Anomaly", nameKey: "signal.hogAnomaly",
        category: "spatial", score, weight: 0.5,
        description: score > 55
            ? "Gradient orientations are unusually uniform — typical of AI generation"
            : "Gradient orientations show natural variation — consistent with real scenes",
        descriptionKey: score > 55 ? "signal.hog.ai" : "signal.hog.real",
        icon: "⊠",
        details: `HOG entropy: ${hogEntropy.toFixed(3)} (norm: ${normalizedEntropy.toFixed(3)}), Peak dominance: ${peakDominance.toFixed(3)}.`,
    };
}

/**
 * Signal 16: Gray Level Co-occurrence Matrix (GLCM)
 * Haralick et al. (IEEE SMC 1973) - Texture feature extraction
 * Analyzes spatial relationships between pixel intensity levels
 */
export function analyzeGLCM(pixels: Uint8ClampedArray, width: number, height: number): AnalysisSignal {
    const levels = 16; // quantize to 16 levels for efficiency
    const glcm = Array.from({ length: levels }, () => new Array(levels).fill(0));
    let total = 0;
    const step = Math.max(2, Math.floor(Math.min(width, height) / 200));

    // Horizontal co-occurrence (d=1, θ=0)
    for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width - 1; x += step) {
            const g1 = Math.min(levels - 1, Math.floor(gray(pixels, (y * width + x) * 4) / 256 * levels));
            const g2 = Math.min(levels - 1, Math.floor(gray(pixels, (y * width + x + 1) * 4) / 256 * levels));
            glcm[g1][g2]++;
            glcm[g2][g1]++; // symmetric
            total += 2;
        }
    }

    // Normalize
    if (total > 0) {
        for (let i = 0; i < levels; i++)
            for (let j = 0; j < levels; j++)
                glcm[i][j] /= total;
    }

    // Haralick features: contrast, energy, homogeneity, correlation
    let contrast = 0, energy = 0, homogeneity = 0;
    let muI = 0, muJ = 0;
    for (let i = 0; i < levels; i++) {
        for (let j = 0; j < levels; j++) {
            contrast += (i - j) ** 2 * glcm[i][j];
            energy += glcm[i][j] ** 2;
            homogeneity += glcm[i][j] / (1 + Math.abs(i - j));
            muI += i * glcm[i][j];
            muJ += j * glcm[i][j];
        }
    }

    // AI images: higher homogeneity, higher energy (smoother), lower contrast
    let score = 50;
    if (homogeneity > 0.85) score += 15;
    else if (homogeneity > 0.75) score += 8;
    else if (homogeneity < 0.50) score -= 12;
    else if (homogeneity < 0.60) score -= 6;

    if (energy > 0.15) score += 12;
    else if (energy > 0.08) score += 5;
    else if (energy < 0.02) score -= 10;

    if (contrast < 5) score += 10;
    else if (contrast < 15) score += 3;
    else if (contrast > 50) score -= 12;
    else if (contrast > 30) score -= 6;

    score = Math.max(5, Math.min(95, score));

    return {
        name: "GLCM Texture", nameKey: "signal.glcmTexture",
        category: "spatial", score, weight: 0.5,
        description: score > 55
            ? "GLCM features indicate overly smooth texture — typical of AI generation"
            : "GLCM texture features are consistent with natural image characteristics",
        descriptionKey: score > 55 ? "signal.glcm.ai" : "signal.glcm.real",
        icon: "▣",
        details: `Contrast: ${contrast.toFixed(2)}, Energy: ${energy.toFixed(4)}, Homogeneity: ${homogeneity.toFixed(3)}.`,
    };
}

/**
 * Signal 17: Local Variance Map Analysis
 * Measures consistency of local pixel variance across image regions
 * AI images exhibit more homogeneous variance maps
 */
export function analyzeLocalVarianceMap(pixels: Uint8ClampedArray, width: number, height: number): AnalysisSignal {
    const blockSize = 16;
    const blocksX = Math.floor(width / blockSize);
    const blocksY = Math.floor(height / blockSize);
    const variances: number[] = [];
    const step = Math.max(1, Math.floor(blocksX * blocksY / 400));

    for (let by = 0; by < blocksY; by += step) {
        for (let bx = 0; bx < blocksX; bx += step) {
            let sum = 0, sum2 = 0, count = 0;
            for (let y = by * blockSize; y < (by + 1) * blockSize; y++) {
                for (let x = bx * blockSize; x < (bx + 1) * blockSize; x++) {
                    const g = gray(pixels, (y * width + x) * 4);
                    sum += g;
                    sum2 += g * g;
                    count++;
                }
            }
            if (count > 0) {
                const mean = sum / count;
                const variance = sum2 / count - mean * mean;
                variances.push(variance);
            }
        }
    }

    if (variances.length < 4) {
        return {
            name: "Local Variance Map", nameKey: "signal.localVarianceMap",
            category: "spatial", score: 50, weight: 0.5,
            description: "Insufficient data for local variance analysis",
            descriptionKey: "signal.localVariance.error", icon: "◈",
        };
    }

    const avgVar = variances.reduce((a, b) => a + b, 0) / variances.length;
    const varOfVar = variances.reduce((a, b) => a + (b - avgVar) ** 2, 0) / variances.length;
    const cvOfVar = avgVar > 0 ? Math.sqrt(varOfVar) / avgVar : 0;

    // AI images: more uniform variance (lower CV)
    let score: number;
    if (cvOfVar < 0.3) score = 82;
    else if (cvOfVar < 0.5) score = 68;
    else if (cvOfVar < 0.8) score = 52;
    else if (cvOfVar < 1.2) score = 38;
    else if (cvOfVar < 1.8) score = 25;
    else score = 12;

    return {
        name: "Local Variance Map", nameKey: "signal.localVarianceMap",
        category: "spatial", score, weight: 0.5,
        description: score > 55
            ? "Local variance is unusually uniform — AI images lack natural variance variation"
            : "Local variance varies naturally across the image — consistent with real capture",
        descriptionKey: score > 55 ? "signal.localVariance.ai" : "signal.localVariance.real",
        icon: "◈",
        details: `Avg variance: ${avgVar.toFixed(2)}, CV of variance: ${cvOfVar.toFixed(3)}, Blocks: ${variances.length}.`,
    };
}

/**
 * Signal 18: Morphological Gradient Analysis
 * Mathematical morphology patterns in image structure
 * Analyzes dilation-erosion difference patterns
 */
export function analyzeMorphologicalGradient(pixels: Uint8ClampedArray, width: number, height: number): AnalysisSignal {
    const gradients: number[] = [];
    const step = Math.max(2, Math.floor(Math.min(width, height) / 200));

    for (let y = 1; y < height - 1; y += step) {
        for (let x = 1; x < width - 1; x += step) {
            // 3x3 structuring element
            let maxVal = 0, minVal = 255;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const g = gray(pixels, ((y + dy) * width + (x + dx)) * 4);
                    maxVal = Math.max(maxVal, g);
                    minVal = Math.min(minVal, g);
                }
            }
            gradients.push(maxVal - minVal); // morphological gradient
        }
    }

    if (gradients.length < 10) {
        return {
            name: "Morphological Gradient", nameKey: "signal.morphGradient",
            category: "spatial", score: 50, weight: 0.4,
            description: "Insufficient data for morphological analysis",
            descriptionKey: "signal.morph.error", icon: "⊖",
        };
    }

    const sorted = [...gradients].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const p90 = sorted[Math.floor(sorted.length * 0.9)];
    const p10 = sorted[Math.floor(sorted.length * 0.1)];
    const iqr = p90 - p10;
    const mean = gradients.reduce((a, b) => a + b, 0) / gradients.length;

    // AI images: narrower morphological gradient distribution
    let score: number;
    if (median < 3 && iqr < 8) score = 80;
    else if (median < 5 && iqr < 15) score = 68;
    else if (median < 10) score = 52;
    else if (median < 20) score = 38;
    else if (median < 35) score = 22;
    else score = 10;

    return {
        name: "Morphological Gradient", nameKey: "signal.morphGradient",
        category: "spatial", score, weight: 0.4,
        description: score > 55
            ? "Morphological gradients are too narrow — AI images lack micro-detail transitions"
            : "Morphological gradients show natural range — consistent with real camera capture",
        descriptionKey: score > 55 ? "signal.morph.ai" : "signal.morph.real",
        icon: "⊖",
        details: `Median grad: ${median.toFixed(1)}, IQR: ${iqr.toFixed(1)}, Mean: ${mean.toFixed(1)}.`,
    };
}

/**
 * Signal 19: Weber Local Descriptor (WLD)
 * Chen et al. (IEEE PAMI 2010) - Robust local image descriptor
 * Combines differential excitation and gradient orientation
 */
export function analyzeWeberDescriptor(pixels: Uint8ClampedArray, width: number, height: number): AnalysisSignal {
    const excitations: number[] = [];
    const step = Math.max(2, Math.floor(Math.min(width, height) / 200));

    for (let y = 1; y < height - 1; y += step) {
        for (let x = 1; x < width - 1; x += step) {
            const center = gray(pixels, (y * width + x) * 4);
            if (center < 1) continue; // avoid division by zero

            // Sum of differences with 8-neighbors
            let diffSum = 0;
            const neighbors = [
                [-1, -1], [-1, 0], [-1, 1], [0, -1],
                [0, 1], [1, -1], [1, 0], [1, 1]
            ];
            for (const [dy, dx] of neighbors) {
                const neighbor = gray(pixels, ((y + dy) * width + (x + dx)) * 4);
                diffSum += neighbor - center;
            }

            // Weber's differential excitation
            const excitation = Math.atan(diffSum / center);
            excitations.push(Math.abs(excitation));
        }
    }

    if (excitations.length < 10) {
        return {
            name: "Weber Descriptor", nameKey: "signal.weberDescriptor",
            category: "spatial", score: 50, weight: 0.4,
            description: "Insufficient data for Weber analysis",
            descriptionKey: "signal.weber.error", icon: "⊗",
        };
    }

    const mean = excitations.reduce((a, b) => a + b, 0) / excitations.length;
    const variance = excitations.reduce((a, b) => a + (b - mean) ** 2, 0) / excitations.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

    // AI images: lower mean excitation and lower variance (smoother)
    let score: number;
    if (mean < 0.05 && cv < 0.8) score = 82;
    else if (mean < 0.10) score = 70;
    else if (mean < 0.20) score = 55;
    else if (mean < 0.35) score = 40;
    else if (mean < 0.55) score = 25;
    else score = 12;

    return {
        name: "Weber Descriptor", nameKey: "signal.weberDescriptor",
        category: "spatial", score, weight: 0.4,
        description: score > 55
            ? "Weber excitation is unusually low — AI images lack natural intensity transitions"
            : "Weber excitation shows natural variation — consistent with real image detail",
        descriptionKey: score > 55 ? "signal.weber.ai" : "signal.weber.real",
        icon: "⊗",
        details: `Mean excitation: ${mean.toFixed(4)}, CV: ${cv.toFixed(3)}, Samples: ${excitations.length}.`,
    };
}
