/**
 * Illuminant Map Analysis
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeIlluminantMap(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Illuminant Map Analysis", nameKey: "signal.illuminantMap",
            category: "forensic", score: 50, weight: 0.35,
            description: "Image too small for analysis",
            descriptionKey: "signal.illuminantMap.error", icon: "💡",
        };
    }

    let score: number;
    
    // Estimate local illuminant color across image regions
    const gridSize = 4;
    const cellW = Math.floor(w / gridSize), cellH = Math.floor(h / gridSize);
    const illuminants = [];
    for (let gy = 0; gy < gridSize; gy++) {
        for (let gx = 0; gx < gridSize; gx++) {
            let sumR = 0, sumG = 0, sumB = 0, cnt = 0;
            const step = Math.max(1, Math.floor(cellW * cellH / 2000));
            for (let y = gy*cellH; y < (gy+1)*cellH; y += Math.max(1, Math.floor(cellH/30))) {
                for (let x = gx*cellW; x < (gx+1)*cellW; x += Math.max(1, Math.floor(cellW/30))) {
                    const idx = (y * w + x) * 4;
                    sumR += pixels[idx]; sumG += pixels[idx+1]; sumB += pixels[idx+2];
                    cnt++;
                }
            }
            if (cnt > 0) {
                const total = sumR + sumG + sumB;
                if (total > 0) illuminants.push({ r: sumR/total, g: sumG/total, b: sumB/total });
            }
        }
    }
    // Compute illuminant consistency
    if (illuminants.length < 4) { score = 50; } else {
        const avgR = illuminants.reduce((a,b)=>a+b.r,0)/illuminants.length;
        const avgG = illuminants.reduce((a,b)=>a+b.g,0)/illuminants.length;
        let maxDev = 0;
        for (const ill of illuminants) {
            const dev = Math.sqrt((ill.r-avgR)**2 + (ill.g-avgG)**2);
            maxDev = Math.max(maxDev, dev);
        }
        let score_;
        if (maxDev > 0.08) score_ = 70;
        else if (maxDev > 0.04) score_ = 55;
        else if (maxDev < 0.015) score_ = 60;
        else score_ = 35;
        score = score_;
    }

    return {
        name: "Illuminant Map Analysis", nameKey: "signal.illuminantMap",
        category: "forensic", score, weight: 0.35,
        description: score > 55
            ? "Inconsistent illuminant estimates across regions — possible splicing or AI composition"
            : "Consistent illuminant color across image — single light source confirmed",
        descriptionKey: score > 55 ? "signal.illuminantMap.ai" : "signal.illuminantMap.real",
        icon: "💡",
    };
}
