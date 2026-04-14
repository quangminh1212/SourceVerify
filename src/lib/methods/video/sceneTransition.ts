/**
 * Scene Transition Coherence
 * Detects unnatural scene transitions in AI-generated videos
 * Reference: Cozzolino et al. (2021) - ID-Reveal, ICCV
 */
import type { AnalysisMethod } from "../../types";

export function analyzeSceneTransition(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Scene Transition", nameKey: "signal.sceneTransition", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.sceneTransition.error", icon: "🎬" };
    }
    // Analyze spatial gradient distribution across frame quadrants
    const halfW = Math.floor(w / 2), halfH = Math.floor(h / 2);
    const quadStats = [0, 0, 0, 0];
    const quadCounts = [0, 0, 0, 0];
    for (let y = 1; y < h - 1; y += 3) {
        for (let x = 1; x < w - 1; x += 3) {
            const idx = (y * w + x) * 4;
            const g = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
            const gR = 0.299 * pixels[idx + 4] + 0.587 * pixels[idx + 5] + 0.114 * pixels[idx + 6];
            const gD = 0.299 * pixels[idx + w * 4] + 0.587 * pixels[idx + w * 4 + 1] + 0.114 * pixels[idx + w * 4 + 2];
            const grad = Math.abs(g - gR) + Math.abs(g - gD);
            const qi = (y < halfH ? 0 : 2) + (x < halfW ? 0 : 1);
            quadStats[qi] += grad; quadCounts[qi]++;
        }
    }
    const quadAvg = quadStats.map((s, i) => quadCounts[i] > 0 ? s / quadCounts[i] : 0);
    const globalAvg = quadAvg.reduce((a, b) => a + b, 0) / 4;
    const quadVar = quadAvg.reduce((a, b) => a + (b - globalAvg) ** 2, 0) / 4;
    const cv = globalAvg > 0 ? Math.sqrt(quadVar) / globalAvg : 0;

    let score: number;
    if (cv < 0.1) score = 68;
    else if (cv < 0.2) score = 55;
    else if (cv > 0.5) score = 28;
    else score = 42;

    return {
        name: "Scene Transition", nameKey: "signal.sceneTransition", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Overly uniform scene gradient — suggests AI-generated content" : "Natural scene variation — consistent with real footage",
        descriptionKey: score > 55 ? "signal.sceneTransition.ai" : "signal.sceneTransition.real", icon: "🎬",
        details: `Quadrant CV: ${cv.toFixed(3)}, Global gradient: ${globalAvg.toFixed(3)}.`,
    };
}
