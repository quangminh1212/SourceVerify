/**
 * Writing Rhythm Analysis
 * Human writing has natural cadence patterns; AI text is more metronomic
 * Reference: Tay et al. (2020) - Would You Rather? Comparative Study of Human vs. Machine Generated Text
 */
import type { AnalysisMethod } from "../../types";

export function analyzeWritingRhythm(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Writing Rhythm", nameKey: "signal.writingRhythm", category: "statistical", score: 50, weight: 0.2, description: "Input too small", descriptionKey: "signal.writingRhythm.error", icon: "🎵" };
    }
    // Analyze periodic patterns in row energy via autocorrelation
    const rowEnergies: number[] = [];
    for (let y = 0; y < h; y++) {
        let e = 0;
        for (let x = 1; x < w; x++) {
            const idx = (y * w + x) * 4;
            e += Math.abs(pixels[idx] - pixels[idx - 4]);
        }
        rowEnergies.push(e / w);
    }
    // Calculate autocorrelation of row energies
    const n = rowEnergies.length;
    const mean = rowEnergies.reduce((a, b) => a + b, 0) / n;
    let var0 = 0;
    for (const e of rowEnergies) var0 += (e - mean) ** 2;
    var0 /= n;
    if (var0 < 0.01) {
        return {
            name: "Writing Rhythm", nameKey: "signal.writingRhythm", category: "statistical", score: 65, weight: 0.2,
            description: "Near-zero energy variation — suggests uniform AI generation", descriptionKey: "signal.writingRhythm.ai", icon: "🎵",
        };
    }
    const maxLag = Math.min(20, Math.floor(n / 2));
    let maxCorr = 0, peakLag = 0;
    for (let lag = 2; lag < maxLag; lag++) {
        let corr = 0;
        for (let i = 0; i < n - lag; i++) {
            corr += (rowEnergies[i] - mean) * (rowEnergies[i + lag] - mean);
        }
        corr /= (n - lag) * var0;
        if (corr > maxCorr) { maxCorr = corr; peakLag = lag; }
    }

    let score: number;
    if (maxCorr > 0.6) score = 72;
    else if (maxCorr > 0.4) score = 60;
    else if (maxCorr < 0.15) score = 28;
    else score = 42;

    return {
        name: "Writing Rhythm", nameKey: "signal.writingRhythm", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Strong periodic rhythm detected — AI text shows metronomic regularity" : "Natural rhythm variation — consistent with human writing cadence",
        descriptionKey: score > 55 ? "signal.writingRhythm.ai" : "signal.writingRhythm.real", icon: "🎵",
        details: `Max autocorr: ${maxCorr.toFixed(3)} at lag ${peakLag}.`,
    };
}
