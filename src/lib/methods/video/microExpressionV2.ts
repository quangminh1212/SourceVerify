/**
 * Micro Expression V2 Analysis
 * Enhanced micro-expression detection using facial region intensity analysis
 */
import type { AnalysisMethod } from "../../types";

export function analyzeMicroExpressionV2(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Micro Expression V2", nameKey: "signal.microExpressionV2", category: "sensor", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.microExpressionV2.error", icon: "😐" };
    }
    // Analyze facial sub-regions for micro-expression cues
    const regions = [
        { x: Math.floor(w * 0.2), y: Math.floor(h * 0.15), w: Math.floor(w * 0.25), h: Math.floor(h * 0.1) }, // left eye
        { x: Math.floor(w * 0.55), y: Math.floor(h * 0.15), w: Math.floor(w * 0.25), h: Math.floor(h * 0.1) }, // right eye
        { x: Math.floor(w * 0.3), y: Math.floor(h * 0.4), w: Math.floor(w * 0.4), h: Math.floor(h * 0.15) }, // mouth
    ];
    const regionVars: number[] = [];
    for (const r of regions) {
        let sum = 0, cnt = 0; const vals: number[] = [];
        for (let y = r.y; y < r.y + r.h && y < h; y += 2)for (let x = r.x; x < r.x + r.w && x < w; x += 2) {
            const i = (y * w + x) * 4; const g = pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
            vals.push(g); sum += g; cnt++;
        }
        const mean = cnt > 0 ? sum / cnt : 0;
        const v = cnt > 1 ? vals.reduce((a, b) => a + (b - mean) ** 2, 0) / cnt : 0;
        regionVars.push(v);
    }
    const meanVar = regionVars.reduce((a, b) => a + b, 0) / regionVars.length;
    const varSpread = regionVars.reduce((a, b) => a + Math.abs(b - meanVar), 0) / regionVars.length;
    let score: number;
    if (varSpread < 5 && meanVar < 50) score = 65; else if (varSpread > 20) score = 33; else score = 48;
    return {
        name: "Micro Expression V2", nameKey: "signal.microExpressionV2", category: "sensor", score, weight: 0.2,
        description: score > 55 ? "Micro-expression anomaly — possible AI generation" : "Natural micro-expressions — authentic",
        descriptionKey: score > 55 ? "signal.microExpressionV2.ai" : "signal.microExpressionV2.real", icon: "😐",
        details: `Region vars: [${regionVars.map(v => v.toFixed(1)).join(', ')}], Spread: ${varSpread.toFixed(2)}`,
    };
}
