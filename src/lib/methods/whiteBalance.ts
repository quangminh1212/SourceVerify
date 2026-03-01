import type { AnalysisMethod } from "../types";

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
            descriptionKey: "signal.wb.error", icon: "âŠ™",
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
            ? "White balance is suspiciously uniform â€” real scenes have subtle WB variation from mixed lighting"
            : "White balance varies naturally across regions â€” consistent with real-world illumination",
        descriptionKey: score > 55 ? "signal.wb.ai" : "signal.wb.real",
        icon: "âŠ™",
        details: `R/G CV: ${cvRG.toFixed(4)}, B/G CV: ${cvBG.toFixed(4)}, Avg CV: ${avgCV.toFixed(4)}.`,
    };
}
