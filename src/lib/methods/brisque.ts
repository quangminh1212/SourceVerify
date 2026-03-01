/**
 * BRISQUE Quality Assessment
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeBrisque(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "BRISQUE Quality Assessment", nameKey: "signal.brisque",
            category: "statistical", score: 50, weight: 0.3,
            description: "Image too small for analysis",
            descriptionKey: "signal.brisque.error", icon: "📊",
        };
    }

    let score: number;
    
    // Simplified BRISQUE: analyze local normalized luminance statistics
    const blockSize = 7;
    const grayW = Math.min(w, 256), grayH = Math.min(h, 256);
    const scX = w / grayW, scY = h / grayH;
    const gray = new Float32Array(grayW * grayH);
    for (let y = 0; y < grayH; y++) {
        for (let x = 0; x < grayW; x++) {
            const idx = (Math.floor(y*scY) * w + Math.floor(x*scX)) * 4;
            gray[y*grayW+x] = 0.299*pixels[idx] + 0.587*pixels[idx+1] + 0.114*pixels[idx+2];
        }
    }
    // Compute MSCN coefficients
    let shapeParam = 0, varianceParam = 0, count = 0;
    const half = Math.floor(blockSize / 2);
    for (let y = half; y < grayH - half; y += 3) {
        for (let x = half; x < grayW - half; x += 3) {
            let mean = 0, var_ = 0, n = 0;
            for (let dy = -half; dy <= half; dy++) {
                for (let dx = -half; dx <= half; dx++) {
                    mean += gray[(y+dy)*grayW+(x+dx)];
                    n++;
                }
            }
            mean /= n;
            for (let dy = -half; dy <= half; dy++) {
                for (let dx = -half; dx <= half; dx++) {
                    var_ += (gray[(y+dy)*grayW+(x+dx)] - mean) ** 2;
                }
            }
            var_ = Math.sqrt(var_ / n + 1);
            const mscn = (gray[y*grayW+x] - mean) / var_;
            shapeParam += Math.abs(mscn);
            varianceParam += mscn * mscn;
            count++;
        }
    }
    shapeParam = count > 0 ? shapeParam / count : 0;
    varianceParam = count > 0 ? Math.sqrt(varianceParam / count) : 0;
    // Natural images: shapeParam ≈ 0.7-0.9, varianceParam ≈ 0.8-1.2
    if (shapeParam < 0.4 || shapeParam > 1.5) score = 70;
    else if (varianceParam < 0.5 || varianceParam > 1.8) score = 65;
    else if (shapeParam > 0.6 && shapeParam < 1.0 && varianceParam > 0.7 && varianceParam < 1.3) score = 25;
    else score = 45;

    return {
        name: "BRISQUE Quality Assessment", nameKey: "signal.brisque",
        category: "statistical", score, weight: 0.3,
        description: score > 55
            ? "Unnatural image statistics — deviates from natural scene model"
            : "Natural scene statistics consistent with real photography",
        descriptionKey: score > 55 ? "signal.brisque.ai" : "signal.brisque.real",
        icon: "📊",
    };
}
