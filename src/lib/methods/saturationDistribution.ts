import type { AnalysisMethod } from "../types";

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
            descriptionKey: "signal.saturation.error", icon: "â—†",
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
            ? "Saturation profile is abnormal â€” AI images exhibit biased color saturation"
            : "Saturation distribution is natural â€” consistent with real photography",
        descriptionKey: score > 55 ? "signal.saturation.ai" : "signal.saturation.real",
        icon: "â—†",
        details: `Mean saturation: ${mean.toFixed(3)}, Variance: ${variance.toFixed(4)}, Active bins: ${activeBins}/20.`,
    };
}