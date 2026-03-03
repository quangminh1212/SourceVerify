/**
 * Shadow Consistency Video Analysis
 * Detects shadow direction and intensity inconsistencies in video
 */
import type { AnalysisMethod } from "../../types";

export function analyzeShadowConsistencyVideo(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Shadow Consistency Video", nameKey: "signal.shadowConsistencyVideo", category: "pixel", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.shadowConsistencyVideo.error", icon: "🌑" };
    }
    // Analyze dark region distribution in quadrants for shadow consistency
    const qW = Math.floor(w / 2), qH = Math.floor(h / 2);
    const quadDark = [0, 0, 0, 0]; const quadTotal = [0, 0, 0, 0];
    for (let y = 0; y < h; y += 2)for (let x = 0; x < w; x += 2) {
        const i = (y * w + x) * 4; const g = pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
        const q = (y < qH ? 0 : 2) + (x < qW ? 0 : 1); quadTotal[q]++; if (g < 50) quadDark[q]++;
    }
    const ratios = quadDark.map((d, i) => quadTotal[i] > 0 ? d / quadTotal[i] : 0);
    const meanR = ratios.reduce((a, b) => a + b, 0) / 4;
    const varR = ratios.reduce((a, b) => a + (b - meanR) ** 2, 0) / 4;
    let score: number;
    if (varR < 0.001 && meanR > 0.1) score = 64; else if (varR > 0.01) score = 35; else score = 48;
    return {
        name: "Shadow Consistency Video", nameKey: "signal.shadowConsistencyVideo", category: "pixel", score, weight: 0.3,
        description: score > 55 ? "Shadow inconsistency detected — possible AI generation" : "Natural shadow distribution — authentic",
        descriptionKey: score > 55 ? "signal.shadowConsistencyVideo.ai" : "signal.shadowConsistencyVideo.real", icon: "🌑",
        details: `Shadow var: ${varR.toFixed(5)}, Ratios: [${ratios.map(r => r.toFixed(3)).join(', ')}]`,
    };
}
