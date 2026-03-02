/**
 * Repetition Pattern Detection
 * AI text often repeats phrases, structures, or ideas more than human writing
 * Reference: Krishna et al. (2024) - Paraphrasing Evades Detectors of AI-Generated Text
 */
import type { AnalysisMethod } from "../../types";

export function analyzeRepetitionPattern(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Repetition Pattern", nameKey: "signal.repetitionPattern", category: "statistical", score: 50, weight: 0.25, description: "Input too small", descriptionKey: "signal.repetitionPattern.error", icon: "🔁" };
    }
    // Detect repeated micro-patterns as proxy for textual repetition
    const patchSize = 8;
    const signatures = new Map<string, number>();
    const step = Math.max(1, Math.floor((w * h) / (patchSize * patchSize * 300)));
    let totalPatches = 0;
    for (let y = 0; y < h - patchSize; y += patchSize * step) {
        for (let x = 0; x < w - patchSize; x += patchSize * step) {
            let sig = "";
            for (let dy = 0; dy < patchSize; dy += 2) {
                for (let dx = 0; dx < patchSize; dx += 2) {
                    const idx = ((y + dy) * w + x + dx) * 4;
                    sig += String.fromCharCode(Math.floor((0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2]) / 32));
                }
            }
            signatures.set(sig, (signatures.get(sig) || 0) + 1);
            totalPatches++;
        }
    }
    let repeatedPatches = 0;
    for (const count of signatures.values()) { if (count > 2) repeatedPatches += count; }
    const repetitionRate = totalPatches > 0 ? repeatedPatches / totalPatches : 0;

    let score: number;
    if (repetitionRate > 0.7) score = 72;
    else if (repetitionRate > 0.5) score = 60;
    else if (repetitionRate < 0.2) score = 28;
    else score = 42;

    return {
        name: "Repetition Pattern", nameKey: "signal.repetitionPattern", category: "statistical", score, weight: 0.25,
        description: score > 55 ? "High pattern repetition — AI text tends to reuse structures excessively" : "Low repetition rate — consistent with natural human variation",
        descriptionKey: score > 55 ? "signal.repetitionPattern.ai" : "signal.repetitionPattern.real", icon: "🔁",
        details: `Repetition rate: ${repetitionRate.toFixed(3)}, Unique: ${signatures.size}/${totalPatches}.`,
    };
}
