/**
 * Method 45: JPEG Double Compression Detection
 * Lin et al., "Detecting Doctored JPEG Images Via DCT Coefficient Analysis", ACM MM 2009
 * Detects periodic DCT histogram artifacts from double compression
 */

import type { AnalysisMethod } from "../types";

export function analyzeDoubleJPEG(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    if (width < 16 || height < 16) {
        return {
            name: "Double JPEG Detection", nameKey: "signal.doubleJpeg",
            category: "forensic", score: 50, weight: 0.4,
            description: "Image too small for double JPEG analysis",
            descriptionKey: "signal.doubleJpeg.error", icon: "⧉",
        };
    }

    const histogram = new Array(256).fill(0);
    const stepW = Math.max(1, Math.floor(width / 256));
    const stepH = Math.max(1, Math.floor(height / 256));

    for (let y = 0; y < height; y += stepH) {
        for (let x = 1; x < width; x += stepW) {
            const idx = (y * width + x) * 4;
            const prevIdx = (y * width + x - 1) * 4;
            const diff = Math.abs(
                (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3 -
                (pixels[prevIdx] + pixels[prevIdx + 1] + pixels[prevIdx + 2]) / 3
            );
            const bin = Math.min(255, Math.round(diff));
            histogram[bin]++;
        }
    }

    const checkPeriods = [4, 8, 16];
    let periodicSum = 0;

    for (const period of checkPeriods) {
        let periodEnergy = 0, offEnergy = 0;
        let pCount = 0, oCount = 0;
        for (let i = 0; i < 128; i++) {
            if (i % period === 0) { periodEnergy += histogram[i]; pCount++; }
            else { offEnergy += histogram[i]; oCount++; }
        }
        if (pCount > 0 && oCount > 0) {
            periodicSum += (periodEnergy / pCount) / Math.max(1, offEnergy / oCount);
        }
    }
    const avgPeriodicity = periodicSum / checkPeriods.length;

    let score: number;
    if (avgPeriodicity > 2.0) score = 72;
    else if (avgPeriodicity > 1.5) score = 62;
    else if (avgPeriodicity > 1.2) score = 52;
    else if (avgPeriodicity > 0.8) score = 38;
    else score = 25;

    return {
        name: "Double JPEG Detection", nameKey: "signal.doubleJpeg",
        category: "forensic", score, weight: 0.4,
        description: score > 55
            ? "Periodic DCT artifacts suggest double compression — image may be edited or AI-generated"
            : "Single compression pattern — consistent with direct camera output",
        descriptionKey: score > 55 ? "signal.doubleJpeg.ai" : "signal.doubleJpeg.real",
        icon: "⧉",
        details: `Periodicity index: ${avgPeriodicity.toFixed(4)}.`,
    };
}
