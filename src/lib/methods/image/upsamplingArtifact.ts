import type { AnalysisMethod } from "../../types";
import { gray } from "../pixelUtils";

/**
 * Signal 37: Upsampling Artifact Detection
 * Zhang et al. (ICML 2019) - Checkerboard artifacts from transposed convolutions
 * AI models using upsampling leave periodic grid artifacts
 */
export function analyzeUpsamplingArtifact(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    // Detect checkerboard patterns at various scales (2x2, 4x4)
    let checkerboardScore2 = 0;
    let checkerboardScore4 = 0;
    let totalSamples = 0;
    const step = Math.max(4, Math.floor(Math.min(width, height) / 120));

    for (let y = 2; y < height - 2; y += step) {
        for (let x = 2; x < width - 2; x += step) {
            // 2x2 checkerboard pattern detection
            const g00 = gray(pixels, (y * width + x) * 4);
            const g01 = gray(pixels, (y * width + x + 1) * 4);
            const g10 = gray(pixels, ((y + 1) * width + x) * 4);
            const g11 = gray(pixels, ((y + 1) * width + x + 1) * 4);

            // Checkerboard: diagonal similar, adjacent different
            const diagSim = Math.abs(g00 - g11) + Math.abs(g01 - g10);
            const adjDiff = Math.abs(g00 - g01) + Math.abs(g00 - g10);

            if (adjDiff > 0) {
                const checkRatio = diagSim / adjDiff;
                if (checkRatio < 0.3 && adjDiff > 3) checkerboardScore2++;
            }

            // 4x4 pattern
            if (x + 3 < width && y + 3 < height) {
                let pattern4x4 = 0;
                for (let dy = 0; dy < 4; dy++) {
                    for (let dx = 0; dx < 4; dx++) {
                        const g = gray(pixels, ((y + dy) * width + (x + dx)) * 4);
                        const expected = ((dy + dx) % 2 === 0) ? g00 : g01;
                        pattern4x4 += Math.abs(g - expected);
                    }
                }
                if (pattern4x4 < 20 * 16) checkerboardScore4++;
            }

            totalSamples++;
        }
    }

    const checkRatio2 = totalSamples > 0 ? checkerboardScore2 / totalSamples : 0;
    const checkRatio4 = totalSamples > 0 ? checkerboardScore4 / totalSamples : 0;
    const combinedRatio = checkRatio2 * 0.6 + checkRatio4 * 0.4;

    let score: number;
    if (combinedRatio > 0.3) score = 85;
    else if (combinedRatio > 0.15) score = 72;
    else if (combinedRatio > 0.08) score = 58;
    else if (combinedRatio > 0.03) score = 42;
    else score = 22;

    return {
        name: "Upsampling Artifacts", nameKey: "signal.upsamplingArtifact",
        category: "statistical", score, weight: 0.5,
        description: score > 55
            ? "Checkerboard upsampling artifacts detected — common in neural network generation"
            : "No upsampling artifacts found — image pixel structure appears natural",
        descriptionKey: score > 55 ? "signal.upsampling.ai" : "signal.upsampling.real",
        icon: "⊞",
        details: `2x2 check ratio: ${checkRatio2.toFixed(3)}, 4x4 ratio: ${checkRatio4.toFixed(3)}, Combined: ${combinedRatio.toFixed(3)}.`,
    };
}