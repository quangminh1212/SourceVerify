import type { AnalysisMethod } from "../../types";
import { gray } from "../pixelUtils";

/**
 * Signal 33: Quantization Table Fingerprint
 * JPEG quantization reveals compression history
 * AI images often lack standard camera quantization patterns
 */
export function analyzeQuantizationFingerprint(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    // Analyze 8x8 block DCT coefficient quantization patterns
    const blockSize = 8;
    const blocksX = Math.floor(width / blockSize);
    const blocksY = Math.floor(height / blockSize);

    if (blocksX < 3 || blocksY < 3) {
        return {
            name: "Quantization Fingerprint", nameKey: "signal.quantFingerprint",
            category: "frequency", score: 50, weight: 0.3,
            description: "Image too small for quantization analysis",
            descriptionKey: "signal.quant.error", icon: "⊞",
        };
    }

    // Check for evidence of quantization steps in pixel values
    const histogram = new Array(256).fill(0);
    const totalPixels = width * height;
    const step = Math.max(1, Math.floor(totalPixels / 80000));

    for (let i = 0; i < totalPixels * 4; i += step * 4) {
        const g = Math.floor(gray(pixels, i));
        histogram[Math.min(255, Math.max(0, g))]++;
    }

    // Detect periodic patterns in histogram (evidence of quantization)
    let periodicScore = 0;
    for (let period = 2; period <= 8; period++) {
        let correlation = 0;
        let count = 0;
        for (let i = period; i < 256 - period; i++) {
            correlation += Math.abs(histogram[i] - histogram[i - period]) /
                (Math.max(histogram[i], histogram[i - period]) + 1);
            count++;
        }
        if (count > 0) periodicScore += correlation / count;
    }
    periodicScore /= 7; // normalize across periods

    // Count "comb" pattern: alternating high-low in histogram
    let combCount = 0;
    for (let i = 1; i < 255; i++) {
        if ((histogram[i] > histogram[i - 1] * 1.5 && histogram[i] > histogram[i + 1] * 1.5) ||
            (histogram[i] < histogram[i - 1] * 0.67 && histogram[i] < histogram[i + 1] * 0.67)) {
            combCount++;
        }
    }
    const combRatio = combCount / 254;

    // Camera JPEG: shows quantization comb patterns
    let score: number;
    if (combRatio < 0.10) score = 72; // no quantization = likely AI (clean generation)
    else if (combRatio < 0.20) score = 58;
    else if (combRatio < 0.35) score = 42;
    else if (combRatio < 0.50) score = 28;
    else score = 15; // strong quantization = real JPEG

    return {
        name: "Quantization Fingerprint", nameKey: "signal.quantFingerprint",
        category: "compression", score, weight: 0.3,
        description: score > 55
            ? "No JPEG quantization patterns — image appears to bypass standard compression"
            : "JPEG quantization patterns present — consistent with standard camera pipeline",
        descriptionKey: score > 55 ? "signal.quant.ai" : "signal.quant.real",
        icon: "⊞",
        details: `Comb ratio: ${combRatio.toFixed(3)}, Periodic score: ${periodicScore.toFixed(4)}, Comb peaks: ${combCount}.`,
    };
}