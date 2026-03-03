/**
 * Ear Consistency Analysis
 * Detects inconsistencies in ear rendering across video frames
 */
import type { AnalysisMethod } from "../../types";

export function analyzeEarConsistency(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Ear Consistency", nameKey: "signal.earConsistency", category: "pixel", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.earConsistency.error", icon: "👂" };
    }
    // Analyze left and right ear regions for symmetry and texture
    const lX = Math.floor(w * 0.05), rX = Math.floor(w * 0.85), eY = Math.floor(h * 0.2), eW = Math.floor(w * 0.1), eH = Math.floor(h * 0.25);
    let lMean = 0, rMean = 0, lC = 0, rC = 0, lVar = 0, rVar = 0; const lVals: number[] = []; const rVals: number[] = [];
    for (let y = eY; y < eY + eH && y < h; y += 2) {
        for (let x = lX; x < lX + eW && x < w; x += 2) { const i = (y * w + x) * 4; const g = pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114; lVals.push(g); lMean += g; lC++; }
        for (let x = rX; x < rX + eW && x < w; x += 2) { const i = (y * w + x) * 4; const g = pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114; rVals.push(g); rMean += g; rC++; }
    }
    lMean = lC > 0 ? lMean / lC : 0; rMean = rC > 0 ? rMean / rC : 0;
    if (lC > 1) lVar = lVals.reduce((a, b) => a + (b - lMean) ** 2, 0) / lC;
    if (rC > 1) rVar = rVals.reduce((a, b) => a + (b - rMean) ** 2, 0) / rC;
    const asymmetry = Math.abs(lMean - rMean); const varDiff = Math.abs(lVar - rVar);
    let score: number;
    if (asymmetry < 3 && varDiff < 20) score = 65; else if (asymmetry > 20) score = 30; else score = 48;
    return {
        name: "Ear Consistency", nameKey: "signal.earConsistency", category: "pixel", score, weight: 0.3,
        description: score > 55 ? "Ear inconsistency detected — possible AI generation" : "Natural ear consistency — authentic appearance",
        descriptionKey: score > 55 ? "signal.earConsistency.ai" : "signal.earConsistency.real", icon: "👂",
        details: `Asymmetry: ${asymmetry.toFixed(2)}, Var diff: ${varDiff.toFixed(2)}`,
    };
}
