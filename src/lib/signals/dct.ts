/**
 * Signal 11: DCT Block Artifact Analysis
 * Based on: JPEG compression forensics (Fridrich 2003, Bianchi & Piva 2012)
 * 
 * Real camera photos that went through JPEG encoding exhibit characteristic
 * 8×8 block boundary artifacts from DCT quantization. AI-generated images
 * either lack these artifacts (if saved as PNG) or show unnaturally uniform
 * artifact patterns (if re-encoded to JPEG).
 *
 * Key insights:
 * - Real JPEGs: strong, non-uniform block boundary energy from sensor-specific quantization
 * - AI images saved as PNG: zero block boundary artifacts
 * - AI images re-saved as JPEG: uniform block artifacts (missing spatial variation)
 * - Double JPEG compression: periodic DCT histogram patterns
 *
 * References:
 * - Ye et al. (2007): "Detecting DC Coefficient Modification" IEEE ICASSP
 * - Bianchi & Piva (2012): "Image Forgery Localization via Block-Grained Analysis"
 * - Li et al. (2024): "DCT coefficient traces in AI-generated images" arXiv
 */

import type { AnalysisSignal } from "../types";

export function analyzeDCTBlockArtifacts(pixels: Uint8ClampedArray, width: number, height: number): AnalysisSignal {
    const blockSize = 8;
    const blocksX = Math.floor(width / blockSize);
    const blocksY = Math.floor(height / blockSize);

    if (blocksX < 3 || blocksY < 3) {
        return {
            name: "DCT Block Artifacts", nameKey: "signal.dctBlock",
            category: "forensic", score: 50, weight: 2.0,
            description: "Image too small for DCT analysis", descriptionKey: "signal.dct.error", icon: "▦",
        };
    }

    // Measure block boundary energy vs interior energy
    let boundaryEnergy = 0;
    let interiorEnergy = 0;
    let boundaryCount = 0;
    let interiorCount = 0;

    // Sample rows and columns at block boundaries (every 8th pixel)
    const step = Math.max(1, Math.floor(Math.min(blocksX, blocksY) / 60));

    for (let by = 1; by < blocksY - 1; by += step) {
        const boundaryY = by * blockSize;
        for (let x = 1; x < width - 1; x += 2) {
            const getGray = (px: number, py: number) => {
                const i = (py * width + px) * 4;
                return pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
            };

            // Cross-boundary gradient (vertical boundary)
            const aboveBound = getGray(x, boundaryY - 1);
            const atBound = getGray(x, boundaryY);
            const belowBound = getGray(x, boundaryY + 1);
            boundaryEnergy += Math.abs(atBound - aboveBound) + Math.abs(atBound - belowBound);
            boundaryCount++;

            // Interior gradient (inside block)
            const mid = by * blockSize + Math.floor(blockSize / 2);
            if (mid > 0 && mid < height - 1) {
                const above = getGray(x, mid - 1);
                const center = getGray(x, mid);
                const below = getGray(x, mid + 1);
                interiorEnergy += Math.abs(center - above) + Math.abs(center - below);
                interiorCount++;
            }
        }
    }

    // Horizontal boundaries
    for (let bx = 1; bx < blocksX - 1; bx += step) {
        const boundaryX = bx * blockSize;
        for (let y = 1; y < height - 1; y += 2) {
            const getGray = (px: number, py: number) => {
                const i = (py * width + px) * 4;
                return pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
            };

            const leftBound = getGray(boundaryX - 1, y);
            const atBound = getGray(boundaryX, y);
            const rightBound = getGray(boundaryX + 1, y);
            boundaryEnergy += Math.abs(atBound - leftBound) + Math.abs(atBound - rightBound);
            boundaryCount++;

            const mid = bx * blockSize + Math.floor(blockSize / 2);
            if (mid > 0 && mid < width - 1) {
                const left = getGray(mid - 1, y);
                const center = getGray(mid, y);
                const right = getGray(mid + 1, y);
                interiorEnergy += Math.abs(center - left) + Math.abs(center - right);
                interiorCount++;
            }
        }
    }

    const avgBoundary = boundaryCount > 0 ? boundaryEnergy / boundaryCount : 0;
    const avgInterior = interiorCount > 0 ? interiorEnergy / interiorCount : 0;

    // Block artifact ratio: higher means stronger JPEG blocking artifacts
    // Real JPEG: boundary > interior => ratio > 1
    // AI (PNG): similar boundary & interior => ratio ≈ 1
    const blockRatio = avgInterior > 0.1 ? avgBoundary / avgInterior : (avgBoundary > 0.5 ? 2.0 : 1.0);

    // Measure spatial uniformity of block artifacts
    // Real camera JPEGs: non-uniform artifacts (varies by content complexity)
    // AI re-saved JPEG: uniform artifacts
    const regionBlockRatios: number[] = [];
    const regionSize = Math.floor(Math.min(blocksX, blocksY) / 3);
    if (regionSize >= 2) {
        const positions = [
            [0, 0], [blocksX - regionSize, 0],
            [0, blocksY - regionSize], [blocksX - regionSize, blocksY - regionSize],
            [Math.floor(blocksX / 2 - regionSize / 2), Math.floor(blocksY / 2 - regionSize / 2)],
        ];

        for (const [sx, sy] of positions) {
            let regBound = 0, regInter = 0, regCount = 0;
            for (let by = sy; by < Math.min(sy + regionSize, blocksY - 1); by++) {
                const bndY = (by + 1) * blockSize;
                const midY = by * blockSize + 4;
                if (bndY >= height - 1 || midY >= height - 1) continue;
                for (let bx = sx; bx < Math.min(sx + regionSize, blocksX - 1); bx++) {
                    const midX = bx * blockSize + 4;
                    if (midX >= width - 1) continue;

                    const getG = (px: number, py: number) => {
                        const i = (py * width + px) * 4;
                        return pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
                    };
                    regBound += Math.abs(getG(midX, bndY) - getG(midX, bndY - 1));
                    regInter += Math.abs(getG(midX, midY) - getG(midX, midY - 1));
                    regCount++;
                }
            }
            if (regCount > 0 && regInter > 0) {
                regionBlockRatios.push((regBound / regCount) / Math.max(0.1, regInter / regCount));
            }
        }
    }

    // CV of region ratios - high means non-uniform (real), low means uniform (AI)
    let regionCV = 0;
    if (regionBlockRatios.length >= 3) {
        const avg = regionBlockRatios.reduce((a, b) => a + b, 0) / regionBlockRatios.length;
        const v = regionBlockRatios.reduce((a, b) => a + (b - avg) ** 2, 0) / regionBlockRatios.length;
        regionCV = avg > 0 ? Math.sqrt(v) / avg : 0;
    }

    let score = 50;

    // Block ratio analysis
    if (blockRatio < 0.95) {
        // No JPEG block artifacts at all -> likely uncompressed AI output (PNG)
        score += 20;
    } else if (blockRatio > 1.3) {
        // Strong block artifacts -> real JPEG from camera
        score -= 20;
    } else if (blockRatio > 1.1) {
        score -= 10;
    }

    // Uniformity analysis
    if (regionCV < 0.08) {
        // Very uniform artifacts -> AI re-saved as JPEG
        score += 15;
    } else if (regionCV < 0.15) {
        score += 5;
    } else if (regionCV > 0.4) {
        // Highly non-uniform -> real camera content variation
        score -= 15;
    } else if (regionCV > 0.25) {
        score -= 8;
    }

    score = Math.max(10, Math.min(90, score));

    return {
        name: "DCT Block Artifacts", nameKey: "signal.dctBlock",
        category: "forensic", score, weight: 2.0,
        description: score > 55
            ? "No or uniform JPEG block artifacts — AI images lack natural compression fingerprints"
            : "Natural JPEG block artifacts present — consistent with real camera compression",
        descriptionKey: score > 55 ? "signal.dct.ai" : "signal.dct.real",
        icon: "▦",
        details: `Block ratio: ${blockRatio.toFixed(3)}, Region CV: ${regionCV.toFixed(3)}, Boundary: ${avgBoundary.toFixed(2)}, Interior: ${avgInterior.toFixed(2)}. Real JPEGs: ratio > 1.2, CV > 0.2.`,
    };
}
