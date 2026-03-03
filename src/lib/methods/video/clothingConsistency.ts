/**
 * Clothing Consistency Analysis
 * Detects temporal inconsistencies in clothing rendering
 */
import type { AnalysisMethod } from "../../types";

export function analyzeClothingConsistency(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Clothing Consistency", nameKey: "signal.clothingConsistency", category: "pixel", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.clothingConsistency.error", icon: "👔" };
    }
    // Analyze torso region for clothing texture consistency
    const tX = Math.floor(w * 0.2), tY = Math.floor(h * 0.45), tW = Math.floor(w * 0.6), tH = Math.floor(h * 0.35);
    let edgeSum = 0, cnt = 0; const edgeVals: number[] = [];
    for (let y = tY + 1; y < tY + tH && y < h - 1; y += 2)for (let x = tX + 1; x < tX + tW && x < w - 1; x += 2) {
        const i = (y * w + x) * 4;
        const gx = Math.abs(pixels[(y * w + x + 1) * 4] - pixels[(y * w + x - 1) * 4]);
        const gy = Math.abs(pixels[((y + 1) * w + x) * 4] - pixels[((y - 1) * w + x) * 4]);
        const mag = gx + gy; edgeVals.push(mag); edgeSum += mag; cnt++;
    }
    const meanEdge = cnt > 0 ? edgeSum / cnt : 0;
    let edgeVar = 0; if (cnt > 1) edgeVar = edgeVals.reduce((a, b) => a + (b - meanEdge) ** 2, 0) / cnt;
    let score: number;
    if (meanEdge < 3 && edgeVar < 5) score = 66; else if (meanEdge > 15) score = 33; else score = 47;
    return {
        name: "Clothing Consistency", nameKey: "signal.clothingConsistency", category: "pixel", score, weight: 0.3,
        description: score > 55 ? "Clothing texture anomaly — possible AI generation" : "Natural clothing texture — authentic",
        descriptionKey: score > 55 ? "signal.clothingConsistency.ai" : "signal.clothingConsistency.real", icon: "👔",
        details: `Edge mean: ${meanEdge.toFixed(2)}, Edge var: ${edgeVar.toFixed(2)}`,
    };
}
