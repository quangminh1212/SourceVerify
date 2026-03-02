/**
 * Background Stability Analysis
 * AI-generated videos often have unstable or warping backgrounds
 * Reference: Durall et al. (2020) - Watch Your Up-Convolution, CVPR Workshop
 */
import type { AnalysisMethod } from "../../types";

export function analyzeBackgroundStability(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Background Stability", nameKey: "signal.backgroundStability", category: "forensic", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.backgroundStability.error", icon: "🏔" };
    }
    // Analyze periphery regions (top/bottom/sides) for stability
    const margin = Math.floor(Math.min(w, h) * 0.15);
    let edgeVariance = 0, edgeCount = 0;
    for (let y = 0; y < h; y += 2) {
        for (let x = 0; x < w; x += 2) {
            if (x > margin && x < w - margin && y > margin && y < h - margin) continue;
            if (x >= w - 1 || y >= h - 1) continue;
            const idx = (y * w + x) * 4;
            const diff = Math.abs(pixels[idx] - pixels[idx + 4]) + Math.abs(pixels[idx] - pixels[idx + w * 4]);
            edgeVariance += diff;
            edgeCount++;
        }
    }
    const avgEdgeVar = edgeCount > 0 ? edgeVariance / (edgeCount * 2) : 0;
    // Check center vs edge contrast
    let centerVar = 0, cCount = 0;
    const cx = Math.floor(w * 0.3), cy = Math.floor(h * 0.3), cw = Math.floor(w * 0.4), ch = Math.floor(h * 0.4);
    for (let y = cy; y < cy + ch && y < h - 1; y += 2) {
        for (let x = cx; x < cx + cw && x < w - 1; x += 2) {
            const idx = (y * w + x) * 4;
            centerVar += Math.abs(pixels[idx] - pixels[idx + 4]) + Math.abs(pixels[idx] - pixels[idx + w * 4]);
            cCount++;
        }
    }
    const avgCenterVar = cCount > 0 ? centerVar / (cCount * 2) : 0;
    const ratio = avgCenterVar > 0 ? avgEdgeVar / avgCenterVar : 1;

    let score: number;
    if (ratio < 0.5 && avgEdgeVar < 3) score = 72;
    else if (ratio < 0.7) score = 60;
    else if (ratio > 1.3) score = 30;
    else score = 44;

    return {
        name: "Background Stability", nameKey: "signal.backgroundStability", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Unnaturally stable background — AI videos often have static or warping backgrounds" : "Natural background variation — consistent with real video",
        descriptionKey: score > 55 ? "signal.backgroundStability.ai" : "signal.backgroundStability.real", icon: "🏔",
        details: `Edge/Center ratio: ${ratio.toFixed(3)}, Edge variance: ${avgEdgeVar.toFixed(3)}.`,
    };
}
