/**
 * Signal 8: Chromatic Aberration
 * Lens color fringing at image borders
 */

import type { AnalysisSignal } from "../types";

export function analyzeChromaticAberration(pixels: Uint8ClampedArray, width: number, height: number): AnalysisSignal {
    const borderWidth = Math.max(20, Math.floor(Math.min(width, height) * 0.05));
    let totalShift = 0, shiftCount = 0;
    const step = Math.max(2, Math.floor(borderWidth / 10));

    const checkShift = (x: number, y: number) => {
        if (x < 1 || x >= width - 1 || y < 1 || y >= height - 1) return;
        const idx = (y * width + x) * 4;
        const idxR = (y * width + x + 1) * 4;
        totalShift += Math.abs(Math.abs(pixels[idx] - pixels[idxR]) - Math.abs(pixels[idx + 2] - pixels[idxR + 2]));
        shiftCount++;
    };

    for (let x = 0; x < width; x += step) {
        for (let y = 0; y < borderWidth; y += step) checkShift(x, y);
        for (let y = height - borderWidth; y < height; y += step) checkShift(x, y);
    }
    for (let y = 0; y < height; y += step) {
        for (let x = 0; x < borderWidth; x += step) checkShift(x, y);
        for (let x = width - borderWidth; x < width; x += step) checkShift(x, y);
    }

    const avgShift = shiftCount > 0 ? totalShift / shiftCount : 0;

    let score: number;
    if (avgShift < 1.0) score = 70;
    else if (avgShift < 2.0) score = 55;
    else if (avgShift < 4.0) score = 38;
    else if (avgShift < 8.0) score = 25;
    else score = 15;

    return {
        name: "Chromatic Aberration", nameKey: "signal.chromaticAberration",
        category: "optics", score, weight: 0.5,
        description: score > 55
            ? "No chromatic aberration — real camera lenses produce color fringing"
            : "Chromatic aberration present — consistent with real camera optics",
        descriptionKey: score > 55 ? "signal.chromatic.ai" : "signal.chromatic.real",
        icon: "◐",
        details: `Avg R-B edge shift: ${avgShift.toFixed(2)}, Samples: ${shiftCount}. Real lenses > 3.0.`,
    };
}
