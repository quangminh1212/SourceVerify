/**
 * Signal 2: Spectral Nyquist Analysis
 * Based on SpAN (ICLR 2026) & SPAI (CVPR 2025)
 * AI upsampling creates spectral artifacts at Nyquist frequencies
 */

import type { AnalysisSignal } from "../types";

export function analyzeSpectralNyquist(pixels: Uint8ClampedArray, width: number, height: number): AnalysisSignal {
    const size = Math.min(256, Math.min(width, height));
    const offsetX = Math.floor((width - size) / 2);
    const offsetY = Math.floor((height - size) / 2);

    // Extract grayscale center crop
    const gray = new Float64Array(size * size);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const idx = ((offsetY + y) * width + (offsetX + x)) * 4;
            gray[y * size + x] = pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;
        }
    }

    // Compute radial power spectrum via row-wise 1D DFT
    const halfSize = Math.floor(size / 2);
    const freqPower = new Float64Array(halfSize + 1);

    const rowStep = Math.max(1, Math.floor(size / 64));
    let rowCount = 0;

    for (let y = 0; y < size; y += rowStep) {
        for (let k = 0; k <= halfSize; k++) {
            let re = 0, im = 0;
            for (let n = 0; n < size; n++) {
                const angle = -2 * Math.PI * k * n / size;
                re += gray[y * size + n] * Math.cos(angle);
                im += gray[y * size + n] * Math.sin(angle);
            }
            freqPower[k] += re * re + im * im;
        }
        rowCount++;
    }

    // Also sample columns
    for (let x = 0; x < size; x += rowStep) {
        for (let k = 0; k <= halfSize; k++) {
            let re = 0, im = 0;
            for (let n = 0; n < size; n++) {
                const angle = -2 * Math.PI * k * n / size;
                re += gray[n * size + x] * Math.cos(angle);
                im += gray[n * size + x] * Math.sin(angle);
            }
            freqPower[k] += re * re + im * im;
        }
        rowCount++;
    }

    // Normalize
    for (let k = 0; k <= halfSize; k++) {
        freqPower[k] /= rowCount;
    }

    // Log scale
    const logPower = new Float64Array(halfSize + 1);
    for (let k = 0; k <= halfSize; k++) {
        logPower[k] = Math.log10(freqPower[k] + 1);
    }

    // Nyquist peak ratio
    const nyquist = logPower[halfSize];
    const near1 = halfSize > 1 ? logPower[halfSize - 1] : nyquist;
    const near2 = halfSize > 2 ? logPower[halfSize - 2] : near1;
    const near3 = halfSize > 3 ? logPower[halfSize - 3] : near2;
    const nearAvg = (near1 + near2 + near3) / 3;
    const peakRatio = nearAvg > 0 ? nyquist / nearAvg : 1.0;

    // Sub-harmonic peaks at N/4
    const quarter = Math.floor(halfSize / 2);
    const quarterPower = logPower[quarter];
    const quarterNear = (logPower[Math.max(0, quarter - 1)] + logPower[Math.min(halfSize, quarter + 1)]) / 2;
    const quarterRatio = quarterNear > 0 ? quarterPower / quarterNear : 1.0;

    // Spectral rolloff
    const lowFreq = (logPower[1] + logPower[2] + logPower[3]) / 3;
    const highFreq = (logPower[halfSize - 3] + logPower[halfSize - 2] + logPower[halfSize - 1]) / 3;
    const rolloffRatio = lowFreq > 0 ? highFreq / lowFreq : 0;

    // Scoring
    let score = 50;

    if (peakRatio > 1.5) score += 20;
    else if (peakRatio > 1.2) score += 10;
    else if (peakRatio < 0.9) score -= 15;

    if (quarterRatio > 1.3) score += 10;

    if (rolloffRatio > 0.5) score += 15;
    else if (rolloffRatio > 0.3) score += 5;
    else if (rolloffRatio < 0.15) score -= 15;
    else if (rolloffRatio < 0.2) score -= 5;

    // Web CDN resize heuristic
    const isPow2OrStd = (d: number) => (d & (d - 1)) === 0 || [512, 768, 1024, 1536, 2048, 4096].includes(d);
    const likelyResized = !isPow2OrStd(width) && !isPow2OrStd(height) && (width % 100 !== 0 || height % 100 !== 0);
    if (likelyResized && score > 50) {
        score = Math.round(50 + (score - 50) * 0.3);
    }

    score = Math.max(10, Math.min(90, score));

    return {
        name: "Spectral Nyquist Analysis", nameKey: "signal.spectralNyquist",
        category: "spectral", score, weight: 0.5,
        description: score > 55
            ? "Spectral peaks at Nyquist frequencies detected — characteristic of AI upsampling artifacts"
            : "Spectral distribution is smooth — consistent with natural photography",
        descriptionKey: score > 55 ? "signal.spectral.ai" : "signal.spectral.real",
        icon: "◈",
        details: `Peak ratio: ${peakRatio.toFixed(2)}, Quarter ratio: ${quarterRatio.toFixed(2)}, Rolloff: ${rolloffRatio.toFixed(3)}. AI: peak > 1.2, rolloff > 0.3.`,
    };
}
