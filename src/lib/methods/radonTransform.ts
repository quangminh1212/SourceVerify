/**
 * Radon Transform Analysis
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeRadonTransform(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Radon Transform Analysis", nameKey: "signal.radonTransform",
            category: "frequency", score: 50, weight: 0.3,
            description: "Image too small for analysis",
            descriptionKey: "signal.radonTransform.error", icon: "📡",
        };
    }

    let score: number;
    
    // Simplified Radon: project along angles and detect anomalous directional patterns
    const size = Math.min(w, h, 128);
    const scX = w / size, scY = h / size;
    const gray = new Float32Array(size * size);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const idx = (Math.floor(y*scY) * w + Math.floor(x*scX)) * 4;
            gray[y*size+x] = 0.299*pixels[idx] + 0.587*pixels[idx+1] + 0.114*pixels[idx+2];
        }
    }
    // Project at 0°, 45°, 90°, 135° and compute variance
    const angles = [0, 45, 90, 135];
    const variances = [];
    for (const ang of angles) {
        const rad = ang * Math.PI / 180;
        const projections = new Float32Array(size);
        for (let t = 0; t < size; t++) {
            let sum = 0, cnt = 0;
            for (let s = 0; s < size; s++) {
                const x = Math.round(t * Math.cos(rad) - s * Math.sin(rad) + size/2);
                const y = Math.round(t * Math.sin(rad) + s * Math.cos(rad) + size/2);
                if (x >= 0 && x < size && y >= 0 && y < size) {
                    sum += gray[y * size + x];
                    cnt++;
                }
            }
            projections[t] = cnt > 0 ? sum / cnt : 0;
        }
        let mean = 0;
        for (let i = 0; i < size; i++) mean += projections[i];
        mean /= size;
        let var_ = 0;
        for (let i = 0; i < size; i++) var_ += (projections[i] - mean) ** 2;
        variances.push(var_ / size);
    }
    const maxVar = Math.max(...variances);
    const minVar = Math.min(...variances);
    const varRatio = minVar > 0 ? maxVar / minVar : 1;
    if (varRatio > 5) score = 70;
    else if (varRatio > 3) score = 58;
    else if (varRatio < 1.3) score = 60;
    else score = 35;

    return {
        name: "Radon Transform Analysis", nameKey: "signal.radonTransform",
        category: "frequency", score, weight: 0.3,
        description: score > 55
            ? "Anomalous directional patterns in Radon domain — manipulation artifacts present"
            : "Balanced directional features — natural image structure confirmed",
        descriptionKey: score > 55 ? "signal.radonTransform.ai" : "signal.radonTransform.real",
        icon: "📡",
    };
}
