/**
 * Style Transfer Detection
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeStyleTransfer(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Style Transfer Detection", nameKey: "signal.styleTransfer",
            category: "sensor", score: 50, weight: 0.3,
            description: "Image too small for analysis",
            descriptionKey: "signal.styleTransfer.error", icon: "🎨",
        };
    }

    let score: number;
    
    // Detect neural style transfer via texture uniformity analysis (Gram matrix proxy)
    const patchSize = 32;
    const patchesX = Math.min(Math.floor(w / patchSize), 8);
    const patchesY = Math.min(Math.floor(h / patchSize), 8);
    const gramFeatures = [];
    for (let py = 0; py < patchesY; py++) {
        for (let px = 0; px < patchesX; px++) {
            let mean = 0, var_ = 0, cnt = 0;
            // Compute texture statistics per patch
            for (let dy = 0; dy < patchSize; dy++) {
                for (let dx = 0; dx < patchSize; dx++) {
                    const idx = ((py*patchSize+dy)*w + px*patchSize+dx) * 4;
                    const lum = 0.299*pixels[idx]+0.587*pixels[idx+1]+0.114*pixels[idx+2];
                    mean += lum;
                    cnt++;
                }
            }
            mean /= cnt;
            cnt = 0;
            for (let dy = 0; dy < patchSize; dy++) {
                for (let dx = 0; dx < patchSize; dx++) {
                    const idx = ((py*patchSize+dy)*w + px*patchSize+dx) * 4;
                    const lum = 0.299*pixels[idx]+0.587*pixels[idx+1]+0.114*pixels[idx+2];
                    var_ += (lum - mean) ** 2;
                    cnt++;
                }
            }
            gramFeatures.push(Math.sqrt(var_ / cnt));
        }
    }
    // Style transfer makes texture statistics uniform across patches
    const avgGram = gramFeatures.reduce((a,b)=>a+b,0) / gramFeatures.length;
    let gramVar = 0;
    for (const g of gramFeatures) gramVar += (g - avgGram) ** 2;
    gramVar = Math.sqrt(gramVar / gramFeatures.length);
    const gramCV = avgGram > 0 ? gramVar / avgGram : 0;
    if (gramCV < 0.1) score = 72;
    else if (gramCV < 0.2) score = 60;
    else if (gramCV > 0.6) score = 30;
    else score = 42;

    return {
        name: "Style Transfer Detection", nameKey: "signal.styleTransfer",
        category: "sensor", score, weight: 0.3,
        description: score > 55
            ? "Unnaturally uniform texture statistics — neural style transfer artifacts detected"
            : "Natural texture variation — no style transfer processing detected",
        descriptionKey: score > 55 ? "signal.styleTransfer.ai" : "signal.styleTransfer.real",
        icon: "🎨",
    };
}
