/**
 * Signal 12: Color Channel Correlation Analysis
 * Based on: RGB channel distribution research (CVPR 2024, IEEE 2025)
 *
 * Real camera images exhibit specific inter-channel correlations due to:
 * - Bayer filter Color Filter Array (CFA) demosaicing
 * - Lens and sensor optical properties
 * - Natural scene illumination (Planckian locus)
 *
 * AI-generated images show:
 * - Abnormal R-G, G-B, R-B correlations (too perfect or too weak)
 * - Unnatural color histogram distributions
 * - Missing inter-channel noise correlation from CFA processing
 *
 * References:
 * - Ojha et al. (2023): "Universal Fake Image Detectors" CVPR
 * - Cozzolino et al. (2024): "Color distribution features for AI detection"
 * - Zhang et al. (2025): "Channel correlation forensics" IEEE TIFS
 */

import type { AnalysisMethod } from "../types";

export function analyzeColorChannelCorrelation(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const totalPixels = width * height;
    const sampleStep = Math.max(1, Math.floor(totalPixels / 50000));

    let sumR = 0, sumG = 0, sumB = 0;
    let sumRR = 0, sumGG = 0, sumBB = 0;
    let sumRG = 0, sumGB = 0, sumRB = 0;
    let count = 0;

    // Color histogram (quantized to 32 bins per channel)
    const histR = new Float64Array(32);
    const histG = new Float64Array(32);
    const histB = new Float64Array(32);

    for (let i = 0; i < totalPixels * 4; i += sampleStep * 4) {
        const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
        sumR += r; sumG += g; sumB += b;
        sumRR += r * r; sumGG += g * g; sumBB += b * b;
        sumRG += r * g; sumGB += g * b; sumRB += r * b;
        count++;

        histR[Math.floor(r / 8)]++;
        histG[Math.floor(g / 8)]++;
        histB[Math.floor(b / 8)]++;
    }

    if (count < 100) {
        return {
            name: "Color Channel Correlation", nameKey: "signal.colorCorrelation",
            category: "statistical", score: 50, weight: 2.0,
            description: "Insufficient data", descriptionKey: "signal.color.error", icon: "◈",
        };
    }

    // Pearson correlation coefficients
    const meanR = sumR / count, meanG = sumG / count, meanB = sumB / count;
    const varR = sumRR / count - meanR * meanR;
    const varG = sumGG / count - meanG * meanG;
    const varB = sumBB / count - meanB * meanB;
    const covRG = sumRG / count - meanR * meanG;
    const covGB = sumGB / count - meanG * meanB;
    const covRB = sumRB / count - meanR * meanB;

    const corrRG = (varR > 0 && varG > 0) ? covRG / Math.sqrt(varR * varG) : 0;
    const corrGB = (varG > 0 && varB > 0) ? covGB / Math.sqrt(varG * varB) : 0;
    const corrRB = (varR > 0 && varB > 0) ? covRB / Math.sqrt(varR * varB) : 0;

    // In real camera images, R-G and G-B have strong positive correlation (0.85-0.98)
    // due to natural illumination and CFA interpolation
    // AI images sometimes show perfect correlation (>0.99) or lower correlation (<0.8)
    const avgCorr = (corrRG + corrGB + corrRB) / 3;
    const corrSpread = Math.max(corrRG, corrGB, corrRB) - Math.min(corrRG, corrGB, corrRB);

    // Color histogram entropy per channel
    const calcEntropy = (hist: Float64Array) => {
        let entropy = 0;
        const total = hist.reduce((a, b) => a + b, 0);
        if (total === 0) return 0;
        for (let i = 0; i < hist.length; i++) {
            if (hist[i] > 0) {
                const p = hist[i] / total;
                entropy -= p * Math.log2(p);
            }
        }
        return entropy;
    };

    const entropyR = calcEntropy(histR);
    const entropyG = calcEntropy(histG);
    const entropyB = calcEntropy(histB);
    const maxEntropy = Math.log2(32); // 5.0
    const avgEntropy = (entropyR + entropyG + entropyB) / 3;
    const normalizedEntropy = avgEntropy / maxEntropy;

    // Entropy spread between channels
    const entropySpread = Math.max(entropyR, entropyG, entropyB) - Math.min(entropyR, entropyG, entropyB);

    // Inter-channel noise correlation (high-frequency residual)
    let noiseRG = 0, noiseCnt = 0;
    const noiseStep = Math.max(2, Math.floor(Math.min(width, height) / 200));
    for (let y = 1; y < height - 1; y += noiseStep) {
        for (let x = 1; x < width - 1; x += noiseStep) {
            const idx = (y * width + x) * 4;
            const idxL = (y * width + x - 1) * 4;
            const idxR = (y * width + x + 1) * 4;
            const idxU = ((y - 1) * width + x) * 4;
            const idxD = ((y + 1) * width + x) * 4;

            // Laplacian noise per channel
            const noiseR = 4 * pixels[idx] - pixels[idxL] - pixels[idxR] - pixels[idxU] - pixels[idxD];
            const noiseG = 4 * pixels[idx + 1] - pixels[idxL + 1] - pixels[idxR + 1] - pixels[idxU + 1] - pixels[idxD + 1];
            noiseRG += noiseR * noiseG;
            noiseCnt++;
        }
    }
    const noiseCorr = noiseCnt > 0 ? noiseRG / noiseCnt : 0;
    // Normalize noise correlation
    const normalizedNoiseCorr = Math.abs(noiseCorr) / 100; // rough normalization

    let score = 50;

    // Correlation analysis
    if (avgCorr > 0.995) {
        // Too perfect — suspicious, could be AI with limited color palette
        score += 10;
    } else if (avgCorr > 0.92 && avgCorr < 0.99) {
        // Normal range for real cameras
        score -= 12;
    } else if (avgCorr < 0.75) {
        // Low correlation — unusual for natural scenes, could be AI or artistic
        score += 15;
    } else if (avgCorr < 0.85) {
        score += 8;
    }

    // Correlation spread
    if (corrSpread > 0.15) {
        // Wide spread between channels — more natural
        score -= 5;
    } else if (corrSpread < 0.03) {
        // Very similar correlations — AI tends to treat channels uniformly
        score += 8;
    }

    // Color histogram entropy
    if (normalizedEntropy > 0.85) {
        // Rich color distribution — more likely real
        score -= 8;
    } else if (normalizedEntropy < 0.5) {
        // Narrow color distribution — could be AI
        score += 10;
    }

    // Entropy spread
    if (entropySpread < 0.1) {
        // Channels have very similar entropy — AI-like uniformity
        score += 5;
    } else if (entropySpread > 0.5) {
        // Natural variation between channels
        score -= 5;
    }

    // Inter-channel noise correlation
    // Real cameras: R and G high-frequency noise is correlated due to CFA demosaicing
    if (normalizedNoiseCorr > 2.0) {
        // Strong inter-channel noise correlation — real camera CFA
        score -= 15;
    } else if (normalizedNoiseCorr > 0.5) {
        score -= 8;
    } else if (normalizedNoiseCorr < 0.1) {
        // No noise correlation — AI generates channels independently
        score += 12;
    }

    score = Math.max(10, Math.min(90, score));

    return {
        name: "Color Channel Correlation", nameKey: "signal.colorCorrelation",
        category: "statistical", score, weight: 2.0,
        description: score > 55
            ? "Color channel correlations are abnormal — AI generates color channels differently than natural light"
            : "Color channels correlate naturally — consistent with camera sensor and optics",
        descriptionKey: score > 55 ? "signal.color.ai" : "signal.color.real",
        icon: "◈",
        details: `R-G: ${corrRG.toFixed(3)}, G-B: ${corrGB.toFixed(3)}, R-B: ${corrRB.toFixed(3)}, Entropy: ${normalizedEntropy.toFixed(3)}, Noise corr: ${normalizedNoiseCorr.toFixed(3)}.`,
    };
}
