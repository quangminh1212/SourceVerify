/**
 * ViT Token Analysis
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeVitDetection(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "ViT Token Analysis", nameKey: "signal.vitDetection",
            category: "sensor", score: 50, weight: 0.3,
            description: "Image too small for analysis",
            descriptionKey: "signal.vitDetection.error", icon: "🔲",
        };
    }

    let score: number;
    // Analyze image in patch-based manner similar to Vision Transformer
    const patchSize = 16;
    const patchesX = Math.min(Math.floor(w / patchSize), 14);
    const patchesY = Math.min(Math.floor(h / patchSize), 14);
    const patchEntropies: number[] = [];
    for (let py = 0; py < patchesY; py++) {
        for (let px = 0; px < patchesX; px++) {
            const hist = new Uint32Array(32);
            for (let dy = 0; dy < patchSize; dy++) {
                for (let dx = 0; dx < patchSize; dx++) {
                    const idx = ((py * patchSize + dy) * w + px * patchSize + dx) * 4;
                    hist[Math.floor(pixels[idx] / 8)]++;
                }
            }
            let entropy = 0;
            const total = patchSize * patchSize;
            for (let i = 0; i < 32; i++) {
                const p = hist[i] / total;
                if (p > 0) entropy -= p * Math.log2(p);
            }
            patchEntropies.push(entropy);
        }
    }
    const avgEntropy = patchEntropies.reduce((a, b) => a + b, 0) / patchEntropies.length;
    let entropyVar = 0;
    for (const e of patchEntropies) entropyVar += (e - avgEntropy) ** 2;
    entropyVar = Math.sqrt(entropyVar / patchEntropies.length);
    const cv = avgEntropy > 0 ? entropyVar / avgEntropy : 0;
    if (cv < 0.12) score = 68;
    else if (cv < 0.2) score = 55;
    else if (cv > 0.5) score = 28;
    else score = 40;

    return {
        name: "ViT Token Analysis", nameKey: "signal.vitDetection",
        category: "sensor", score, weight: 0.3,
        description: score > 55
            ? "Unnaturally uniform patch entropy — ViT-based generation pattern"
            : "Natural patch entropy variation — real image characteristics",
        descriptionKey: score > 55 ? "signal.vitDetection.ai" : "signal.vitDetection.real",
        icon: "🔲",
    };
}
