/**
 * Shoulder Alignment
 * Shoulder geometry and alignment
 */
import type { AnalysisMethod } from "../../types";

export function analyzeShoulderAlignment(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Shoulder Alignment", nameKey: "signal.shoulderAlignment", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.shoulderAlignment.error", icon: "🧍" };
    }
    const blockSize = 8;
    const blocksX = Math.floor(w / blockSize), blocksY = Math.floor(h / blockSize);
    let metric1 = 0, metric2 = 0, total = 0;

    for (let by = 0; by < blocksY - 1; by++) {
        for (let bx = 0; bx < blocksX - 1; bx++) {
            const idx = (by * blockSize * w + bx * blockSize) * 4;
            const idxR = (by * blockSize * w + (bx + 1) * blockSize) * 4;
            const idxD = ((by + 1) * blockSize * w + bx * blockSize) * 4;
            const g1 = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
            const g2 = 0.299 * pixels[idxR] + 0.587 * pixels[idxR + 1] + 0.114 * pixels[idxR + 2];
            const g3 = 0.299 * pixels[idxD] + 0.587 * pixels[idxD + 1] + 0.114 * pixels[idxD + 2];
            const diffH = Math.abs(g1 - g2), diffV = Math.abs(g1 - g3);
            metric1 += diffH + diffV;
            if (diffH < 5 && diffV < 5) metric2++;
            total++;
        }
    }
    const avgDiff = total > 0 ? metric1 / (total * 2) : 0;
    const smoothRatio = total > 0 ? metric2 / total : 0;
    let score: number;
    if (smoothRatio > 0.8 && avgDiff < 4) score = 72;
    else if (smoothRatio > 0.65) score = 60;
    else if (smoothRatio < 0.3) score = 32;
    else score = 45;

    return {
        name: "Shoulder Alignment", nameKey: "signal.shoulderAlignment", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Shoulder geometry and alignment — potential AI-generated video artifact" : "Natural shoulder geometry and alignment — consistent with authentic video",
        descriptionKey: score > 55 ? "signal.shoulderAlignment.ai" : "signal.shoulderAlignment.real", icon: "🧍",
        details: `Avg diff: ${avgDiff.toFixed(3)}, Smooth ratio: ${smoothRatio.toFixed(3)}.`,
    };
}
