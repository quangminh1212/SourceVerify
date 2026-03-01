/**
 * Neural Compression Artifact Detection
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeNeuralCompression(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Neural Compression Artifact Detection", nameKey: "signal.neuralCompression",
            category: "sensor", score: 50, weight: 0.35,
            description: "Image too small for analysis",
            descriptionKey: "signal.neuralCompression.error", icon: "⚡",
        };
    }

    let score: number;
    
    // Detect neural network compression artifacts (checkerboard, quantization steps)
    // Check for 2x2 and 4x4 periodic patterns (deconvolution checkerboard)
    let checker2 = 0, checker4 = 0, totalChecked = 0;
    for (let y = 0; y < Math.min(h, 200) - 4; y += 2) {
        for (let x = 0; x < Math.min(w, 200) - 4; x += 2) {
            const idx = (y*w+x)*4;
            const a = pixels[idx], b = pixels[idx+4];
            const c = pixels[(idx+w*4)], d = pixels[(idx+w*4+4)];
            // 2x2 checkerboard: alternating high-low pattern
            if ((a > b && c < d) || (a < b && c > d)) checker2++;
            totalChecked++;
            // 4x4 pattern
            if (x + 4 < w && y + 4 < h) {
                const e = pixels[((y+2)*w+x)*4], f = pixels[((y+2)*w+x+2)*4];
                if (Math.abs(a - f) < 3 && Math.abs(b - e) < 3 && Math.abs(a - b) > 5) checker4++;
            }
        }
    }
    const checkerRatio = totalChecked > 0 ? checker2 / totalChecked : 0;
    const checker4Ratio = totalChecked > 0 ? checker4 / totalChecked : 0;
    // Check color quantization steps
    const hist = new Uint32Array(256);
    for (let i = 0; i < Math.min(w*h*4, 200000); i += 4) hist[pixels[i]]++;
    let quantSteps = 0;
    for (let i = 4; i < 252; i += 4) {
        if (hist[i] > hist[i-1]*1.5 && hist[i] > hist[i+1]*1.5) quantSteps++;
    }
    if (checkerRatio > 0.6 || checker4Ratio > 0.3) score = 75;
    else if (quantSteps > 10) score = 68;
    else if (checkerRatio > 0.45) score = 58;
    else if (checkerRatio < 0.35 && quantSteps < 3) score = 30;
    else score = 45;

    return {
        name: "Neural Compression Artifact Detection", nameKey: "signal.neuralCompression",
        category: "sensor", score, weight: 0.35,
        description: score > 55
            ? "Neural network compression fingerprints detected — checkerboard/quantization artifacts"
            : "No neural compression artifacts — standard image processing pipeline",
        descriptionKey: score > 55 ? "signal.neuralCompression.ai" : "signal.neuralCompression.real",
        icon: "⚡",
    };
}
