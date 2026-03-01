import type { AnalysisMethod } from "../types";
import { gray } from "./pixelUtils";

/**
 * Signal 35: Color Banding Detection
 * Detects posterization/quantization artifacts in gradients
 * AI images may show subtle color banding in smooth gradients
 */
export function analyzeColorBanding(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    let bandingCount = 0;
    let gradientCount = 0;
    const step = Math.max(2, Math.floor(Math.min(width, height) / 200));

    for (let y = 0; y < height; y += step) {
        for (let x = 2; x < width - 2; x += step) {
            const g0 = gray(pixels, (y * width + (x - 2)) * 4);
            const g1 = gray(pixels, (y * width + (x - 1)) * 4);
            const g2 = gray(pixels, (y * width + x) * 4);
            const g3 = gray(pixels, (y * width + (x + 1)) * 4);
            const g4 = gray(pixels, (y * width + (x + 2)) * 4);

            // Check if it's a gradient region
            const isGradient = Math.abs(g4 - g0) > 3 && Math.abs(g4 - g0) < 40;
            if (!isGradient) continue;
            gradientCount++;

            // Check for steps (banding): flat regions within gradient
            const d01 = Math.abs(g1 - g0);
            const d12 = Math.abs(g2 - g1);
            const d23 = Math.abs(g3 - g2);
            const d34 = Math.abs(g4 - g3);

            // Banding: some transitions are 0 while others are larger
            const diffs = [d01, d12, d23, d34];
            const zeroDiffs = diffs.filter(d => d === 0).length;
            const largeDiffs = diffs.filter(d => d > 2).length;

            if (zeroDiffs >= 2 && largeDiffs >= 1) bandingCount++;
        }
    }

    const bandingRatio = gradientCount > 0 ? bandingCount / gradientCount : 0;

    let score: number;
    if (bandingRatio > 0.5) score = 78;
    else if (bandingRatio > 0.3) score = 65;
    else if (bandingRatio > 0.15) score = 52;
    else if (bandingRatio > 0.05) score = 38;
    else score = 22;

    return {
        name: "Color Banding", nameKey: "signal.colorBanding",
        category: "compression", score, weight: 0.3,
        description: score > 55
            ? "Significant color banding detected â€” AI generation or heavy post-processing artifact"
            : "Smooth gradients without banding â€” consistent with high-quality capture",
        descriptionKey: score > 55 ? "signal.banding.ai" : "signal.banding.real",
        icon: "â–¥",
        details: `Banding ratio: ${bandingRatio.toFixed(3)}, Gradient samples: ${gradientCount}, Banding: ${bandingCount}.`,
    };
}