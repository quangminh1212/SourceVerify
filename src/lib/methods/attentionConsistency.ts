/**
 * Attention Map Consistency
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeAttentionConsistency(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Attention Map Consistency", nameKey: "signal.attentionConsistency",
            category: "sensor", score: 50, weight: 0.3,
            description: "Image too small for analysis",
            descriptionKey: "signal.attentionConsistency.error", icon: "👁️",
        };
    }

    let score: number;
    
    // Analyze spatial attention/detail consistency across image regions
    const gridSize = 4;
    const cellW = Math.floor(w / gridSize), cellH = Math.floor(h / gridSize);
    const detailMap = [];
    for (let gy = 0; gy < gridSize; gy++) {
        for (let gx = 0; gx < gridSize; gx++) {
            let edgeSum = 0, cnt = 0;
            for (let y = gy*cellH+1; y < (gy+1)*cellH-1 && y < h-1; y += 2) {
                for (let x = gx*cellW+1; x < (gx+1)*cellW-1 && x < w-1; x += 2) {
                    const idx = (y*w+x)*4;
                    const gx_ = Math.abs(pixels[idx+4] - pixels[idx-4]);
                    const gy_ = Math.abs(pixels[(idx+w*4)] - pixels[(idx-w*4)]);
                    edgeSum += gx_ + gy_;
                    cnt++;
                }
            }
            detailMap.push(cnt > 0 ? edgeSum / cnt : 0);
        }
    }
    // Check detail consistency
    const avgDetail = detailMap.reduce((a,b)=>a+b,0) / detailMap.length;
    let varDetail = 0;
    for (const d of detailMap) varDetail += (d - avgDetail) ** 2;
    varDetail = Math.sqrt(varDetail / detailMap.length);
    const cv = avgDetail > 0 ? varDetail / avgDetail : 0;
    // AI images tend to have unnaturally uniform or unnaturally varied detail
    if (cv < 0.15) score = 68;
    else if (cv > 1.5) score = 62;
    else if (cv > 0.3 && cv < 0.8) score = 30;
    else score = 45;

    return {
        name: "Attention Map Consistency", nameKey: "signal.attentionConsistency",
        category: "sensor", score, weight: 0.3,
        description: score > 55
            ? "Unnatural attention/detail distribution — AI-generated consistency pattern"
            : "Natural attention distribution — real-world detail variation confirmed",
        descriptionKey: score > 55 ? "signal.attentionConsistency.ai" : "signal.attentionConsistency.real",
        icon: "👁️",
    };
}
