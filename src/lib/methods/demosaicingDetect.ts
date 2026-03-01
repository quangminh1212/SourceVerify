/**
 * Demosaicing Artifact Analysis
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeDemosaicing(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Demosaicing Artifact Analysis", nameKey: "signal.demosaicing",
            category: "sensor", score: 50, weight: 0.35,
            description: "Image too small for analysis",
            descriptionKey: "signal.demosaicing.error", icon: "🔬",
        };
    }

    let score: number;
    
    // Detect CFA demosaicing patterns — real cameras show specific inter-channel correlations
    const size = Math.min(w, h, 200);
    const scX = w / size, scY = h / size;
    let crossCorr = 0, autoCorr = 0, count = 0;
    for (let y = 1; y < size - 1; y += 2) {
        for (let x = 1; x < size - 1; x += 2) {
            const idx = (Math.floor(y*scY) * w + Math.floor(x*scX)) * 4;
            const r = pixels[idx], g = pixels[idx+1], b = pixels[idx+2];
            const idx2 = (Math.floor(y*scY) * w + Math.floor((x+1)*scX)) * 4;
            const r2 = pixels[idx2], g2 = pixels[idx2+1], b2 = pixels[idx2+2];
            // Bayer pattern creates specific R-G, G-B correlation patterns
            crossCorr += Math.abs((r - g) - (r2 - g2));
            autoCorr += Math.abs((g - b) - (g2 - b2));
            count++;
        }
    }
    crossCorr = count > 0 ? crossCorr / count : 0;
    autoCorr = count > 0 ? autoCorr / count : 0;
    // Real cameras: crossCorr typically 5-25, autoCorr 3-15
    // AI images: more uniform, crossCorr < 5 or very high
    if (crossCorr > 5 && crossCorr < 30 && autoCorr > 2 && autoCorr < 20) score = 25;
    else if (crossCorr < 3) score = 72;
    else if (crossCorr > 40) score = 65;
    else score = 50;

    return {
        name: "Demosaicing Artifact Analysis", nameKey: "signal.demosaicing",
        category: "sensor", score, weight: 0.35,
        description: score > 55
            ? "Missing CFA demosaicing patterns — image likely not from physical camera sensor"
            : "CFA interpolation patterns detected — consistent with real camera sensor",
        descriptionKey: score > 55 ? "signal.demosaicing.ai" : "signal.demosaicing.real",
        icon: "🔬",
    };
}
