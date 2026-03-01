/**
 * Blocking Artifact Grid Analysis
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeBlockingArtifact(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Blocking Artifact Grid Analysis", nameKey: "signal.blockingArtifact",
            category: "frequency", score: 50, weight: 0.35,
            description: "Image too small for analysis",
            descriptionKey: "signal.blockingArtifact.error", icon: "🧱",
        };
    }

    let score: number;
    
    // Detect JPEG blocking artifact grid inconsistencies
    const gridPeriod = 8;
    let onGridSum = 0, offGridSum = 0, onCount = 0, offCount = 0;
    for (let y = 1; y < Math.min(h, 300); y++) {
        for (let x = 0; x < Math.min(w, 300); x += 2) {
            const idx = (y * w + x) * 4;
            const prevIdx = ((y-1) * w + x) * 4;
            const diff = Math.abs(pixels[idx] - pixels[prevIdx]);
            if (y % gridPeriod === 0) { onGridSum += diff; onCount++; }
            else { offGridSum += diff; offCount++; }
        }
    }
    // Horizontal grid
    let onGridSumH = 0, offGridSumH = 0, onCountH = 0, offCountH = 0;
    for (let y = 0; y < Math.min(h, 300); y += 2) {
        for (let x = 1; x < Math.min(w, 300); x++) {
            const idx = (y * w + x) * 4;
            const prevIdx = (y * w + x - 1) * 4;
            const diff = Math.abs(pixels[idx] - pixels[prevIdx]);
            if (x % gridPeriod === 0) { onGridSumH += diff; onCountH++; }
            else { offGridSumH += diff; offCountH++; }
        }
    }
    const vRatio = onCount > 0 && offCount > 0 ? (onGridSum/onCount) / (offGridSum/offCount + 0.01) : 1;
    const hRatio = onCountH > 0 && offCountH > 0 ? (onGridSumH/onCountH) / (offGridSumH/offCountH + 0.01) : 1;
    const gridStrength = (vRatio + hRatio) / 2;
    if (gridStrength > 1.8) score = 35;
    else if (gridStrength > 1.3) score = 40;
    else if (gridStrength < 0.9) score = 65;
    else score = 50;

    return {
        name: "Blocking Artifact Grid Analysis", nameKey: "signal.blockingArtifact",
        category: "frequency", score, weight: 0.35,
        description: score > 55
            ? "Absent or inconsistent JPEG blocking grid — not from standard JPEG pipeline"
            : "Consistent JPEG blocking grid detected — standard compression pipeline confirmed",
        descriptionKey: score > 55 ? "signal.blockingArtifact.ai" : "signal.blockingArtifact.real",
        icon: "🧱",
    };
}
