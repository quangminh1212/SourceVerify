/**
 * Signal 10: CFA Pattern Detection
 * Bayer filter demosaicing artifacts (camera fingerprint)
 * Real cameras create subtle 2x2 periodic patterns
 * v4: Wider scoring range with 6 grades
 */

import type { AnalysisMethod } from "../types";

export function analyzeCFAPattern(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    let periodicEnergy = 0;
    let totalEnergy = 0;
    let count = 0;

    const step = Math.max(2, Math.floor(Math.min(width, height) / 300));

    for (let y = 2; y < height - 2; y += step) {
        for (let x = 2; x < width - 2; x += step) {
            const getG = (px: number, py: number) => pixels[(py * width + px) * 4 + 1];

            const center = getG(x, y);
            const right = getG(x + 1, y);
            const down = getG(x, y + 1);
            const diag = getG(x + 1, y + 1);
            const right2 = getG(x + 2, y);
            const down2 = getG(x, y + 2);

            const periodic = Math.abs((center - right) - (down - diag));
            const gradient = Math.abs(center - right2) + Math.abs(center - down2);

            periodicEnergy += periodic;
            totalEnergy += gradient + 1;
            count++;
        }
    }

    const cfaRatio = count > 0 && totalEnergy > 0 ? periodicEnergy / totalEnergy : 0;

    let score: number;
    if (cfaRatio < 0.08) score = 85;
    else if (cfaRatio < 0.15) score = 70;
    else if (cfaRatio < 0.25) score = 55;
    else if (cfaRatio < 0.38) score = 38;
    else if (cfaRatio < 0.52) score = 22;
    else score = 10;

    return {
        name: "CFA Pattern Detection", nameKey: "signal.cfaPattern",
        category: "optics", score, weight: 1.5,
        description: score > 55
            ? "No Bayer CFA demosaicing pattern found — real cameras leave this fingerprint"
            : "CFA demosaicing artifacts present — characteristic of real camera sensors",
        descriptionKey: score > 55 ? "signal.cfa.ai" : "signal.cfa.real",
        icon: "⊡",
        details: `CFA ratio: ${cfaRatio.toFixed(3)}, Samples: ${count}. Real cameras typically show ratio > 0.3.`,
    };
}
