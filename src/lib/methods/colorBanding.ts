import type { AnalysisMethod } from "../types";
import { gray } from "./pixelUtils";


/**
 * Compression & Format Analysis Signals (4 methods)
 * Based on JPEG forensics and compression artifact analysis
 *
 * References:
 * - Farid, "Exposing Digital Forgeries from JPEG Ghosts", IEEE TIFS 2009
 * - Krawetz, "A Picture's Worth... Digital Image Analysis and Forensics", 2007
 */

import type { AnalysisMethod } from "../types";

function gray(pixels: Uint8ClampedArray, idx: number): number {
    return pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;
}

/**
 * Signal 32: JPEG Ghost Detection
 * Farid (IEEE TIFS 2009) - Double compression artifact detection
 * AI-generated images saved as JPEG may show ghost artifacts
 */
export function analyzeJPEGGhost(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    // Simulate re-compression by comparing 8x8 block boundaries
    const blockSize = 8;
    const blocksX = Math.floor(width / blockSize);
    const blocksY = Math.floor(height / blockSize);

    if (blocksX < 4 || blocksY < 4) {
        return {
            name: "JPEG Ghost Detection", nameKey: "signal.jpegGhost",
            category: "compression", score: 50, weight: 0.4,
            description: "Image too small for JPEG ghost analysis",
            descriptionKey: "signal.jpegGhost.error", icon: "⊟",
        };
    }

    // Measure boundary discontinuity between adjacent 8x8 blocks
    let boundaryDiff = 0;
    let interiorDiff = 0;
    let bCount = 0, iCount = 0;

    const step = Math.max(1, Math.floor(blocksY / 30));
    for (let by = 0; by < blocksY - 1; by += step) {
        for (let bx = 0; bx < blocksX - 1; bx++) {
            // Horizontal boundary
            const y = (by + 1) * blockSize;
            for (let x = bx * blockSize; x < (bx + 1) * blockSize; x++) {
                if (y > 0 && y < height) {
                    boundaryDiff += Math.abs(
                        gray(pixels, (y * width + x) * 4) -
                        gray(pixels, ((y - 1) * width + x) * 4)
                    );
                    bCount++;
                }
                // Interior comparison (middle of block)
                const iy = by * blockSize + 4;
                if (iy > 0 && iy < height - 1) {
                    interiorDiff += Math.abs(
                        gray(pixels, (iy * width + x) * 4) -
                        gray(pixels, ((iy - 1) * width + x) * 4)
                    );
                    iCount++;
                }
            }
        }
    }

    const avgBoundary = bCount > 0 ? boundaryDiff / bCount : 0;
    const avgInterior = iCount > 0 ? interiorDiff / iCount : 1;
    const ghostRatio = avgInterior > 0 ? avgBoundary / avgInterior : 1;

    // JPEG compression leaves block boundaries; AI images may not
    let score: number;
    if (ghostRatio < 0.85) score = 72; // no block boundaries = likely AI or heavily processed
    else if (ghostRatio < 1.0) score = 58;
    else if (ghostRatio < 1.15) score = 42; // slight block artifacts = natural JPEG
    else if (ghostRatio < 1.4) score = 30;
    else score = 18; // strong block artifacts = definitely JPEG camera

    return {
        name: "JPEG Ghost Detection", nameKey: "signal.jpegGhost",
        category: "compression", score, weight: 0.4,
        description: score > 55
            ? "No JPEG block boundaries detected — image may not originate from camera compression"
            : "JPEG block boundary artifacts present — consistent with camera compression pipeline",
        descriptionKey: score > 55 ? "signal.jpegGhost.ai" : "signal.jpegGhost.real",
        icon: "⊟",
        details: `Boundary/interior ratio: ${ghostRatio.toFixed(3)}, Avg boundary: ${avgBoundary.toFixed(2)}, Interior: ${avgInterior.toFixed(2)}.`,
    };
}

/**
 * Signal 33: Quantization Table Fingerprint
 * JPEG quantization reveals compression history
 * AI images often lack standard camera quantization patterns
 */
export function analyzeQuantizationFingerprint(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    // Analyze 8x8 block DCT coefficient quantization patterns
    const blockSize = 8;
    const blocksX = Math.floor(width / blockSize);
    const blocksY = Math.floor(height / blockSize);

    if (blocksX < 3 || blocksY < 3) {
        return {
            name: "Quantization Fingerprint", nameKey: "signal.quantFingerprint",
            category: "compression", score: 50, weight: 0.3,
            description: "Image too small for quantization analysis",
            descriptionKey: "signal.quant.error", icon: "⊞",
        };
    }

    // Check for evidence of quantization steps in pixel values
    const histogram = new Array(256).fill(0);
    const totalPixels = width * height;
    const step = Math.max(1, Math.floor(totalPixels / 80000));

    for (let i = 0; i < totalPixels * 4; i += step * 4) {
        const g = Math.floor(gray(pixels, i));
        histogram[Math.min(255, Math.max(0, g))]++;
    }

    // Detect periodic patterns in histogram (evidence of quantization)
    let periodicScore = 0;
    for (let period = 2; period <= 8; period++) {
        let correlation = 0;
        let count = 0;
        for (let i = period; i < 256 - period; i++) {
            correlation += Math.abs(histogram[i] - histogram[i - period]) /
                (Math.max(histogram[i], histogram[i - period]) + 1);
            count++;
        }
        if (count > 0) periodicScore += correlation / count;
    }
    periodicScore /= 7; // normalize across periods

    // Count "comb" pattern: alternating high-low in histogram
    let combCount = 0;
    for (let i = 1; i < 255; i++) {
        if ((histogram[i] > histogram[i - 1] * 1.5 && histogram[i] > histogram[i + 1] * 1.5) ||
            (histogram[i] < histogram[i - 1] * 0.67 && histogram[i] < histogram[i + 1] * 0.67)) {
            combCount++;
        }
    }
    const combRatio = combCount / 254;

    // Camera JPEG: shows quantization comb patterns
    let score: number;
    if (combRatio < 0.10) score = 72; // no quantization = likely AI (clean generation)
    else if (combRatio < 0.20) score = 58;
    else if (combRatio < 0.35) score = 42;
    else if (combRatio < 0.50) score = 28;
    else score = 15; // strong quantization = real JPEG

    return {
        name: "Quantization Fingerprint", nameKey: "signal.quantFingerprint",
        category: "compression", score, weight: 0.3,
        description: score > 55
            ? "No JPEG quantization patterns — image appears to bypass standard compression"
            : "JPEG quantization patterns present — consistent with standard camera pipeline",
        descriptionKey: score > 55 ? "signal.quant.ai" : "signal.quant.real",
        icon: "⊞",
        details: `Comb ratio: ${combRatio.toFixed(3)}, Periodic score: ${periodicScore.toFixed(4)}, Comb peaks: ${combCount}.`,
    };
}

/**
 * Signal 34: Error Level Analysis (ELA)
 * Krawetz (2007) - Differential compression forensics
 * Re-saved regions show different error levels than original
 */
export function analyzeErrorLevel(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    // ELA: Compare original with simulated re-compression
    // Approximate by comparing each pixel to its low-pass filtered version
    const blockSize = 4;
    const errors: number[] = [];
    const step = Math.max(2, Math.floor(Math.min(width, height) / 200));

    for (let y = blockSize; y < height - blockSize; y += step) {
        for (let x = blockSize; x < width - blockSize; x += step) {
            // Original pixel
            const orig = gray(pixels, (y * width + x) * 4);

            // 5x5 average (simulates lossy re-compression)
            let sum = 0, count = 0;
            for (let dy = -2; dy <= 2; dy++) {
                for (let dx = -2; dx <= 2; dx++) {
                    sum += gray(pixels, ((y + dy) * width + (x + dx)) * 4);
                    count++;
                }
            }
            const avgVal = sum / count;
            errors.push(Math.abs(orig - avgVal));
        }
    }

    if (errors.length < 50) {
        return {
            name: "Error Level Analysis", nameKey: "signal.errorLevel",
            category: "compression", score: 50, weight: 0.4,
            description: "Insufficient data for ELA",
            descriptionKey: "signal.ela.error", icon: "⊿",
        };
    }

    const mean = errors.reduce((a, b) => a + b, 0) / errors.length;
    const variance = errors.reduce((a, b) => a + (b - mean) ** 2, 0) / errors.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

    // AI images: more uniform error levels (lower CV, lower mean)
    let score: number;
    if (mean < 2 && cv < 0.8) score = 78;
    else if (mean < 4) score = 65;
    else if (mean < 8) score = 50;
    else if (mean < 15) score = 35;
    else score = 18;

    return {
        name: "Error Level Analysis", nameKey: "signal.errorLevel",
        category: "compression", score, weight: 0.4,
        description: score > 55
            ? "Error levels are unusually uniform — AI images lack compression-induced variation"
            : "Error levels vary naturally — consistent with real camera compression",
        descriptionKey: score > 55 ? "signal.ela.ai" : "signal.ela.real",
        icon: "⊿",
        details: `Mean error: ${mean.toFixed(2)}, CV: ${cv.toFixed(3)}, Samples: ${errors.length}.`,
    };
}

/**
 * Signal 35: Color Banding Detection
 * Detects posterization/quantization artifacts in gradients
 * AI images may show subtle color banding in smooth gradients
 */
export function analyzeColorBanding(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    let bandingCount = 0;
    let gradientCount = 0;
    const step = Math.max(2, Math.floor(Math.min(width, height) / 200));

    for (let y = 0; y < height; y += step) {
        for (let x = 2; x < width - 2; x += step) {
            const g0 = gray(pixels, (y * width + (x - 2)) * 4);
            const g1 = gray(pixels, (y * width + (x - 1)) * 4);
            const g2 = gray(pixels, (y * width + x) * 4);
            const g3 = gray(pixels, (y * width + (x + 1)) * 4);
            const g4 = gray(pixels, (y * width + (x + 2)) * 4);

            // Check if it's a gradient region
            const isGradient = Math.abs(g4 - g0) > 3 && Math.abs(g4 - g0) < 40;
            if (!isGradient) continue;
            gradientCount++;

            // Check for steps (banding): flat regions within gradient
            const d01 = Math.abs(g1 - g0);
            const d12 = Math.abs(g2 - g1);
            const d23 = Math.abs(g3 - g2);
            const d34 = Math.abs(g4 - g3);

            // Banding: some transitions are 0 while others are larger
            const diffs = [d01, d12, d23, d34];
            const zeroDiffs = diffs.filter(d => d === 0).length;
            const largeDiffs = diffs.filter(d => d > 2).length;

            if (zeroDiffs >= 2 && largeDiffs >= 1) bandingCount++;
        }
    }

    const bandingRatio = gradientCount > 0 ? bandingCount / gradientCount : 0;

    let score: number;
    if (bandingRatio > 0.5) score = 78;
    else if (bandingRatio > 0.3) score = 65;
    else if (bandingRatio > 0.15) score = 52;
    else if (bandingRatio > 0.05) score = 38;
    else score = 22;

    return {
        name: "Color Banding", nameKey: "signal.colorBanding",
        category: "compression", score, weight: 0.3,
        description: score > 55
            ? "Significant color banding detected — AI generation or heavy post-processing artifact"
            : "Smooth gradients without banding — consistent with high-quality capture",
        descriptionKey: score > 55 ? "signal.banding.ai" : "signal.banding.real",
        icon: "▥",
        details: `Banding ratio: ${bandingRatio.toFixed(3)}, Gradient samples: ${gradientCount}, Banding: ${bandingCount}.`,
    };
}
