/**
 * Color Moment Statistics
 * AI detection method - Color Moment Statistics
 */
import type { AnalysisMethod } from "../../types";

export function analyzeColorMomentStatistics(p: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return { name: "Color Moment Statistics", nameKey: "signal.colorMoments", category: "statistical", score: 50, weight: 0.2, description: "Image too small", descriptionKey: "signal.colorMoments.error", icon: "🌈" };
    }
    const ch: number[][] = [[], [], []]; const step = 3; for (let y = 0; y < h; y += step)for (let x = 0; x < w; x += step) { const i = (y * w + x) * 4; ch[0].push(p[i]); ch[1].push(p[i + 1]); ch[2].push(p[i + 2]); } const stats = ch.map(c => { const m = c.reduce((a: number, b: number) => a + b, 0) / c.length; const v = c.reduce((a: number, b: number) => a + (b - m) ** 2, 0) / c.length; const sk = c.reduce((a: number, b: number) => a + (b - m) ** 3, 0) / (c.length * Math.pow(v, 1.5) || 1); return { m, v: Math.sqrt(v), sk }; }); const skewAvg = Math.abs(stats.reduce((a, s) => a + s.sk, 0) / 3);
    let score: number;
    if (skewAvg < 0.1) score = 66; else if (skewAvg < 0.3) score = 52; else if (skewAvg > 1.0) score = 30; else score = 44;
    return {
        name: "Color Moment Statistics", nameKey: "signal.colorMoments", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "Symmetric color distribution — typical of AI generation" : "Natural color moment skew — consistent with real image",
        descriptionKey: score > 55 ? "signal.colorMoments.ai" : "signal.colorMoments.real", icon: "🌈",
        details: `Avg skewness: ${skewAvg.toFixed(3)}`,
    };
}
