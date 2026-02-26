/**
 * Signal 9: Texture Consistency
 * Cross-region texture variance analysis
 */

import type { AnalysisSignal } from "../types";

export function analyzeTextureConsistency(pixels: Uint8ClampedArray, width: number, height: number): AnalysisSignal {
    const regionSize = Math.min(64, Math.floor(Math.min(width, height) / 4));
    const positions = [
        [0, 0], [width - regionSize, 0],
        [0, height - regionSize], [width - regionSize, height - regionSize],
        [Math.floor(width / 2 - regionSize / 2), Math.floor(height / 2 - regionSize / 2)],
    ];

    const regions: number[] = [];
    for (const [sx, sy] of positions) {
        let localVar = 0, count = 0;
        for (let y = sy; y < sy + regionSize - 1; y++) {
            for (let x = sx; x < sx + regionSize - 1; x++) {
                const idx = (y * width + x) * 4;
                const idxN = (y * width + x + 1) * 4;
                localVar += Math.abs(pixels[idx] - pixels[idxN]) + Math.abs(pixels[idx + 1] - pixels[idxN + 1]) + Math.abs(pixels[idx + 2] - pixels[idxN + 2]);
                count++;
            }
        }
        regions.push(count > 0 ? localVar / count : 0);
    }

    const avg = regions.reduce((a, b) => a + b, 0) / regions.length;
    const regionVar = regions.reduce((a, b) => a + (b - avg) ** 2, 0) / regions.length;
    const regionCV = avg > 0 ? Math.sqrt(regionVar) / avg : 0;

    let score: number;
    if (regionCV < 0.2) score = 70;
    else if (regionCV < 0.4) score = 52;
    else if (regionCV < 0.7) score = 36;
    else score = 20;

    return {
        name: "Texture Consistency", nameKey: "signal.textureConsistency",
        category: "texture", score, weight: 1.5,
        description: score > 55
            ? "Texture is unusually consistent across regions — common in AI generation"
            : "Texture varies naturally across regions",
        descriptionKey: score > 55 ? "signal.texture.ai" : "signal.texture.real",
        icon: "◇",
        details: `Region CV: ${regionCV.toFixed(3)}, Regions: ${regions.map(r => r.toFixed(1)).join(", ")}.`,
    };
}
