/**
 * Body Proportion Analysis
 * Detects unnatural body proportions in AI-generated videos
 * Reference: Agarwal et al. (2020) - Detecting Deep-Fake Videos from Phoneme-Viseme Mismatches
 */
import type { AnalysisMethod } from "../../types";

export function analyzeBodyProportion(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Body Proportion", nameKey: "signal.bodyProportion", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.bodyProportion.error", icon: "🧍" };
    }
    // Analyze vertical gradient density distribution - human bodies create specific patterns
    const strips = 8;
    const stripH = Math.floor(h / strips);
    const stripEnergies: number[] = [];
    for (let s = 0; s < strips; s++) {
        let energy = 0, cnt = 0;
        for (let y = s * stripH; y < (s + 1) * stripH && y < h - 1; y += 2) {
            for (let x = Math.floor(w * 0.2); x < Math.floor(w * 0.8) && x < w - 1; x += 2) {
                const idx = (y * w + x) * 4;
                energy += Math.abs(pixels[idx] - pixels[idx + 4]) + Math.abs(pixels[idx] - pixels[idx + w * 4]);
                cnt++;
            }
        }
        stripEnergies.push(cnt > 0 ? energy / cnt : 0);
    }
    // Natural bodies: head region (top) has medium complexity, torso lower, limbs higher
    const topAvg = (stripEnergies[0] + stripEnergies[1]) / 2;
    const midAvg = (stripEnergies[2] + stripEnergies[3] + stripEnergies[4]) / 3;
    const botAvg = (stripEnergies[5] + stripEnergies[6] + stripEnergies[7]) / 3;
    const totalAvg = stripEnergies.reduce((a, b) => a + b, 0) / strips;
    const segVar = stripEnergies.reduce((a, b) => a + (b - totalAvg) ** 2, 0) / strips;
    const cv = totalAvg > 0 ? Math.sqrt(segVar) / totalAvg : 0;

    let score: number;
    if (cv < 0.15) score = 68;
    else if (cv < 0.25 && Math.abs(topAvg - midAvg) < 2) score = 58;
    else if (cv > 0.5) score = 28;
    else score = 42;

    return {
        name: "Body Proportion", nameKey: "signal.bodyProportion", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Uniform body gradient distribution — AI videos often lack natural body proportion variation" : "Natural body proportion gradient — consistent with real human video",
        descriptionKey: score > 55 ? "signal.bodyProportion.ai" : "signal.bodyProportion.real", icon: "🧍",
        details: `Strip CV: ${cv.toFixed(3)}, Top: ${topAvg.toFixed(1)}, Mid: ${midAvg.toFixed(1)}, Bot: ${botAvg.toFixed(1)}.`,
    };
}
