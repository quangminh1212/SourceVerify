/**
 * Signal 3: Multi-scale Reconstruction Discrepancy
 * Deterministic cross-platform ELA simulation via pixel quantization
 *
 * v5: Replaced browser-dependent canvas.toDataURL("image/jpeg") with pure-JS
 *     quantization to ensure identical results across all machines/browsers.
 *     JPEG re-encoding varies by browser engine; this approach eliminates that.
 *
 * The quantization simulates lossy compression at 3 intensity levels:
 * - Higher quantStep = coarser loss (like low-quality JPEG)
 * - Lower quantStep = finer loss (like high-quality JPEG)
 * AI images have smooth, uniform pixel distributions → uniform quantization error
 * Real photos have diverse textures/edges → spatially varying quantization error
 */

import type { AnalysisMethod } from "../../types";

export function analyzeMultiscaleReconstruction(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
): AnalysisMethod {
    const w = canvas.width, h = canvas.height;
    const orig = ctx.getImageData(0, 0, w, h).data;

    // Deterministic quantization at 3 levels (replaces JPEG encode/decode cycle)
    const quantSteps = [24, 12, 4];
    const blockSize = 16;
    const blocksX = Math.floor(w / blockSize);
    const blocksY = Math.floor(h / blockSize);
    const totalBlocks = blocksX * blocksY;

    if (totalBlocks < 4) {
        return {
            name: "Multi-scale Reconstruction", nameKey: "signal.multiScaleReconstruction",
            category: "forensic", score: 50, weight: 4.0,
            description: "Image too small for analysis",
            descriptionKey: "signal.reconstruction.error", icon: "⊞",
        };
    }

    const scaleErrors: number[][] = [];

    for (const qStep of quantSteps) {
        const blockErrors: number[] = [];
        for (let by = 0; by < blocksY; by++) {
            for (let bx = 0; bx < blocksX; bx++) {
                let diff = 0, count = 0;
                for (let y = by * blockSize; y < (by + 1) * blockSize; y++) {
                    for (let x = bx * blockSize; x < (bx + 1) * blockSize; x++) {
                        const idx = (y * w + x) * 4;
                        for (let c = 0; c < 3; c++) {
                            const val = orig[idx + c];
                            diff += Math.abs(val - Math.round(val / qStep) * qStep);
                        }
                        count++;
                    }
                }
                blockErrors.push(count > 0 ? diff / (count * 3) : 0);
            }
        }
        scaleErrors.push(blockErrors);
    }

    // Cross-scale consistency analysis
    let crossScaleVariance = 0;
    for (let b = 0; b < totalBlocks; b++) {
        const vals = scaleErrors.map(s => s[b]);
        const mean = vals.reduce((a, v) => a + v, 0) / vals.length;
        const variance = vals.reduce((a, v) => a + (v - mean) ** 2, 0) / vals.length;
        crossScaleVariance += mean > 0 ? Math.sqrt(variance) / mean : 0;
    }
    crossScaleVariance /= totalBlocks;

    const midErrors = scaleErrors[1];
    const midMean = midErrors.reduce((a, b) => a + b, 0) / midErrors.length;
    const midVar = midErrors.reduce((a, b) => a + (b - midMean) ** 2, 0) / midErrors.length;
    const totalCV = midMean > 0 ? Math.sqrt(midVar) / midMean : 0;

    const combined = totalCV * 0.6 + crossScaleVariance * 0.4;

    // Scoring (same thresholds — quantization produces similar CV ranges as JPEG ELA)
    let score: number;
    if (combined < 0.10) score = 88;
    else if (combined < 0.15) score = 78;
    else if (combined < 0.20) score = 68;
    else if (combined < 0.30) score = 55;
    else if (combined < 0.45) score = 42;
    else if (combined < 0.60) score = 28;
    else score = 15;

    return {
        name: "Multi-scale Reconstruction", nameKey: "signal.multiScaleReconstruction",
        category: "forensic", score, weight: 4.0,
        description: score > 55
            ? "Reconstruction errors are unnaturally uniform — typical of AI-generated content"
            : "Reconstruction shows natural variation — consistent with real photography",
        descriptionKey: score > 55 ? "signal.reconstruction.ai" : "signal.reconstruction.real",
        icon: "⊞",
        details: `Spatial CV: ${totalCV.toFixed(3)}, Cross-scale var: ${crossScaleVariance.toFixed(3)}, Combined: ${combined.toFixed(3)}. Real photos > 0.4.`,
    };
}
