import type { AnalysisMethod } from "../../types";
import { gray } from "../pixelUtils";

/**
 * Signal 18: Morphological Gradient Analysis
 * Mathematical morphology patterns in image structure
 * Analyzes dilation-erosion difference patterns
 */
export function analyzeMorphologicalGradient(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
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
