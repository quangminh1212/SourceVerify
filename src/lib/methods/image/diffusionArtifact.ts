import type { AnalysisMethod } from "../../types";
import { gray } from "../pixelUtils";

/**
 * Signal 38: Diffusion Model Artifact Detection
 * Corvi et al. (ICASSP 2023) - Unique artifacts from diffusion denoising
 * Diffusion models create specific mid-frequency anomalies
 */
export function analyzeDiffusionArtifact(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    // Diffusion models produce smooth mid-frequency content with sharp edges
    // Detect by analyzing the ratio of mid-to-high frequency content

    const blockSize = 16;
    const blocksX = Math.floor(width / blockSize);
    const blocksY = Math.floor(height / blockSize);
    let smoothMidCount = 0;
    let sharpTransitionCount = 0;
    let totalBlocks = 0;
    const step = Math.max(1, Math.floor(blocksX * blocksY / 200));

    for (let by = 0; by < blocksY; by += step) {
        for (let bx = 0; bx < blocksX; bx += step) {
            let midFreqEnergy = 0;
            let highFreqEnergy = 0;
            let edgeCount = 0;
            let count = 0;

            for (let y = by * blockSize + 1; y < (by + 1) * blockSize - 1; y++) {
                for (let x = bx * blockSize + 1; x < (bx + 1) * blockSize - 1; x++) {
                    const center = gray(pixels, (y * width + x) * 4);
                    const right = gray(pixels, (y * width + x + 1) * 4);
                    // down direction not used for current analysis
                    const right2 = x + 2 < width ? gray(pixels, (y * width + x + 2) * 4) : center;

                    // First derivative (mid frequency)
                    const d1 = Math.abs(right - center);
                    // Second derivative (high frequency)
                    const d2 = Math.abs(right2 - 2 * right + center);

                    midFreqEnergy += d1;
                    highFreqEnergy += d2;
                    if (d1 > 15) edgeCount++;
                    count++;
                }
            }

            totalBlocks++;
            if (count > 0) {
                const midAvg = midFreqEnergy / count;
                const highAvg = highFreqEnergy / count;
                const edgeRatio = edgeCount / count;

                // Diffusion artifact: smooth mid-frequency but sharp edges
                if (midAvg < 5 && edgeRatio > 0.02) smoothMidCount++;
                if (highAvg < 1 && midAvg > 2) sharpTransitionCount++;
            }
        }
    }

    const smoothRatio = totalBlocks > 0 ? smoothMidCount / totalBlocks : 0;
    const transitionRatio = totalBlocks > 0 ? sharpTransitionCount / totalBlocks : 0;
    const diffusionScore = smoothRatio * 0.5 + transitionRatio * 0.5;

    let score: number;
    if (diffusionScore > 0.5) score = 82;
    else if (diffusionScore > 0.3) score = 68;
    else if (diffusionScore > 0.15) score = 55;
    else if (diffusionScore > 0.05) score = 40;
    else score = 22;

    return {
        name: "Diffusion Artifacts", nameKey: "signal.diffusionArtifact",
        category: "generative", score, weight: 0.5,
        description: score > 55
            ? "Mid-frequency smoothing with sharp edges detected — pattern consistent with diffusion models"
            : "No diffusion model artifacts detected — frequency structure appears natural",
        descriptionKey: score > 55 ? "signal.diffusion.ai" : "signal.diffusion.real",
        icon: "∞",
        details: `Smooth ratio: ${smoothRatio.toFixed(3)}, Transition ratio: ${transitionRatio.toFixed(3)}, Score: ${diffusionScore.toFixed(3)}.`,
    };
}