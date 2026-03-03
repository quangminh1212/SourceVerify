/**
 * Head Pose V2 Analysis
 * Enhanced head pose analysis using multi-region face gradient mapping
 */
import type { AnalysisMethod } from "../../types";

export function analyzeHeadPoseV2(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Head Pose V2", nameKey: "signal.headPoseV2", category: "pixel", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.headPoseV2.error", icon: "🗣" };
    }
    // Multi-zone face analysis: forehead, nose, chin
    const zones = [
        { x: Math.floor(w * 0.3), y: Math.floor(h * 0.05), w: Math.floor(w * 0.4), h: Math.floor(h * 0.15) },
        { x: Math.floor(w * 0.35), y: Math.floor(h * 0.25), w: Math.floor(w * 0.3), h: Math.floor(h * 0.15) },
        { x: Math.floor(w * 0.3), y: Math.floor(h * 0.45), w: Math.floor(w * 0.4), h: Math.floor(h * 0.1) },
    ];
    const zoneMeans: number[] = [];
    for (const z of zones) {
        let sum = 0, cnt = 0;
        for (let y = z.y; y < z.y + z.h && y < h; y += 2)for (let x = z.x; x < z.x + z.w && x < w; x += 2) {
            const i = (y * w + x) * 4; sum += pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114; cnt++;
        }
        zoneMeans.push(cnt > 0 ? sum / cnt : 0);
    }
    const gradForehead = Math.abs(zoneMeans[0] - zoneMeans[1]);
    const gradChin = Math.abs(zoneMeans[1] - zoneMeans[2]);
    const consistency = Math.abs(gradForehead - gradChin);
    let score: number;
    if (consistency < 3) score = 66; else if (consistency > 15) score = 32; else score = 48;
    return {
        name: "Head Pose V2", nameKey: "signal.headPoseV2", category: "pixel", score, weight: 0.2,
        description: score > 55 ? "Head pose gradient anomaly — possible AI artifact" : "Natural head pose gradient — authentic",
        descriptionKey: score > 55 ? "signal.headPoseV2.ai" : "signal.headPoseV2.real", icon: "🗣",
        details: `Zone means: [${zoneMeans.map(v => v.toFixed(1)).join(', ')}], Consistency: ${consistency.toFixed(2)}`,
    };
}
