/**
 * Method 51: Bilateral Symmetry Detection
 * Loy & Eklundh, "Detecting Symmetry and Symmetric Constellations of Features", ECCV 2006
 * AI images tend to exhibit unnaturally high bilateral symmetry
 */

import type { AnalysisMethod } from "../types";

export function analyzeBilateralSymmetry(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    if (width < 32 || height < 32) {
        return {
            name: "Bilateral Symmetry", nameKey: "signal.bilateralSymmetry",
            category: "perceptual", score: 50, weight: 0.3,
            description: "Image too small for symmetry analysis",
            descriptionKey: "signal.symmetry2.error", icon: "⊘",
        };
    }

    const totalPixels = width * height;
    const step = Math.max(1, Math.floor(Math.sqrt(totalPixels / 30000)));
    const halfW = Math.floor(width / 2);
    const halfH = Math.floor(height / 2);

    // Vertical symmetry (left-right mirror)
    let vSymSum = 0, vCount = 0;
    for (let y = 0; y < height; y += step) {
        for (let x = 0; x < halfW; x += step) {
            const mirrorX = width - 1 - x;
            if (mirrorX >= width) continue;
            const idx1 = (y * width + x) * 4;
            const idx2 = (y * width + mirrorX) * 4;
            const diff = (
                Math.abs(pixels[idx1] - pixels[idx2]) +
                Math.abs(pixels[idx1 + 1] - pixels[idx2 + 1]) +
                Math.abs(pixels[idx1 + 2] - pixels[idx2 + 2])
            ) / 3;
            vSymSum += diff;
            vCount++;
        }
    }

    // Horizontal symmetry (top-bottom mirror)
    let hSymSum = 0, hCount = 0;
    for (let y = 0; y < halfH; y += step) {
        const mirrorY = height - 1 - y;
        for (let x = 0; x < width; x += step) {
            const idx1 = (y * width + x) * 4;
            const idx2 = (mirrorY * width + x) * 4;
            const diff = (
                Math.abs(pixels[idx1] - pixels[idx2]) +
                Math.abs(pixels[idx1 + 1] - pixels[idx2 + 1]) +
                Math.abs(pixels[idx1 + 2] - pixels[idx2 + 2])
            ) / 3;
            hSymSum += diff;
            hCount++;
        }
    }

    const vSymmetry = vCount > 0 ? vSymSum / vCount : 128;
    const hSymmetry = hCount > 0 ? hSymSum / hCount : 128;
    const avgSymmetryError = (vSymmetry + hSymmetry) / 2;

    let score: number;
    if (avgSymmetryError < 8) score = 80;
    else if (avgSymmetryError < 15) score = 68;
    else if (avgSymmetryError < 25) score = 55;
    else if (avgSymmetryError < 40) score = 40;
    else if (avgSymmetryError < 60) score = 28;
    else score = 15;

    return {
        name: "Bilateral Symmetry", nameKey: "signal.bilateralSymmetry",
        category: "perceptual", score, weight: 0.3,
        description: score > 55
            ? "Unusually high bilateral symmetry — AI-generated images often exhibit unnatural mirror symmetry"
            : "Natural asymmetry detected — real scenes rarely exhibit perfect bilateral symmetry",
        descriptionKey: score > 55 ? "signal.symmetry2.ai" : "signal.symmetry2.real",
        icon: "⊘",
        details: `V-symmetry error: ${vSymmetry.toFixed(2)}, H-symmetry error: ${hSymmetry.toFixed(2)}, Avg: ${avgSymmetryError.toFixed(2)}.`,
    };
}
