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
