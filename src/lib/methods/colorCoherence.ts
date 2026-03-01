/**
 * Method 53: Color Coherence Vector (CCV)
 * Pass et al., "Comparing Images Using Color Coherence Vectors", ACM MM 1996
 * Differentiates spatial coherent vs. incoherent color distribution — AI images differ from real
 */

import type { AnalysisMethod } from "../types";

export function analyzeColorCoherence(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    if (width < 16 || height < 16) {
        return {
            name: "Color Coherence Vector", nameKey: "signal.colorCoherence",
            category: "color", score: 50, weight: 0.35,
            description: "Image too small for CCV analysis",
            descriptionKey: "signal.ccv.error", icon: "▦",
        };
    }

    const totalPixels = width * height;
    // Quantize colors to reduce bins: 4 levels per channel = 64 bins
    const levels = 4;
    const binCount = levels * levels * levels;
    const coherent = new Float32Array(binCount);
    const incoherent = new Float32Array(binCount);

    // Label connected components using a simplified approach:
    // A pixel is "coherent" if it belongs to a large region of similar color
    // Use tau threshold: region >= tau pixels = coherent
    const tau = Math.max(25, Math.floor(totalPixels * 0.001));

    // Create quantized color map
    const colorMap = new Uint8Array(totalPixels);
    for (let i = 0; i < totalPixels; i++) {
        const r = Math.floor(pixels[i * 4] / (256 / levels));
        const g = Math.floor(pixels[i * 4 + 1] / (256 / levels));
        const b = Math.floor(pixels[i * 4 + 2] / (256 / levels));
        colorMap[i] = r * levels * levels + g * levels + b;
    }

    // Simplified region counting: check 4-connected neighbors with same color
    // Count how many pixels in each bin have >= threshold same-colored neighbors
    const step = Math.max(1, Math.floor(Math.sqrt(totalPixels / 50000)));
    const neighborThreshold = 3; // a pixel with >= 3/4 same-color neighbors is "coherent"

    const binTotal = new Float32Array(binCount);
    const binCoherent = new Float32Array(binCount);

    for (let y = 1; y < height - 1; y += step) {
        for (let x = 1; x < width - 1; x += step) {
            const idx = y * width + x;
            const c = colorMap[idx];
            binTotal[c]++;

            // Check 4-connected neighbors
            let sameCount = 0;
            if (colorMap[idx - 1] === c) sameCount++;
            if (colorMap[idx + 1] === c) sameCount++;
            if (colorMap[idx - width] === c) sameCount++;
            if (colorMap[idx + width] === c) sameCount++;

            if (sameCount >= neighborThreshold) {
                binCoherent[c]++;
            }
        }
    }

    // Compute coherence ratio per bin and overall
    let totalCoherent = 0;
    let totalSampled = 0;
    let activeColor = 0;

    for (let i = 0; i < binCount; i++) {
        if (binTotal[i] > 0) {
            coherent[i] = binCoherent[i];
            incoherent[i] = binTotal[i] - binCoherent[i];
            totalCoherent += binCoherent[i];
            totalSampled += binTotal[i];
            activeColor++;
        }
    }

    const coherenceRatio = totalSampled > 0 ? totalCoherent / totalSampled : 0;
    const colorDiversity = activeColor / binCount;

    // AI images: higher coherence (smoother color regions), lower diversity
    let score = 50;
    if (coherenceRatio > 0.85) score += 15;
    else if (coherenceRatio > 0.7) score += 8;
    else if (coherenceRatio < 0.4) score -= 10;
    else if (coherenceRatio < 0.55) score -= 5;

    if (colorDiversity < 0.15) score += 8;
    else if (colorDiversity > 0.5) score -= 6;

    score = Math.max(5, Math.min(95, score));

    return {
        name: "Color Coherence Vector", nameKey: "signal.colorCoherence",
        category: "color", score, weight: 0.35,
        description: score > 55
            ? "Color coherence is unnaturally high — AI images have overly uniform color regions"
            : "Color coherence is natural — incoherent color scatter consistent with real scene complexity",
        descriptionKey: score > 55 ? "signal.ccv.ai" : "signal.ccv.real",
        icon: "▦",
        details: `Coherence ratio: ${coherenceRatio.toFixed(4)}, Color diversity: ${colorDiversity.toFixed(4)}, Active bins: ${activeColor}/${binCount}.`,
    };
}
