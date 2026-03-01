import type { AnalysisMethod } from "../types";

/**
 * Advanced Color Analysis Signals (2 methods)
 * Extended color forensics beyond basic channel correlation
 *
 * References:
 * - Popescu & Farid, "Exposing Digital Forgeries by Detecting Traces of Resampling", IEEE TSP 2005
 * - Van de Weijer et al., "Edge-Based Color Constancy", IEEE TIP 2007
 */

import type { AnalysisMethod } from "../types";

/**
 * Signal 42: Color Gamut Analysis
 * Detects out-of-gamut or unnaturally distributed colors
 * AI images may produce colors that deviate from natural camera gamut
 */
export function analyzeColorGamut(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const totalPixels = width * height;
    const step = Math.max(1, Math.floor(totalPixels / 50000));

    let extremeCount = 0;
    let nearClipCount = 0;
    let totalSampled = 0;
    let highSatHighBright = 0;

    // Color gamut statistics
    for (let i = 0; i < totalPixels * 4; i += step * 4) {
        const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
        totalSampled++;

        // Pure/extreme colors (fully saturated)
        if ((r >= 254 && g <= 1 && b <= 1) || (r <= 1 && g >= 254 && b <= 1) ||
            (r <= 1 && g <= 1 && b >= 254) || (r >= 254 && g >= 254 && b <= 1) ||
            (r >= 254 && g <= 1 && b >= 254) || (r <= 1 && g >= 254 && b >= 254)) {
            extremeCount++;
        }

        // Near clipping (close to pure black or white)
        if ((r <= 2 && g <= 2 && b <= 2) || (r >= 253 && g >= 253 && b >= 253)) {
            nearClipCount++;
        }

        // High saturation + high brightness = unnatural
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max > 0 ? (max - min) / max : 0;
        const brightness = max / 255;
        if (saturation > 0.8 && brightness > 0.8) highSatHighBright++;
    }

    const extremeRatio = totalSampled > 0 ? extremeCount / totalSampled : 0;
    const clipRatio = totalSampled > 0 ? nearClipCount / totalSampled : 0;
    const vibrantRatio = totalSampled > 0 ? highSatHighBright / totalSampled : 0;

    // AI images: more vibrant colors, fewer clipping artifacts
    let score = 50;
    if (vibrantRatio > 0.15) score += 18;
    else if (vibrantRatio > 0.08) score += 10;
    else if (vibrantRatio > 0.04) score += 3;
    else if (vibrantRatio < 0.01) score -= 8;

    if (clipRatio < 0.001) score += 10; // no clipping = may be AI
    else if (clipRatio > 0.05) score -= 10; // real photos often clip

    if (extremeRatio > 0.01) score += 5; // extreme colors = AI-like

    score = Math.max(5, Math.min(95, score));

    return {
        name: "Color Gamut Analysis", nameKey: "signal.colorGamut",
        category: "color", score, weight: 0.4,
        description: score > 55
            ? "Color gamut shows unnatural vibrancy — AI images often exceed natural camera gamut"
            : "Color gamut falls within natural range — consistent with camera sensor response",
        descriptionKey: score > 55 ? "signal.gamut.ai" : "signal.gamut.real",
        icon: "◉",
        details: `Vibrant ratio: ${vibrantRatio.toFixed(4)}, Clip ratio: ${clipRatio.toFixed(4)}, Extreme: ${extremeRatio.toFixed(5)}.`,
    };
}
