/**
 * Method 50: Fractal Dimension Analysis
 * Sarkar & Chaudhuri, "An Efficient Differential Box-Counting Approach", Pattern Recognition 1994
 * Natural images have fractal dimension ~2.3-2.8; AI images may deviate
 */

import type { AnalysisMethod } from "../types";

export function analyzeFractalDimension(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    if (width < 32 || height < 32) {
        return {
            name: "Fractal Dimension", nameKey: "signal.fractalDimension",
            category: "perceptual", score: 50, weight: 0.35,
            description: "Image too small for fractal analysis",
            descriptionKey: "signal.fractal.error", icon: "❋",
        };
    }

    const minDim = Math.min(width, height);
    const size = Math.min(256, minDim);
    const scaleX = width / size;
    const scaleY = height / size;
    const gray = new Float32Array(size * size);

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const sx = Math.floor(x * scaleX);
            const sy = Math.floor(y * scaleY);
            const idx = (sy * width + sx) * 4;
            gray[y * size + x] = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
        }
    }

    const scales: number[] = [];
    const counts: number[] = [];

    for (let r = 2; r <= size / 2; r *= 2) {
        const G = 256 / r;
        let totalBoxes = 0;
        const gridSizeX = Math.ceil(size / r);
        const gridSizeY = Math.ceil(size / r);

        for (let gy = 0; gy < gridSizeY; gy++) {
            for (let gx = 0; gx < gridSizeX; gx++) {
                let minVal = 255, maxVal = 0;
                for (let dy = 0; dy < r && gy * r + dy < size; dy++) {
                    for (let dx = 0; dx < r && gx * r + dx < size; dx++) {
                        const v = gray[(gy * r + dy) * size + (gx * r + dx)];
                        minVal = Math.min(minVal, v);
                        maxVal = Math.max(maxVal, v);
                    }
                }
                const minBox = Math.floor(minVal / G);
                const maxBox = Math.floor(maxVal / G);
                totalBoxes += (maxBox - minBox + 1);
            }
        }

        scales.push(Math.log(1 / r));
        counts.push(Math.log(totalBoxes));
    }

    let fractalDim = 2.5;
    if (scales.length >= 3) {
        const n = scales.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        for (let i = 0; i < n; i++) {
            sumX += scales[i]; sumY += counts[i];
            sumXY += scales[i] * counts[i]; sumX2 += scales[i] * scales[i];
        }
        const denom = n * sumX2 - sumX * sumX;
        if (Math.abs(denom) > 1e-10) {
            fractalDim = (n * sumXY - sumX * sumY) / denom;
        }
    }

    let score: number;
    if (fractalDim < 2.0) score = 72;
    else if (fractalDim < 2.2) score = 60;
    else if (fractalDim >= 2.2 && fractalDim <= 2.8) score = 35;
    else if (fractalDim > 3.0) score = 65;
    else score = 45;

    return {
        name: "Fractal Dimension", nameKey: "signal.fractalDimension",
        category: "perceptual", score, weight: 0.35,
        description: score > 55
            ? "Fractal dimension deviates from natural range — AI images often lack natural fractal complexity"
            : "Fractal dimension falls within natural range (~2.3-2.7) — consistent with real photography",
        descriptionKey: score > 55 ? "signal.fractal.ai" : "signal.fractal.real",
        icon: "❋",
        details: `Fractal dimension: ${fractalDim.toFixed(4)}, Scales computed: ${scales.length}.`,
    };
}
