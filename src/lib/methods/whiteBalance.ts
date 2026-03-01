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

/**
 * Signal 43: White Balance Consistency
 * Van de Weijer et al. (2007) - Color constancy analysis
 * Checks if white balance is consistent across the image
 */
export function analyzeWhiteBalance(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const regionSize = Math.min(64, Math.floor(Math.min(width, height) / 4));
    const positions = [
        [0, 0], [width - regionSize, 0],
        [0, height - regionSize], [width - regionSize, height - regionSize],
        [Math.floor(width / 2 - regionSize / 2), Math.floor(height / 2 - regionSize / 2)],
    ];

    const rgRatios: number[] = [];
    const bgRatios: number[] = [];

    for (const [sx, sy] of positions) {
        let sumR = 0, sumG = 0, sumB = 0, count = 0;
        for (let y = sy; y < sy + regionSize; y++) {
            for (let x = sx; x < sx + regionSize; x++) {
                if (x >= width || y >= height) continue;
                const idx = (y * width + x) * 4;
                sumR += pixels[idx];
                sumG += pixels[idx + 1];
                sumB += pixels[idx + 2];
                count++;
            }
        }
        if (count > 0 && sumG > 0) {
            rgRatios.push(sumR / sumG);
            bgRatios.push(sumB / sumG);
        }
    }

    if (rgRatios.length < 3) {
        return {
            name: "White Balance Consistency", nameKey: "signal.whiteBalance",
            category: "color", score: 50, weight: 0.3,
            description: "Not enough regions for white balance analysis",
            descriptionKey: "signal.wb.error", icon: "⊙",
        };
    }

    // Calculate variance of R/G and B/G ratios across regions
    const meanRG = rgRatios.reduce((a, b) => a + b, 0) / rgRatios.length;
    const meanBG = bgRatios.reduce((a, b) => a + b, 0) / bgRatios.length;
    const varRG = rgRatios.reduce((a, b) => a + (b - meanRG) ** 2, 0) / rgRatios.length;
    const varBG = bgRatios.reduce((a, b) => a + (b - meanBG) ** 2, 0) / bgRatios.length;
    const cvRG = meanRG > 0 ? Math.sqrt(varRG) / meanRG : 0;
    const cvBG = meanBG > 0 ? Math.sqrt(varBG) / meanBG : 0;
    const avgCV = (cvRG + cvBG) / 2;

    // AI images: more consistent WB (lower CV) since they don't have real illuminant variation
    let score: number;
    if (avgCV < 0.02) score = 78;
    else if (avgCV < 0.05) score = 65;
    else if (avgCV < 0.10) score = 50;
    else if (avgCV < 0.18) score = 35;
    else score = 18;

    return {
        name: "White Balance Consistency", nameKey: "signal.whiteBalance",
        category: "color", score, weight: 0.3,
        description: score > 55
            ? "White balance is suspiciously uniform — real scenes have subtle WB variation from mixed lighting"
            : "White balance varies naturally across regions — consistent with real-world illumination",
        descriptionKey: score > 55 ? "signal.wb.ai" : "signal.wb.real",
        icon: "⊙",
        details: `R/G CV: ${cvRG.toFixed(4)}, B/G CV: ${cvBG.toFixed(4)}, Avg CV: ${avgCV.toFixed(4)}.`,
    };
}
