/**
 * Text Compression Ratio
 * Uses data compression to measure text redundancy as AI indicator.
 * AI text compresses better due to higher regularity and lower entropy.
 *
 * Reference: Jiang et al. (2024) - Detecting LLM-Generated Text in Computing Education, IEEE Access
 * Reference: Benedetto et al. (2002) - Language Trees and Zipping, Physical Review Letters
 */

import type { AnalysisMethod } from "../../types";

export function analyzeTextCompressionRatio(text: string): AnalysisMethod {
    if (text.length < 200) {
        return { name: "Text Compression Ratio", nameKey: "signal.textCompressionRatio", category: "statistical", score: 50, weight: 0.2, description: "Text too short", descriptionKey: "signal.textCompressionRatio.error", icon: "🗜️" };
    }

    // LZ77-like compression: count back-references
    // Simple approach: for each position, find longest match in previous text
    const bytes = new TextEncoder().encode(text);
    let matchBytes = 0;
    const windowSize = 256;

    for (let i = 1; i < bytes.length; i++) {
        const searchStart = Math.max(0, i - windowSize);
        let bestLen = 0;
        for (let j = searchStart; j < i; j++) {
            let len = 0;
            while (i + len < bytes.length && bytes[j + len] === bytes[i + len] && len < 255) len++;
            if (len > bestLen) bestLen = len;
        }
        if (bestLen >= 3) { matchBytes += bestLen; i += bestLen - 1; }
    }

    const compressionRatio = matchBytes / bytes.length;

    // Also measure segment-level compression variation
    const segmentSize = Math.min(200, Math.floor(text.length / 3));
    const segmentRatios: number[] = [];
    for (let start = 0; start < text.length - segmentSize; start += segmentSize) {
        const segment = text.substring(start, start + segmentSize);
        const segBytes = new TextEncoder().encode(segment);
        let segMatch = 0;
        for (let i = 1; i < segBytes.length; i++) {
            const ss = Math.max(0, i - 128);
            let best = 0;
            for (let j = ss; j < i; j++) {
                let l = 0;
                while (i + l < segBytes.length && segBytes[j + l] === segBytes[i + l] && l < 64) l++;
                if (l > best) best = l;
            }
            if (best >= 3) { segMatch += best; i += best - 1; }
        }
        segmentRatios.push(segMatch / segBytes.length);
    }

    const segMean = segmentRatios.length > 0 ? segmentRatios.reduce((a, b) => a + b, 0) / segmentRatios.length : 0;
    const segVar = segmentRatios.length > 1 ? segmentRatios.reduce((a, b) => a + (b - segMean) ** 2, 0) / segmentRatios.length : 0;

    // AI: higher compression ratio (more redundant), lower segment variance
    let score: number;
    if (compressionRatio > 0.35 && segVar < 0.005) score = 74;
    else if (compressionRatio > 0.28 && segVar < 0.01) score = 62;
    else if (compressionRatio > 0.22) score = 50;
    else if (compressionRatio < 0.12 && segVar > 0.015) score = 25;
    else if (compressionRatio < 0.15) score = 35;
    else score = 42;

    return {
        name: "Text Compression Ratio", nameKey: "signal.textCompressionRatio", category: "statistical", score, weight: 0.2,
        description: score > 55 ? "High compressibility — redundant patterns suggest AI generation" : "Natural information density — consistent with human writing",
        descriptionKey: score > 55 ? "signal.textCompressionRatio.ai" : "signal.textCompressionRatio.real", icon: "🗜️",
        details: `Compression: ${(compressionRatio * 100).toFixed(1)}%, Segment variance: ${segVar.toFixed(5)}.`,
    };
}
