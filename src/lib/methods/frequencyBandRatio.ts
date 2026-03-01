import type { AnalysisMethod } from "../types";
import { gray } from "./pixelUtils";

/**
 * Signal 25: Frequency Band Energy Ratio
 * Comparing energy distribution across frequency bands
 * AI models produce characteristic frequency band signatures
 */
export function analyzeFrequencyBandRatio(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    const size = Math.min(128, Math.min(width, height));
    const ox = Math.floor((width - size) / 2);
    const oy = Math.floor((height - size) / 2);

    // Multi-scale energy via difference of averages
    const computeEnergy = (blockSize: number): number => {
        let energy = 0, count = 0;
        for (let by = 0; by < size - blockSize; by += blockSize) {
            for (let bx = 0; bx < size - blockSize; bx += blockSize) {
                let sum = 0, n = 0;
                for (let y = by; y < by + blockSize; y++) {
                    for (let x = bx; x < bx + blockSize; x++) {
                        sum += gray(pixels, ((oy + y) * width + (ox + x)) * 4);
                        n++;
                    }
                }
                const mean = n > 0 ? sum / n : 0;
                for (let y = by; y < by + blockSize; y++) {
                    for (let x = bx; x < bx + blockSize; x++) {
                        const diff = gray(pixels, ((oy + y) * width + (ox + x)) * 4) - mean;
                        energy += diff * diff;
                        count++;
                    }
                }
            }
        }
        return count > 0 ? energy / count : 0;
    };

    const lowBandEnergy = computeEnergy(32); // low frequency
    const midBandEnergy = computeEnergy(8);  // mid frequency
    const highBandEnergy = computeEnergy(2); // high frequency

    const totalEnergy = lowBandEnergy + midBandEnergy + highBandEnergy;
    const highRatio = totalEnergy > 0 ? highBandEnergy / totalEnergy : 0.33;
    const midRatio = totalEnergy > 0 ? midBandEnergy / totalEnergy : 0.33;

    // AI images: less high-frequency energy relative to mid/low
    let score: number;
    if (highRatio < 0.15) score = 82;
    else if (highRatio < 0.25) score = 68;
    else if (highRatio < 0.35) score = 52;
    else if (highRatio < 0.45) score = 38;
    else score = 20;

    return {
        name: "Frequency Band Ratio", nameKey: "signal.freqBandRatio",
        category: "frequency", score, weight: 0.5,
        description: score > 55
            ? "High-frequency energy is unusually low â€” AI images lack fine detail"
            : "Frequency band distribution is natural â€” consistent with real camera capture",
        descriptionKey: score > 55 ? "signal.freqBand.ai" : "signal.freqBand.real",
        icon: "â‹®",
        details: `High: ${(highRatio * 100).toFixed(1)}%, Mid: ${(midRatio * 100).toFixed(1)}%, Low: ${((1 - highRatio - midRatio) * 100).toFixed(1)}%.`,
    };
}
