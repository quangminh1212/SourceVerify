import type { AnalysisMethod } from "../../types";
import { gray } from "../pixelUtils";

/**
 * Signal 16: Gray Level Co-occurrence Matrix (GLCM)
 * Haralick et al. (IEEE SMC 1973) - Texture feature extraction
 * Analyzes spatial relationships between pixel intensity levels
 */
export function analyzeGLCM(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
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
    for (let i = 0; i < levels; i++) {
        for (let j = 0; j < levels; j++) {
            contrast += (i - j) ** 2 * glcm[i][j];
            energy += glcm[i][j] ** 2;
            homogeneity += glcm[i][j] / (1 + Math.abs(i - j));
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
