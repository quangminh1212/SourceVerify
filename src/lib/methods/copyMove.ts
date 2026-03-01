/**
 * Method 44: Copy-Move Forgery Detection
 * Christlein et al., "An Evaluation of Popular Copy-Move Forgery Detection Approaches", IEEE TIFS 2012
 * Detects duplicated image regions via block hashing — AI images may exhibit repeated micro-patterns
 */

import type { AnalysisMethod } from "../types";

export function analyzeCopyMoveForensics(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    if (width < 64 || height < 64) {
        return {
            name: "Copy-Move Detection", nameKey: "signal.copyMove",
            category: "forensic", score: 50, weight: 0.4,
            description: "Image too small for copy-move analysis",
            descriptionKey: "signal.copyMove.error", icon: "⊞",
        };
    }

    const blockSize = 16;
    const step = Math.max(1, Math.floor(Math.min(width, height) / 60));
    const hashes = new Map<string, number>();
    let totalBlocks = 0;
    let duplicates = 0;

    for (let y = 0; y <= height - blockSize; y += step) {
        for (let x = 0; x <= width - blockSize; x += step) {
            // Compute a lightweight hash of the block (mean per channel + simple gradient)
            let rSum = 0, gSum = 0, bSum = 0;
            let gx = 0, gy = 0;
            const count = blockSize * blockSize;

            for (let by = 0; by < blockSize; by++) {
                for (let bx = 0; bx < blockSize; bx++) {
                    const idx = ((y + by) * width + (x + bx)) * 4;
                    rSum += pixels[idx];
                    gSum += pixels[idx + 1];
                    bSum += pixels[idx + 2];
                    if (bx < blockSize - 1) gx += pixels[idx + 4] - pixels[idx];
                    if (by < blockSize - 1) gy += pixels[((y + by + 1) * width + (x + bx)) * 4] - pixels[idx];
                }
            }

            const hash = `${Math.round(rSum / count)}:${Math.round(gSum / count)}:${Math.round(bSum / count)}:${Math.round(gx / count)}:${Math.round(gy / count)}`;
            const prev = hashes.get(hash) || 0;
            hashes.set(hash, prev + 1);
            if (prev > 0) duplicates++;
            totalBlocks++;
        }
    }

    const dupRatio = totalBlocks > 0 ? duplicates / totalBlocks : 0;
    const uniqueRatio = totalBlocks > 0 ? hashes.size / totalBlocks : 1;

    // AI images: may have more micro-pattern repetition (lower uniqueRatio)
    // Real images: high diversity of block patterns
    let score = 50;

    if (dupRatio > 0.3) score += 18;
    else if (dupRatio > 0.15) score += 10;
    else if (dupRatio > 0.08) score += 5;
    else if (dupRatio < 0.02) score -= 8;
    else if (dupRatio < 0.05) score -= 4;

    if (uniqueRatio < 0.5) score += 10;
    else if (uniqueRatio < 0.7) score += 5;
    else if (uniqueRatio > 0.9) score -= 6;

    score = Math.max(5, Math.min(95, score));

    return {
        name: "Copy-Move Detection", nameKey: "signal.copyMove",
        category: "forensic", score, weight: 0.4,
        description: score > 55
            ? "High block similarity — repeated micro-patterns suggest AI generation or copy-move forgery"
            : "Low block repetition — unique block patterns consistent with real photography",
        descriptionKey: score > 55 ? "signal.copyMove.ai" : "signal.copyMove.real",
        icon: "⊞",
        details: `Duplicate ratio: ${dupRatio.toFixed(4)}, Unique ratio: ${uniqueRatio.toFixed(4)}, Blocks: ${totalBlocks}.`,
    };
}
