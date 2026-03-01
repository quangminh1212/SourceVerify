/**
 * Color Temperature Consistency
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeColorTemperature(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Color Temperature Consistency", nameKey: "signal.colorTemperature",
            category: "forensic", score: 50, weight: 0.3,
            description: "Image too small for analysis",
            descriptionKey: "signal.colorTemperature.error", icon: "🌡️",
        };
    }

    let score: number;
    
    // Analyze local color temperature consistency across image regions
    const gridSize = 4;
    const cellW = Math.floor(w / gridSize), cellH = Math.floor(h / gridSize);
    const temps = [];
    for (let gy = 0; gy < gridSize; gy++) {
        for (let gx = 0; gx < gridSize; gx++) {
            let sumR = 0, sumB = 0, cnt = 0;
            for (let y = gy*cellH; y < (gy+1)*cellH && y < h; y += 3) {
                for (let x = gx*cellW; x < (gx+1)*cellW && x < w; x += 3) {
                    const idx = (y*w+x)*4;
                    sumR += pixels[idx];
                    sumB += pixels[idx+2];
                    cnt++;
                }
            }
            // R/B ratio approximates color temperature
            const rb = cnt > 0 && sumB > 0 ? sumR / sumB : 1;
            temps.push(rb);
        }
    }
    const avgTemp = temps.reduce((a,b)=>a+b,0) / temps.length;
    let maxDev = 0;
    for (const t of temps) maxDev = Math.max(maxDev, Math.abs(t - avgTemp));
    const cv = avgTemp > 0 ? maxDev / avgTemp : 0;
    if (cv > 0.15) score = 70;
    else if (cv > 0.08) score = 58;
    else if (cv < 0.02) score = 55;
    else score = 32;

    return {
        name: "Color Temperature Consistency", nameKey: "signal.colorTemperature",
        category: "forensic", score, weight: 0.3,
        description: score > 55
            ? "Inconsistent color temperature across regions — possible compositing or AI splicing"
            : "Consistent color temperature — single capture conditions confirmed",
        descriptionKey: score > 55 ? "signal.colorTemperature.ai" : "signal.colorTemperature.real",
        icon: "🌡️",
    };
}
