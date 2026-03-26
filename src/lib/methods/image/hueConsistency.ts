/**
 * Hue Consistency
 * AI detection method
 */
import type { AnalysisMethod } from "../../types";

export function analyzeHueConsistency(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Hue Consistency", nameKey: "signal.hueConsistency", category: "statistical", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.hueConsistency.error", icon: "🎨" };
    }
    const hues: number[] = []; const step = 4; for (let y = 0; y < h; y += step)for (let x = 0; x < w; x += step) { const i = (y * w + x) * 4; const r2 = p[i] / 255, g = p[i + 1] / 255, b = p[i + 2] / 255; const mx = Math.max(r2, g, b), mn = Math.min(r2, g, b), d = mx - mn; if (d > 0.05) { let h2 = 0; if (mx === r2) h2 = ((g - b) / d) % 6; else if (mx === g) h2 = (b - r2) / d + 2; else h2 = (r2 - g) / d + 4; hues.push(h2 * 60); } }
    let score: number;
    if (hues.length < 10) {
        score = 50;
    } else {
        const avg = hues.reduce((a, b) => a + b, 0) / hues.length;
        const vari = hues.reduce((a, b) => a + (b - avg) ** 2, 0) / hues.length;
        const cv = avg !== 0 ? Math.sqrt(vari) / Math.abs(avg) : 0;
        if (cv < 0.3) score = 66; else if (cv < 0.6) score = 50; else if (cv > 1.5) score = 28; else score = 44;
    }
    return {
        name: "Hue Consistency", nameKey: "signal.hueConsistency", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Hue Consistency pattern suggests AI generation" : "Natural hue consistency — consistent with real image",
        descriptionKey: score > 55 ? "signal.hueConsistency.ai" : "signal.hueConsistency.real", icon: "🎨",
        details: `Hues sampled: ${hues.length}`,
    };
}
