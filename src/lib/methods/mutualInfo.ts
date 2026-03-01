/**
 * Method 54: Mutual Information Analysis
 * Cover & Thomas, "Elements of Information Theory", Wiley 2006
 * Measures inter-channel information redundancy — AI images have different channel dependencies
 */

import type { AnalysisMethod } from "../types";

export function analyzeMutualInformation(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    if (width < 16 || height < 16) {
        return {
            name: "Mutual Information", nameKey: "signal.mutualInfo",
            category: "statistical", score: 50, weight: 0.35,
            description: "Image too small for mutual information analysis",
            descriptionKey: "signal.mi.error", icon: "⊛",
        };
    }

    const totalPixels = width * height;
    const step = Math.max(1, Math.floor(totalPixels / 60000));
    const bins = 32; // quantize to 32 levels per channel

    // Joint histograms for R-G, R-B, G-B pairs
    const jointRG = new Float32Array(bins * bins);
    const jointRB = new Float32Array(bins * bins);
    const jointGB = new Float32Array(bins * bins);
    const margR = new Float32Array(bins);
    const margG = new Float32Array(bins);
    const margB = new Float32Array(bins);
    let sampleCount = 0;

    for (let i = 0; i < totalPixels * 4; i += step * 4) {
        const rBin = Math.min(bins - 1, Math.floor(pixels[i] / (256 / bins)));
        const gBin = Math.min(bins - 1, Math.floor(pixels[i + 1] / (256 / bins)));
        const bBin = Math.min(bins - 1, Math.floor(pixels[i + 2] / (256 / bins)));

        jointRG[rBin * bins + gBin]++;
        jointRB[rBin * bins + bBin]++;
        jointGB[gBin * bins + bBin]++;
        margR[rBin]++;
        margG[gBin]++;
        margB[bBin]++;
        sampleCount++;
    }

    // Normalize
    for (let i = 0; i < bins; i++) {
        margR[i] /= sampleCount;
        margG[i] /= sampleCount;
        margB[i] /= sampleCount;
    }
    for (let i = 0; i < bins * bins; i++) {
        jointRG[i] /= sampleCount;
        jointRB[i] /= sampleCount;
        jointGB[i] /= sampleCount;
    }

    // Compute mutual information
    const computeMI = (joint: Float32Array, margX: Float32Array, margY: Float32Array): number => {
        let mi = 0;
        for (let x = 0; x < bins; x++) {
            for (let y = 0; y < bins; y++) {
                const pxy = joint[x * bins + y];
                const px = margX[x];
                const py = margY[y];
                if (pxy > 0 && px > 0 && py > 0) {
                    mi += pxy * Math.log2(pxy / (px * py));
                }
            }
        }
        return mi;
    };

    const miRG = computeMI(jointRG, margR, margG);
    const miRB = computeMI(jointRB, margR, margB);
    const miGB = computeMI(jointGB, margG, margB);

    const avgMI = (miRG + miRB + miGB) / 3;

    // Compute entropy of each channel for normalization
    const computeEntropy = (marg: Float32Array): number => {
        let h = 0;
        for (let i = 0; i < bins; i++) {
            if (marg[i] > 0) h -= marg[i] * Math.log2(marg[i]);
        }
        return h;
    };

    const hR = computeEntropy(margR);
    const hG = computeEntropy(margG);
    const hB = computeEntropy(margB);
    const avgEntropy = (hR + hG + hB) / 3;

    // Normalized MI: ratio of MI to average entropy
    const normalizedMI = avgEntropy > 0 ? avgMI / avgEntropy : 0;

    // AI images: often higher normalized MI (channels more correlated than natural)
    // or abnormally low MI (independent channels from non-natural rendering)
    let score: number;
    if (normalizedMI > 0.8) score = 72;
    else if (normalizedMI > 0.65) score = 60;
    else if (normalizedMI > 0.4) score = 42;
    else if (normalizedMI > 0.25) score = 32;
    else score = 68; // very low MI is also suspicious

    return {
        name: "Mutual Information", nameKey: "signal.mutualInfo",
        category: "statistical", score, weight: 0.35,
        description: score > 55
            ? "Channel mutual information is abnormal — AI images exhibit atypical inter-channel dependencies"
            : "Channel mutual information is natural — consistent with real-world color correlation",
        descriptionKey: score > 55 ? "signal.mi.ai" : "signal.mi.real",
        icon: "⊛",
        details: `MI R-G: ${miRG.toFixed(4)}, MI R-B: ${miRB.toFixed(4)}, MI G-B: ${miGB.toFixed(4)}, Normalized: ${normalizedMI.toFixed(4)}.`,
    };
}
