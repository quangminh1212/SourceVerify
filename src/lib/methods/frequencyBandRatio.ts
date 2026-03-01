import type { AnalysisMethod } from "../types";
import { gray } from "./pixelUtils";

/**
 * Signal 25: Frequency Band Energy Ratio
 * Comparing energy distribution across frequency bands
 * AI models produce characteristic frequency band signatures
 *
 * Improved approach: Use difference-of-averages at multiple scales
 * to properly isolate frequency bands. At each scale, we compute
 * the difference between the block average and pixel values to get
 * the energy at frequencies HIGHER than that scale. By subtracting
 * adjacent scales, we get band-pass energy.
 *
 * Scale hierarchy:
 * - Low frequency:  Detail captured at scale 32→∞ (smoothed at 32)
 * - Mid frequency:  Detail at scale 4→32 (between scales 4 and 32)
 * - High frequency: Detail at scale 1→4 (finest detail, pixel-level)
 */
export function analyzeFrequencyBandRatio(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const size = Math.min(128, Math.min(width, height));
    const ox = Math.floor((width - size) / 2);
    const oy = Math.floor((height - size) / 2);

    // Extract grayscale patch
    const patch = new Float64Array(size * size);
    for (let y = 0; y < size; y++)
        for (let x = 0; x < size; x++)
            patch[y * size + x] = gray(pixels, ((oy + y) * width + (ox + x)) * 4);

    // Compute smoothed versions at different scales using box filter
    const smooth = (input: Float64Array, blockSize: number): Float64Array => {
        const result = new Float64Array(size * size);
        const half = Math.floor(blockSize / 2);
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let sum = 0, count = 0;
                for (let dy = -half; dy <= half; dy++) {
                    for (let dx = -half; dx <= half; dx++) {
                        const ny = y + dy, nx = x + dx;
                        if (ny >= 0 && ny < size && nx >= 0 && nx < size) {
                            sum += input[ny * size + nx];
                            count++;
                        }
                    }
                }
                result[y * size + x] = sum / count;
            }
        }
        return result;
    };

    // Compute smoothed versions at 3 scales
    const smooth4 = smooth(patch, 5);    // removes high freq (> ~4px)
    const smooth16 = smooth(smooth4, 9); // removes mid freq (> ~16px)

    // Band energy = variance of (original - smoothed) at each band
    let highEnergy = 0;  // pixel detail (original - smooth4)
    let midEnergy = 0;   // mid detail (smooth4 - smooth16)
    let lowEnergy = 0;   // low detail (smooth16 variance)
    const total = size * size;

    for (let i = 0; i < total; i++) {
        const highDetail = patch[i] - smooth4[i];
        const midDetail = smooth4[i] - smooth16[i];
        highEnergy += highDetail * highDetail;
        midEnergy += midDetail * midDetail;
    }

    // Low frequency energy is variance of the lowest smoothed version
    let sm16Mean = 0;
    for (let i = 0; i < total; i++) sm16Mean += smooth16[i];
    sm16Mean /= total;
    for (let i = 0; i < total; i++) {
        const d = smooth16[i] - sm16Mean;
        lowEnergy += d * d;
    }

    highEnergy /= total;
    midEnergy /= total;
    lowEnergy /= total;

    const totalEnergy = highEnergy + midEnergy + lowEnergy;
    const highRatio = totalEnergy > 0.01 ? highEnergy / totalEnergy : 0.33;
    const midRatio = totalEnergy > 0.01 ? midEnergy / totalEnergy : 0.33;

    // AI images: less high-frequency energy relative to mid/low
    let score: number;
    if (highRatio < 0.10) score = 82;
    else if (highRatio < 0.18) score = 68;
    else if (highRatio < 0.28) score = 52;
    else if (highRatio < 0.38) score = 38;
    else score = 20;

    return {
        name: "Frequency Band Ratio", nameKey: "signal.freqBandRatio",
        category: "frequency", score, weight: 0.5,
        description: score > 55
            ? "High-frequency energy is unusually low — AI images lack fine detail"
            : "Frequency band distribution is natural — consistent with real camera capture",
        descriptionKey: score > 55 ? "signal.freqBand.ai" : "signal.freqBand.real",
        icon: "⋮",
        details: `High: ${(highRatio * 100).toFixed(1)}%, Mid: ${(midRatio * 100).toFixed(1)}%, Low: ${((1 - highRatio - midRatio) * 100).toFixed(1)}%.`,
    };
}
