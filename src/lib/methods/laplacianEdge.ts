/**
 * Method 55: Laplacian Edge Sharpness
 * Based on image quality assessment research:
 * - Wang et al., "Image Quality Assessment: From Error Visibility to Structural Similarity", IEEE TIP 2004
 * - Marziliano et al., "A No-Reference Perceptual Blur Metric", ICIP 2002
 * Analyzes Laplacian edge response distribution to distinguish AI from camera capture
 */

import type { AnalysisMethod } from "../types";

export function analyzeLaplacianEdge(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    if (width < 16 || height < 16) {
        return {
            name: "Laplacian Edge Sharpness", nameKey: "signal.laplacianEdge",
            category: "spatial", score: 50, weight: 0.35,
            description: "Image too small for Laplacian edge analysis",
            descriptionKey: "signal.laplacian.error", icon: "◆",
        };
    }

    const totalPixels = width * height;
    const step = Math.max(1, Math.floor(Math.sqrt(totalPixels / 50000)));

    // Compute Laplacian magnitude histogram
    const lapBins = 128;
    const lapHist = new Float32Array(lapBins);
    let lapCount = 0;
    let lapSum = 0;
    let lapSumSq = 0;
    let maxLap = 0;

    for (let y = 1; y < height - 1; y += step) {
        for (let x = 1; x < width - 1; x += step) {
            const idx = (y * width + x) * 4;
            const center = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];

            // 4-connected Laplacian
            const top = 0.299 * pixels[((y - 1) * width + x) * 4] + 0.587 * pixels[((y - 1) * width + x) * 4 + 1] + 0.114 * pixels[((y - 1) * width + x) * 4 + 2];
            const bot = 0.299 * pixels[((y + 1) * width + x) * 4] + 0.587 * pixels[((y + 1) * width + x) * 4 + 1] + 0.114 * pixels[((y + 1) * width + x) * 4 + 2];
            const left = 0.299 * pixels[(y * width + x - 1) * 4] + 0.587 * pixels[(y * width + x - 1) * 4 + 1] + 0.114 * pixels[(y * width + x - 1) * 4 + 2];
            const right = 0.299 * pixels[(y * width + x + 1) * 4] + 0.587 * pixels[(y * width + x + 1) * 4 + 1] + 0.114 * pixels[(y * width + x + 1) * 4 + 2];

            const lap = Math.abs(top + bot + left + right - 4 * center);
            const bin = Math.min(lapBins - 1, Math.floor(lap));
            lapHist[bin]++;
            lapSum += lap;
            lapSumSq += lap * lap;
            maxLap = Math.max(maxLap, lap);
            lapCount++;
        }
    }

    if (lapCount === 0) {
        return {
            name: "Laplacian Edge Sharpness", nameKey: "signal.laplacianEdge",
            category: "spatial", score: 50, weight: 0.35,
            description: "Insufficient data for Laplacian analysis",
            descriptionKey: "signal.laplacian.error", icon: "◆",
        };
    }

    const lapMean = lapSum / lapCount;
    const lapVar = lapSumSq / lapCount - lapMean * lapMean;
    const lapStd = Math.sqrt(Math.max(0, lapVar));
    const cv = lapMean > 0 ? lapStd / lapMean : 0;

    // Compute histogram kurtosis
    let sum4 = 0;
    for (let y = 1; y < height - 1; y += step) {
        for (let x = 1; x < width - 1; x += step) {
            const idx = (y * width + x) * 4;
            const center = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
            const top = 0.299 * pixels[((y - 1) * width + x) * 4] + 0.587 * pixels[((y - 1) * width + x) * 4 + 1] + 0.114 * pixels[((y - 1) * width + x) * 4 + 2];
            const bot = 0.299 * pixels[((y + 1) * width + x) * 4] + 0.587 * pixels[((y + 1) * width + x) * 4 + 1] + 0.114 * pixels[((y + 1) * width + x) * 4 + 2];
            const left = 0.299 * pixels[(y * width + x - 1) * 4] + 0.587 * pixels[(y * width + x - 1) * 4 + 1] + 0.114 * pixels[(y * width + x - 1) * 4 + 2];
            const right = 0.299 * pixels[(y * width + x + 1) * 4] + 0.587 * pixels[(y * width + x + 1) * 4 + 1] + 0.114 * pixels[(y * width + x + 1) * 4 + 2];
            const lap = Math.abs(top + bot + left + right - 4 * center);
            sum4 += (lap - lapMean) ** 4;
        }
    }
    const kurtosis = lapVar > 0 ? (sum4 / lapCount) / (lapVar * lapVar) : 3;

    // AI images: lower Laplacian mean (smoother), lower CV, lower kurtosis
    // Real images: higher and more variable Laplacian response (natural edges + sensor noise)
    let score = 50;

    if (lapMean < 2) score += 15;
    else if (lapMean < 5) score += 8;
    else if (lapMean > 15) score -= 8;
    else if (lapMean > 10) score -= 3;

    if (cv < 1.0) score += 8;
    else if (cv > 2.5) score -= 6;

    if (kurtosis < 5) score += 5;
    else if (kurtosis > 20) score -= 5;

    score = Math.max(5, Math.min(95, score));

    return {
        name: "Laplacian Edge Sharpness", nameKey: "signal.laplacianEdge",
        category: "spatial", score, weight: 0.35,
        description: score > 55
            ? "Laplacian response is unusually low — AI images have suppressed high-frequency edge detail"
            : "Laplacian edge response is natural — consistent with camera sensor sharpness and noise",
        descriptionKey: score > 55 ? "signal.laplacian.ai" : "signal.laplacian.real",
        icon: "◆",
        details: `Lap mean: ${lapMean.toFixed(3)}, CV: ${cv.toFixed(3)}, Kurtosis: ${kurtosis.toFixed(2)}, Max: ${maxLap.toFixed(1)}.`,
    };
}
