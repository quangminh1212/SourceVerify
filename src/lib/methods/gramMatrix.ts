/**
 * Gram Matrix Analysis
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeGramMatrix(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Gram Matrix Analysis", nameKey: "signal.gramMatrix",
            category: "statistical", score: 50, weight: 0.3,
            description: "Image too small for analysis",
            descriptionKey: "signal.gramMatrix.error", icon: "📏",
        };
    }

    let score: number;
    // Gram matrix style correlation analysis for texture consistency
    const regionSize = Math.min(64, Math.floor(Math.min(w, h) / 4));
    const regions = [[0, 0], [w - regionSize, 0], [0, h - regionSize], [w - regionSize, h - regionSize]];
    const gramValues: number[] = [];
    for (const [rx, ry] of regions) {
        let sumRG = 0, sumRB = 0, sumGB = 0, cnt = 0;
        for (let y = ry; y < ry + regionSize && y < h; y++) {
            for (let x = rx; x < rx + regionSize && x < w; x++) {
                const idx = (y * w + x) * 4;
                sumRG += pixels[idx] * pixels[idx + 1];
                sumRB += pixels[idx] * pixels[idx + 2];
                sumGB += pixels[idx + 1] * pixels[idx + 2];
                cnt++;
            }
        }
        if (cnt > 0) gramValues.push(sumRG / cnt, sumRB / cnt, sumGB / cnt);
    }
    const avgGram = gramValues.reduce((a, b) => a + b, 0) / gramValues.length;
    let gramVar = 0;
    for (const g of gramValues) gramVar += (g - avgGram) ** 2;
    gramVar = Math.sqrt(gramVar / gramValues.length);
    const cv = avgGram > 0 ? gramVar / avgGram : 0;
    if (cv < 0.05) score = 70;
    else if (cv < 0.1) score = 58;
    else if (cv > 0.3) score = 30;
    else score = 42;

    return {
        name: "Gram Matrix Analysis", nameKey: "signal.gramMatrix",
        category: "statistical", score, weight: 0.3,
        description: score > 55
            ? "Unnaturally uniform texture correlations — neural style generation pattern"
            : "Natural texture correlation variation across regions",
        descriptionKey: score > 55 ? "signal.gramMatrix.ai" : "signal.gramMatrix.real",
        icon: "📏",
    };
}
