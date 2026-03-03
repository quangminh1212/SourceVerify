/**
 * Video Codec Analysis
 * Detects codec-level artifacts and anomalies in video compression
 */
import type { AnalysisMethod } from "../../types";

export function analyzeVideoCodecAnalysis(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Video Codec Analysis", nameKey: "signal.videoCodecAnalysis", category: "frequency", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.videoCodecAnalysis.error", icon: "📼" };
    }
    // Detect 8x8 and 16x16 block boundary artifacts from codec compression
    let blockEdge8 = 0, blockEdge16 = 0, cnt8 = 0, cnt16 = 0;
    for (let y = 0; y < h - 1; y += 2)for (let x = 0; x < w - 1; x += 2) {
        const i = (y * w + x) * 4; const g = pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
        const gR = pixels[(y * w + Math.min(x + 1, w - 1)) * 4] * 0.299 + pixels[(y * w + Math.min(x + 1, w - 1)) * 4 + 1] * 0.587 + pixels[(y * w + Math.min(x + 1, w - 1)) * 4 + 2] * 0.114;
        const diff = Math.abs(g - gR);
        if (x % 8 === 7) { blockEdge8 += diff; cnt8++; }
        if (x % 16 === 15) { blockEdge16 += diff; cnt16++; }
    }
    const avgBlock8 = cnt8 > 0 ? blockEdge8 / cnt8 : 0; const avgBlock16 = cnt16 > 0 ? blockEdge16 / cnt16 : 0;
    const blockRatio = avgBlock8 > 0 ? avgBlock16 / avgBlock8 : 1;
    let score: number;
    if (avgBlock8 < 2 && avgBlock16 < 2) score = 65; else if (avgBlock8 > 8) score = 35; else score = 48;
    return {
        name: "Video Codec Analysis", nameKey: "signal.videoCodecAnalysis", category: "frequency", score, weight: 0.3,
        description: score > 55 ? "Unusual codec patterns — possible synthetic generation" : "Normal codec compression — authentic",
        descriptionKey: score > 55 ? "signal.videoCodecAnalysis.ai" : "signal.videoCodecAnalysis.real", icon: "📼",
        details: `Block8 edge: ${avgBlock8.toFixed(3)}, Block16 edge: ${avgBlock16.toFixed(3)}, Ratio: ${blockRatio.toFixed(3)}`,
    };
}
