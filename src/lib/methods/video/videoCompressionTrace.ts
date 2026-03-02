/**
 * Video Compression Trace Analysis
 * Detects abnormal compression patterns in AI-generated video
 * Reference: Guera & Delp (2018) - Deepfake Video Detection Using Recurrent Neural Networks, AVSS
 */
import type { AnalysisMethod } from "../../types";

export function analyzeVideoCompressionTrace(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Video Compression Trace", nameKey: "signal.videoCompressionTrace", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.videoCompressionTrace.error", icon: "📦" };
    }
    // Analyze 8x8 block boundary artifacts (H.264/H.265 macroblock patterns)
    let blockBoundaryEnergy = 0, innerBlockEnergy = 0, bCnt = 0, iCnt = 0;
    for (let y = 0; y < h - 1; y++) {
        for (let x = 0; x < w - 1; x += 2) {
            const idx = (y * w + x) * 4;
            const diff = Math.abs(pixels[idx] - pixels[idx + 4]);
            if (x % 8 === 7 || y % 8 === 7) { blockBoundaryEnergy += diff; bCnt++; }
            else { innerBlockEnergy += diff; iCnt++; }
        }
    }
    const avgBoundary = bCnt > 0 ? blockBoundaryEnergy / bCnt : 0;
    const avgInner = iCnt > 0 ? innerBlockEnergy / iCnt : 0;
    const blockRatio = avgInner > 0 ? avgBoundary / avgInner : 1;

    // AI-generated content may lack natural compression artifacts or have double compression
    let score: number;
    if (blockRatio < 0.9) score = 65;
    else if (blockRatio > 1.3) score = 62;
    else if (blockRatio > 0.95 && blockRatio < 1.05) score = 45;
    else score = 38;

    return {
        name: "Video Compression Trace", nameKey: "signal.videoCompressionTrace", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Abnormal compression block patterns — suggests AI-generated or re-encoded content" : "Natural compression artifacts — consistent with standard video encoding",
        descriptionKey: score > 55 ? "signal.videoCompressionTrace.ai" : "signal.videoCompressionTrace.real", icon: "📦",
        details: `Block ratio: ${blockRatio.toFixed(3)}, Boundary: ${avgBoundary.toFixed(2)}, Inner: ${avgInner.toFixed(2)}.`,
    };
}
