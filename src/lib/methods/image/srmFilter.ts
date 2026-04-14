/**
 * SRM Filter Response
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../../types";

export function analyzeSRMFilter(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "SRM Filter Response", nameKey: "signal.srmFilter",
            category: "statistical", score: 50, weight: 0.3,
            description: "Image too small for analysis",
            descriptionKey: "signal.srmFilter.error", icon: "🔬",
 details,
    };
    }

    let score: number;
    // Spatial Rich Model filter response for steganalysis and manipulation detection
    // Apply edge and noise residual filters
    let residualSum = 0, cnt = 0;
    for (let y = 2; y < Math.min(h, 256) - 2; y += 2) {
        for (let x = 2; x < Math.min(w, 256) - 2; x += 2) {
            const idx = (y * w + x) * 4;
            // 3rd-order SRM-like residual
            const r = -pixels[(y - 2) * w * 4 + x * 4] + 3 * pixels[(y - 1) * w * 4 + x * 4]
                - 3 * pixels[idx] + pixels[(y + 1) * w * 4 + x * 4];
            residualSum += Math.abs(r);

            cnt++;
        }
    }
    const avgResidual = cnt > 0 ? residualSum / cnt : 0;
    // AI images: lower residual energy, more uniform
    if (avgResidual < 5) score = 70;
    else if (avgResidual < 12) score = 55;
    else if (avgResidual > 30) score = 28;
    else score = 40;

    return {
        name: "SRM Filter Response", nameKey: "signal.srmFilter",
        category: "forensic", score, weight: 0.3,
        description: score > 55
            ? "Low SRM residual energy — consistent with AI generation smoothness"
            : "Natural SRM filter response — real camera noise present",
        descriptionKey: score > 55 ? "signal.srmFilter.ai" : "signal.srmFilter.real",
        icon: "🔬",
    };
}
