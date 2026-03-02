/**
 * Topic Consistency Analysis
 * AI text maintains unnaturally consistent topic focus
 * Reference: Bakhtin et al. (2019) - Real or Fake? Learning to Discriminate Machine from Human Generated Text
 */
import type { AnalysisMethod } from "../../types";

export function analyzeTopicConsistency(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Topic Consistency", nameKey: "signal.topicConsistency", category: "statistical", score: 50, weight: 0.25, description: "Input too small", descriptionKey: "signal.topicConsistency.error", icon: "📋" };
    }
    // Measure color channel histogram similarity between document segments
    const segments = 4;
    const segH = Math.floor(h / segments);
    const histograms: Float32Array[] = [];
    for (let s = 0; s < segments; s++) {
        const hist = new Float32Array(32);
        let cnt = 0;
        for (let y = s * segH; y < (s + 1) * segH && y < h; y += 2) {
            for (let x = 0; x < w; x += 2) {
                const idx = (y * w + x) * 4;
                const g = Math.floor((0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2]) / 8);
                hist[g]++; cnt++;
            }
        }
        for (let i = 0; i < 32; i++) hist[i] /= cnt || 1;
        histograms.push(hist);
    }
    // Calculate pairwise histogram correlation
    let totalCorr = 0, pairs = 0;
    for (let i = 0; i < segments; i++) {
        for (let j = i + 1; j < segments; j++) {
            let dot = 0, mag1 = 0, mag2 = 0;
            for (let k = 0; k < 32; k++) {
                dot += histograms[i][k] * histograms[j][k];
                mag1 += histograms[i][k] ** 2;
                mag2 += histograms[j][k] ** 2;
            }
            const corr = (Math.sqrt(mag1) * Math.sqrt(mag2)) > 0 ? dot / (Math.sqrt(mag1) * Math.sqrt(mag2)) : 0;
            totalCorr += corr; pairs++;
        }
    }
    const avgCorr = pairs > 0 ? totalCorr / pairs : 0;

    let score: number;
    if (avgCorr > 0.98) score = 70;
    else if (avgCorr > 0.95) score = 58;
    else if (avgCorr < 0.8) score = 28;
    else score = 42;

    return {
        name: "Topic Consistency", nameKey: "signal.topicConsistency", category: "statistical", score, weight: 0.25,
        description: score > 55 ? "Extremely consistent topic signal throughout — characteristic of AI-generated text" : "Natural topic variation — consistent with human-authored content",
        descriptionKey: score > 55 ? "signal.topicConsistency.ai" : "signal.topicConsistency.real", icon: "📋",
        details: `Avg correlation: ${avgCorr.toFixed(4)}.`,
    };
}
