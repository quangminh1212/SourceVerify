/**
 * Signal 3: Multi-scale Reconstruction Discrepancy
 * Improved ELA: re-encode at 3 quality levels, analyze variance pattern
 */

import type { AnalysisSignal } from "../types";

export async function analyzeMultiscaleReconstruction(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
): Promise<AnalysisSignal> {
    const orig = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const qualities = [0.5, 0.75, 0.9];
    const blockSize = 16;
    const blocksX = Math.floor(canvas.width / blockSize);
    const blocksY = Math.floor(canvas.height / blockSize);
    const totalBlocks = blocksX * blocksY;

    const scaleErrors: number[][] = [];

    for (const q of qualities) {
        const dataURL = canvas.toDataURL("image/jpeg", q);
        const errors = await new Promise<number[]>((resolve) => {
            const img2 = new Image();
            img2.onload = () => {
                const c2 = document.createElement("canvas");
                c2.width = canvas.width; c2.height = canvas.height;
                const ctx2 = c2.getContext("2d")!;
                ctx2.drawImage(img2, 0, 0, canvas.width, canvas.height);
                const recomp = ctx2.getImageData(0, 0, canvas.width, canvas.height).data;

                const blockErrors: number[] = [];
                for (let by = 0; by < blocksY; by++) {
                    for (let bx = 0; bx < blocksX; bx++) {
                        let diff = 0, count = 0;
                        for (let y = by * blockSize; y < (by + 1) * blockSize; y++) {
                            for (let x = bx * blockSize; x < (bx + 1) * blockSize; x++) {
                                const idx = (y * canvas.width + x) * 4;
                                diff += Math.abs(orig[idx] - recomp[idx])
                                    + Math.abs(orig[idx + 1] - recomp[idx + 1])
                                    + Math.abs(orig[idx + 2] - recomp[idx + 2]);
                                count++;
                            }
                        }
                        blockErrors.push(count > 0 ? diff / (count * 3) : 0);
                    }
                }
                resolve(blockErrors);
            };
            img2.onerror = () => resolve(new Array(totalBlocks).fill(0));
            img2.src = dataURL;
        });
        scaleErrors.push(errors);
    }

    // Cross-scale consistency analysis
    let totalCV = 0;
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
    totalCV = midMean > 0 ? Math.sqrt(midVar) / midMean : 0;

    const combined = totalCV * 0.6 + crossScaleVariance * 0.4;

    let score: number;
    if (combined < 0.15) score = 80;
    else if (combined < 0.25) score = 65;
    else if (combined < 0.4) score = 50;
    else if (combined < 0.6) score = 35;
    else score = 18;

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
