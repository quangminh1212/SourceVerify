/**
 * Signal 13: PRNU-like Sensor Pattern Noise Analysis
 * Based on: Lukas, Fridrich & Goljan (2006), Goljan et al. (2024)
 *
 * Every camera sensor has a unique Photo Response Non-Uniformity (PRNU)
 * pattern caused by manufacturing imperfections. This acts as a "fingerprint"
 * that is present in every photo taken by that sensor.
 *
 * Key properties:
 * - Real camera images: contain spatially correlated PRNU noise patterns
 *   that repeat with consistent spatial frequency
 * - AI-generated images: noise is either absent, uncorrelated, or has
 *   fundamentally different spatial characteristics
 *
 * Our browser-side implementation approximates PRNU detection by:
 * 1. Extracting high-frequency noise residual via Wiener-like denoising
 * 2. Analyzing autocorrelation of the noise residual
 * 3. Measuring noise stationarity (fixed-pattern noise from sensors)
 *
 * References:
 * - Lukas, Fridrich & Goljan (2006): "Digital Camera Identification from PRNU"
 * - Chen et al. (2008): "Determining Image Origin and Integrity" IEEE TIFS
 * - Goljan et al. (2024): "PRNU as forensic tool for AI detection" MDPI Sensors
 */

import type { AnalysisSignal } from "../types";

export function analyzePRNUPattern(pixels: Uint8ClampedArray, width: number, height: number): AnalysisSignal {
    // Step 1: Extract noise residual using simplified Wiener-like filter
    // Noise residual = Original - Denoised (local mean filter)
    const kernelRadius = 2;
    const noiseStep = Math.max(1, Math.floor(Math.min(width, height) / 250));
    const residuals: number[] = [];
    const positions: [number, number][] = [];

    for (let y = kernelRadius; y < height - kernelRadius; y += noiseStep) {
        for (let x = kernelRadius; x < width - kernelRadius; x += noiseStep) {
            const idx = (y * width + x) * 4;
            const center = pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;

            // Local mean (5x5 neighborhood)
            let sum = 0, cnt = 0;
            for (let dy = -kernelRadius; dy <= kernelRadius; dy++) {
                for (let dx = -kernelRadius; dx <= kernelRadius; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    const ni = ((y + dy) * width + (x + dx)) * 4;
                    sum += pixels[ni] * 0.299 + pixels[ni + 1] * 0.587 + pixels[ni + 2] * 0.114;
                    cnt++;
                }
            }
            const localMean = sum / cnt;
            residuals.push(center - localMean);
            positions.push([x, y]);
        }
    }

    if (residuals.length < 200) {
        return {
            name: "Sensor Pattern Noise", nameKey: "signal.prnuPattern",
            category: "sensor", score: 50, weight: 2.5,
            description: "Insufficient data for PRNU analysis", descriptionKey: "signal.prnu.error", icon: "⊕",
        };
    }

    // Step 2: Noise autocorrelation at lag=1 (spatial correlation)
    // Real camera PRNU: consistent spatial correlation due to fixed sensor defects
    // AI noise: uncorrelated or random spatial pattern
    const cols = Math.floor((width - 2 * kernelRadius) / noiseStep);
    let autoCorr = 0, autoCorrH = 0, autoCorrCount = 0;

    for (let i = 0; i < residuals.length - 1; i++) {
        const [x1, y1] = positions[i];
        const [x2, y2] = positions[i + 1];
        // Only correlate adjacent pixels in same row
        if (y1 === y2 && Math.abs(x2 - x1) <= noiseStep * 2) {
            autoCorr += residuals[i] * residuals[i + 1];
            autoCorrCount++;
        }
    }

    // Vertical autocorrelation
    let autoCorrV = 0, autoCorrVCount = 0;
    if (cols > 0) {
        for (let i = 0; i < residuals.length - cols; i++) {
            const [x1, y1] = positions[i];
            const [x2, y2] = positions[i + cols];
            if (x1 === x2 && Math.abs(y2 - y1) <= noiseStep * 2) {
                autoCorrV += residuals[i] * residuals[i + cols];
                autoCorrVCount++;
            }
        }
    }

    const meanResidual = residuals.reduce((a, b) => a + b, 0) / residuals.length;
    const varResidual = residuals.reduce((a, b) => a + (b - meanResidual) ** 2, 0) / residuals.length;
    const stdResidual = Math.sqrt(Math.max(0, varResidual));

    const normalizedAutoCorr = (autoCorrCount > 0 && varResidual > 0)
        ? (autoCorr / autoCorrCount) / varResidual : 0;
    const normalizedAutoCorrV = (autoCorrVCount > 0 && varResidual > 0)
        ? (autoCorrV / autoCorrVCount) / varResidual : 0;

    // Step 3: Noise stationarity (divide into quadrants, compare noise statistics)
    const quadrants = [
        { residuals: [] as number[] },
        { residuals: [] as number[] },
        { residuals: [] as number[] },
        { residuals: [] as number[] },
    ];

    const midX = width / 2, midY = height / 2;
    for (let i = 0; i < positions.length; i++) {
        const [x, y] = positions[i];
        const qi = (x < midX ? 0 : 1) + (y < midY ? 0 : 2);
        quadrants[qi].residuals.push(residuals[i]);
    }

    const quadStats = quadrants.map(q => {
        if (q.residuals.length < 10) return { mean: 0, std: 0 };
        const m = q.residuals.reduce((a, b) => a + b, 0) / q.residuals.length;
        const v = q.residuals.reduce((a, b) => a + (b - m) ** 2, 0) / q.residuals.length;
        return { mean: m, std: Math.sqrt(Math.max(0, v)) };
    });

    // Real camera: noise std should be relatively consistent across quadrants (PRNU is fixed)
    // AI: noise may vary wildly or be completely uniform
    const stds = quadStats.map(q => q.std).filter(s => s > 0);
    const avgStd = stds.length > 0 ? stds.reduce((a, b) => a + b, 0) / stds.length : 0;
    const stdCV = avgStd > 0
        ? Math.sqrt(stds.reduce((a, b) => a + (b - avgStd) ** 2, 0) / stds.length) / avgStd
        : 0;

    let score = 50;

    // Autocorrelation scoring
    // Real camera PRNU: positive spatial correlation (0.1-0.5)
    // AI: near-zero or negative correlation
    const avgAutoCorr = (normalizedAutoCorr + normalizedAutoCorrV) / 2;
    if (avgAutoCorr > 0.3) {
        score -= 25; // Strong PRNU-like pattern
    } else if (avgAutoCorr > 0.15) {
        score -= 15;
    } else if (avgAutoCorr > 0.05) {
        score -= 5;
    } else if (avgAutoCorr < -0.05) {
        score += 15; // Anti-correlation is unnatural
    } else {
        score += 10; // No correlation — no sensor pattern
    }

    // Noise stationarity
    if (stdCV < 0.1) {
        // Very stationary noise — consistent with fixed PRNU pattern
        score -= 10;
    } else if (stdCV > 0.5) {
        // Wild variation — AI artifacts
        score += 12;
    } else if (stdCV > 0.3) {
        score += 5;
    }

    // Very low noise level suspicious for AI (over-denoised)
    if (stdResidual < 0.5) {
        score += 15;
    } else if (stdResidual < 1.0) {
        score += 5;
    } else if (stdResidual > 4.0) {
        // High noise — real sensor
        score -= 8;
    }

    score = Math.max(10, Math.min(90, score));

    return {
        name: "Sensor Pattern Noise", nameKey: "signal.prnuPattern",
        category: "sensor", score, weight: 2.5,
        description: score > 55
            ? "No consistent sensor pattern noise detected — AI images lack camera PRNU fingerprint"
            : "Sensor pattern noise detected — consistent with real camera PRNU fingerprint",
        descriptionKey: score > 55 ? "signal.prnu.ai" : "signal.prnu.real",
        icon: "⊕",
        details: `AutoCorr H: ${normalizedAutoCorr.toFixed(3)}, V: ${normalizedAutoCorrV.toFixed(3)}, Noise std: ${stdResidual.toFixed(2)}, Stationarity CV: ${stdCV.toFixed(3)}.`,
    };
}
