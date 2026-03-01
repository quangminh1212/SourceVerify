/**
 * Method 47: Rich Pixel Co-occurrence Model
 * Fridrich & Kodovský, "Rich Models for Steganalysis of Digital Images", IEEE TIFS 2012
 * Higher-order co-occurrence statistics for detecting AI vs. camera images
 */

import type { AnalysisMethod } from "../types";

export function analyzePixelCooccurrence(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    if (width < 16 || height < 16) {
        return {
            name: "Pixel Co-occurrence", nameKey: "signal.pixelCooccurrence",
            category: "forensic", score: 50, weight: 0.4,
            description: "Image too small for co-occurrence analysis",
            descriptionKey: "signal.cooccurrence.error", icon: "⊡",
        };
    }

    const totalPixels = width * height;
    const step = Math.max(1, Math.floor(Math.sqrt(totalPixels / 80000)));

    const T = 3;
    const size = 2 * T + 1;
    const hCooccur = new Float32Array(size * size);
    const vCooccur = new Float32Array(size * size);
    let hCount = 0, vCount = 0;

    for (let y = 0; y < height; y += step) {
        for (let x = 1; x < width - 1; x += step) {
            const idx = (y * width + x) * 4;
            const gray = Math.round(0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2]);
            const prevIdx = (y * width + x - 1) * 4;
            const prevGray = Math.round(0.299 * pixels[prevIdx] + 0.587 * pixels[prevIdx + 1] + 0.114 * pixels[prevIdx + 2]);
            const nextIdx = (y * width + x + 1) * 4;
            const nextGray = Math.round(0.299 * pixels[nextIdx] + 0.587 * pixels[nextIdx + 1] + 0.114 * pixels[nextIdx + 2]);

            const r1 = Math.max(-T, Math.min(T, gray - prevGray));
            const r2 = Math.max(-T, Math.min(T, nextGray - gray));
            hCooccur[(r1 + T) * size + (r2 + T)]++;
            hCount++;
        }
    }

    for (let y = 1; y < height - 1; y += step) {
        for (let x = 0; x < width; x += step) {
            const idx = (y * width + x) * 4;
            const gray = Math.round(0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2]);
            const topIdx = ((y - 1) * width + x) * 4;
            const topGray = Math.round(0.299 * pixels[topIdx] + 0.587 * pixels[topIdx + 1] + 0.114 * pixels[topIdx + 2]);
            const botIdx = ((y + 1) * width + x) * 4;
            const botGray = Math.round(0.299 * pixels[botIdx] + 0.587 * pixels[botIdx + 1] + 0.114 * pixels[botIdx + 2]);

            const r1 = Math.max(-T, Math.min(T, gray - topGray));
            const r2 = Math.max(-T, Math.min(T, botGray - gray));
            vCooccur[(r1 + T) * size + (r2 + T)]++;
            vCount++;
        }
    }

    if (hCount > 0) for (let i = 0; i < hCooccur.length; i++) hCooccur[i] /= hCount;
    if (vCount > 0) for (let i = 0; i < vCooccur.length; i++) vCooccur[i] /= vCount;

    let hEntropy = 0, vEntropy = 0;
    let symmetryDiff = 0;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const hp = hCooccur[i * size + j];
            const vp = vCooccur[i * size + j];
            if (hp > 0) hEntropy -= hp * Math.log2(hp);
            if (vp > 0) vEntropy -= vp * Math.log2(vp);
            symmetryDiff += Math.abs(hCooccur[i * size + j] - hCooccur[j * size + i]);
        }
    }

    const avgEntropy = (hEntropy + vEntropy) / 2;
    const maxEntropy = Math.log2(size * size);
    const entropyRatio = avgEntropy / maxEntropy;

    let score: number;
    if (entropyRatio < 0.3) score = 78;
    else if (entropyRatio < 0.45) score = 65;
    else if (entropyRatio < 0.6) score = 50;
    else if (entropyRatio < 0.75) score = 35;
    else score = 20;

    if (symmetryDiff < 0.05) score += 5;
    else if (symmetryDiff > 0.2) score -= 5;
    score = Math.max(5, Math.min(95, score));

    return {
        name: "Pixel Co-occurrence", nameKey: "signal.pixelCooccurrence",
        category: "forensic", score, weight: 0.4,
        description: score > 55
            ? "Co-occurrence statistics show low entropy — AI images have overly smooth gradient transitions"
            : "Co-occurrence entropy is natural — consistent with real image noise and texture",
        descriptionKey: score > 55 ? "signal.cooccurrence.ai" : "signal.cooccurrence.real",
        icon: "⊡",
        details: `Entropy ratio: ${entropyRatio.toFixed(4)}, Symmetry diff: ${symmetryDiff.toFixed(4)}, H entropy: ${hEntropy.toFixed(3)}, V entropy: ${vEntropy.toFixed(3)}.`,
    };
}
