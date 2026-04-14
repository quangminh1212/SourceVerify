/**
 * Method 53: Color Coherence Vector (CCV)
 * Pass et al., "Comparing Images Using Color Coherence Vectors", ACM MM 1996
 */

import type { AnalysisMethod } from "../../types";

export function analyzeColorCoherence(pixels: Uint8ClampedArray, width: number, height: number): AnalysisMethod {
    if (width < 16 || height < 16) {
        return {
            name: "Color Coherence Vector", nameKey: "signal.colorCoherence",
            category: "pixel", score: 50, weight: 0.35,
            description: "Image too small for CCV analysis",
            descriptionKey: "signal.ccv.error", icon: "â–¦",
        };
    }

    const analysisWidth = Math.min(256, width);
    const analysisHeight = Math.min(256, height);
    const totalPixels = analysisWidth * analysisHeight;
    const scaleX = width / analysisWidth;
    const scaleY = height / analysisHeight;

    const levels = 4;
    const binCount = levels * levels * levels;
    const coherent = new Float64Array(binCount);
    const incoherent = new Float64Array(binCount);

    const colorMap = new Uint8Array(totalPixels);
    for (let y = 0; y < analysisHeight; y++) {
        const sourceY = Math.min(height - 1, Math.floor(y * scaleY));
        for (let x = 0; x < analysisWidth; x++) {
            const sourceX = Math.min(width - 1, Math.floor(x * scaleX));
            const offset = (sourceY * width + sourceX) * 4;
            const r = Math.min(levels - 1, Math.floor(pixels[offset] / (256 / levels)));
            const g = Math.min(levels - 1, Math.floor(pixels[offset + 1] / (256 / levels)));
            const b = Math.min(levels - 1, Math.floor(pixels[offset + 2] / (256 / levels)));
            colorMap[y * analysisWidth + x] = r * levels * levels + g * levels + b;
        }
    }

    // CCV classifies each color bin by connected-component area, not by local
    // neighbor heuristics. The threshold is scaled to 1% of the analyzed image.
    const coherenceThreshold = Math.max(4, Math.round(totalPixels * 0.01));
    const visited = new Uint8Array(totalPixels);
    const queue = new Int32Array(totalPixels);
    let largestRegion = 0;

    for (let start = 0; start < totalPixels; start++) {
        if (visited[start]) {
            continue;
        }

        const bin = colorMap[start];
        let head = 0;
        let tail = 0;
        let regionSize = 0;

        visited[start] = 1;
        queue[tail++] = start;

        while (head < tail) {
            const index = queue[head++];
            regionSize++;
            const x = index % analysisWidth;
            const y = Math.floor(index / analysisWidth);

            const left = x > 0 ? index - 1 : -1;
            const right = x + 1 < analysisWidth ? index + 1 : -1;
            const up = y > 0 ? index - analysisWidth : -1;
            const down = y + 1 < analysisHeight ? index + analysisWidth : -1;

            if (left >= 0 && !visited[left] && colorMap[left] === bin) {
                visited[left] = 1;
                queue[tail++] = left;
            }
            if (right >= 0 && !visited[right] && colorMap[right] === bin) {
                visited[right] = 1;
                queue[tail++] = right;
            }
            if (up >= 0 && !visited[up] && colorMap[up] === bin) {
                visited[up] = 1;
                queue[tail++] = up;
            }
            if (down >= 0 && !visited[down] && colorMap[down] === bin) {
                visited[down] = 1;
                queue[tail++] = down;
            }
        }

        if (regionSize >= coherenceThreshold) {
            coherent[bin] += regionSize;
        } else {
            incoherent[bin] += regionSize;
        }
        largestRegion = Math.max(largestRegion, regionSize);
    }

    let totalCoherent = 0;
    let activeColor = 0;
    let dominantCoherentBin = 0;

    for (let i = 0; i < binCount; i++) {
        const binTotal = coherent[i] + incoherent[i];
        if (binTotal > 0) {
            totalCoherent += coherent[i];
            activeColor++;
            dominantCoherentBin = Math.max(dominantCoherentBin, coherent[i]);
        }
    }

    const coherenceRatio = totalPixels > 0 ? totalCoherent / totalPixels : 0;
    const largestRegionRatio = totalPixels > 0 ? largestRegion / totalPixels : 0;
    const dominantCoherentShare = totalCoherent > 0 ? dominantCoherentBin / totalCoherent : 0;
    const colorDiversity = activeColor / binCount;

    let score = 50;
    if (coherenceRatio > 0.82) score += 12;
    else if (coherenceRatio > 0.7) score += 6;
    else if (coherenceRatio < 0.45) score -= 8;
    else if (coherenceRatio < 0.55) score -= 4;

    if (largestRegionRatio > 0.18) score += 10;
    else if (largestRegionRatio < 0.07) score -= 5;

    if (dominantCoherentShare > 0.42) score += 6;
    else if (dominantCoherentShare < 0.18) score -= 4;

    if (colorDiversity < 0.18) score += 6;
    else if (colorDiversity > 0.5) score -= 6;

    score = Math.max(5, Math.min(95, score));

    return {
        name: "Color Coherence Vector", nameKey: "signal.colorCoherence",
        category: "color", score, weight: 0.35,
        description: score > 55
            ? "Color coherence is unnaturally high â€” AI images have overly uniform color regions"
            : "Color coherence is natural â€” incoherent color scatter consistent with real scene complexity",
        descriptionKey: score > 55 ? "signal.ccv.ai" : "signal.ccv.real",
        icon: "â–¦",
        details: `Coherence ratio: ${coherenceRatio.toFixed(4)}, Largest region: ${largestRegionRatio.toFixed(4)}, Dominant coherent share: ${dominantCoherentShare.toFixed(4)}, Color diversity: ${colorDiversity.toFixed(4)}, Active bins: ${activeColor}/${binCount}, Threshold: ${coherenceThreshold}.`,
    };
}
