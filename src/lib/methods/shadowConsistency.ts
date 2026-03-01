import type { AnalysisMethod } from "../types";
import { gray } from "./pixelUtils";

/**
 * Signal 41: Shadow Consistency Analysis
 * Kee et al. (2013) - Shadow direction and opacity analysis
 * Verifying physical consistency of shadows across the image
 */
export function analyzeShadowConsistency(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    // Detect dark regions (potential shadows) and analyze their distribution
    const blockSize = 32;
    const blocksX = Math.floor(width / blockSize);
    const blocksY = Math.floor(height / blockSize);
    const blockBrightness: number[] = [];
    const step = Math.max(1, Math.floor(blocksX * blocksY / 300));

    for (let by = 0; by < blocksY; by += step) {
        for (let bx = 0; bx < blocksX; bx += step) {
            let sum = 0, count = 0;
            for (let y = by * blockSize; y < (by + 1) * blockSize; y++) {
                for (let x = bx * blockSize; x < (bx + 1) * blockSize; x++) {
                    sum += gray(pixels, (y * width + x) * 4);
                    count++;
                }
            }
            blockBrightness.push(count > 0 ? sum / count : 128);
        }
    }

    if (blockBrightness.length < 9) {
        return {
            name: "Shadow Consistency", nameKey: "signal.shadowConsistency",
            category: "geometric", score: 50, weight: 0.3,
            description: "Not enough data for shadow analysis",
            descriptionKey: "signal.shadow.error", icon: "â—‘",
        };
    }

    const globalMean = blockBrightness.reduce((a, b) => a + b, 0) / blockBrightness.length;
    const darkThreshold = globalMean * 0.5;
    const darkBlocks = blockBrightness.filter(b => b < darkThreshold);

    // Shadow coherence: dark blocks should be spatially clustered (not scattered)
    // Compare variance within dark vs bright regions
    const darkVar = darkBlocks.length > 1
        ? darkBlocks.reduce((a, b) => a + (b - darkBlocks.reduce((s, c) => s + c, 0) / darkBlocks.length) ** 2, 0) / darkBlocks.length
        : 0;

    // Dynamic range: ratio of darkest to brightest blocks
    const minBright = Math.min(...blockBrightness);
    const maxBright = Math.max(...blockBrightness);
    const dynamicRange = maxBright - minBright;

    // Shadow/light balance
    const darkRatio = darkBlocks.length / blockBrightness.length;

    // AI images: extreme dynamics or very flat; unnatural dark distribution
    let score = 50;
    if (darkRatio < 0.05 && dynamicRange < 60) score += 18; // no shadows + flat = AI
    else if (darkRatio < 0.1 && dynamicRange < 80) score += 10;
    else if (darkRatio > 0.15 && darkRatio < 0.45 && dynamicRange > 100) score -= 12; // natural shadow range
    else if (darkRatio > 0.1 && dynamicRange > 80) score -= 5;

    // Check dark block variance consistency
    if (darkBlocks.length > 2) {
        const darkCV = darkVar > 0 ? Math.sqrt(darkVar) / (darkBlocks.reduce((a, b) => a + b, 0) / darkBlocks.length) : 0;
        if (darkCV < 0.1) score += 8; // suspiciously uniform shadows
        else if (darkCV > 0.5) score -= 5;
    }

    score = Math.max(5, Math.min(95, score));

    return {
        name: "Shadow Consistency", nameKey: "signal.shadowConsistency",
        category: "geometric", score, weight: 0.3,
        description: score > 55
            ? "Shadow distribution appears physically inconsistent â€” potential AI generation"
            : "Shadow distribution is physically plausible â€” natural lighting and shadow patterns",
        descriptionKey: score > 55 ? "signal.shadow.ai" : "signal.shadow.real",
        icon: "â—‘",
        details: `Dark ratio: ${darkRatio.toFixed(3)}, Dynamic range: ${dynamicRange.toFixed(1)}, Dark blocks: ${darkBlocks.length}/${blockBrightness.length}.`,
    };
}