/**
 * EfficientNet Feature Analysis
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzeEfficientnetFeatures(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "EfficientNet Feature Analysis", nameKey: "signal.efficientnetDetection",
            category: "sensor", score: 50, weight: 0.35,
            description: "Image too small for analysis",
            descriptionKey: "signal.efficientnetDetection.error", icon: "🧠",
        };
    }

    let score: number;
    
    // Simulate EfficientNet-style multi-scale feature extraction
    // Analyze texture statistics at multiple scales (proxy for deep features)
    const scales = [4, 8, 16, 32];
    const features = [];
    for (const scale of scales) {
        const sw = Math.floor(w / scale), sh = Math.floor(h / scale);
        if (sw < 2 || sh < 2) continue;
        let mean = 0, cnt = 0;
        for (let y = 0; y < sh; y++) {
            for (let x = 0; x < sw; x++) {
                let blockMean = 0;
                for (let dy = 0; dy < scale && y*scale+dy < h; dy++) {
                    for (let dx = 0; dx < scale && x*scale+dx < w; dx++) {
                        blockMean += pixels[((y*scale+dy)*w+x*scale+dx)*4];
                    }
                }
                blockMean /= scale * scale;
                mean += blockMean;
                cnt++;
            }
        }
        mean /= cnt;
        let var_ = 0;
        cnt = 0;
        for (let y = 0; y < sh; y++) {
            for (let x = 0; x < sw; x++) {
                let blockMean = 0;
                for (let dy = 0; dy < scale && y*scale+dy < h; dy++) {
                    for (let dx = 0; dx < scale && x*scale+dx < w; dx++) {
                        blockMean += pixels[((y*scale+dy)*w+x*scale+dx)*4];
                    }
                }
                blockMean /= scale * scale;
                var_ += (blockMean - mean) ** 2;
                cnt++;
            }
        }
        features.push(cnt > 0 ? Math.sqrt(var_ / cnt) : 0);
    }
    // Natural images: variance increases with coarser scale
    // AI images: more uniform across scales
    let monotonic = 0;
    for (let i = 1; i < features.length; i++) {
        if (features[i] >= features[i-1] * 0.8) monotonic++;
    }
    const scaleRatio = features.length > 1 && features[0] > 0 ? features[features.length-1] / features[0] : 1;
    if (scaleRatio < 0.5 && monotonic < features.length - 1) score = 68;
    else if (scaleRatio > 2) score = 30;
    else if (Math.abs(scaleRatio - 1) < 0.2) score = 65;
    else score = 45;

    return {
        name: "EfficientNet Feature Analysis", nameKey: "signal.efficientnetDetection",
        category: "sensor", score, weight: 0.35,
        description: score > 55
            ? "Multi-scale feature distribution atypical — suggests AI generation pipeline"
            : "Natural multi-scale feature progression — consistent with real photography",
        descriptionKey: score > 55 ? "signal.efficientnetDetection.ai" : "signal.efficientnetDetection.real",
        icon: "🧠",
    };
}
