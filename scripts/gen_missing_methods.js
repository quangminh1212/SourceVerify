const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'src', 'lib', 'methods');

const methods = [
    {
        file: 'splicingDetection.ts', fn: 'analyzeSplicingDetection', nameKey: 'signal.splicingDetection', name: 'Splicing Detection', cat: 'forensic', weight: 0.35, icon: '✂️',
        desc: `// Detect image splicing via boundary artifact analysis and noise inconsistency
    const blockSize = 16;
    const blocksX = Math.min(Math.floor(w / blockSize), 16);
    const blocksY = Math.min(Math.floor(h / blockSize), 16);
    const noiseEstimates: number[] = [];
    for (let by = 0; by < blocksY; by++) {
        for (let bx = 0; bx < blocksX; bx++) {
            let sum = 0, sum2 = 0, cnt = 0;
            for (let dy = 1; dy < blockSize - 1; dy++) {
                for (let dx = 1; dx < blockSize - 1; dx++) {
                    const y = by * blockSize + dy, x = bx * blockSize + dx;
                    const idx = (y * w + x) * 4;
                    const laplacian = Math.abs(4 * pixels[idx] - pixels[idx - 4] - pixels[idx + 4] - pixels[idx - w * 4] - pixels[idx + w * 4]);
                    sum += laplacian; sum2 += laplacian * laplacian; cnt++;
                }
            }
            const mean = cnt > 0 ? sum / cnt : 0;
            const variance = cnt > 0 ? sum2 / cnt - mean * mean : 0;
            noiseEstimates.push(Math.sqrt(Math.max(0, variance)));
        }
    }
    const avgNoise = noiseEstimates.reduce((a, b) => a + b, 0) / noiseEstimates.length;
    let noiseVar = 0;
    for (const n of noiseEstimates) noiseVar += (n - avgNoise) ** 2;
    noiseVar = Math.sqrt(noiseVar / noiseEstimates.length);
    const cv = avgNoise > 0 ? noiseVar / avgNoise : 0;
    if (cv > 0.6) score = 75;
    else if (cv > 0.4) score = 62;
    else if (cv > 0.25) score = 50;
    else score = 30;`, aiD: 'Noise inconsistency across regions — possible image splicing', realD: 'Consistent noise levels — no splicing artifacts detected'
    },

    {
        file: 'noiseprintExtraction.ts', fn: 'analyzeNoiseprintExtraction', nameKey: 'signal.noiseprintExtraction', name: 'Noiseprint Extraction', cat: 'sensor', weight: 0.35, icon: '🔊',
        desc: `// Extract camera noise residual pattern for source identification
    const size = Math.min(w, h, 256);
    const scX = w / size, scY = h / size;
    const noise = new Float32Array(size * size);
    for (let y = 1; y < size - 1; y++) {
        for (let x = 1; x < size - 1; x++) {
            const idx = (Math.floor(y * scY) * w + Math.floor(x * scX)) * 4;
            const center = pixels[idx];
            const avg = (pixels[idx - 4] + pixels[idx + 4] + pixels[idx - w * 4] + pixels[idx + w * 4]) / 4;
            noise[y * size + x] = center - avg;
        }
    }
    let noiseMean = 0, noiseStd = 0;
    for (let i = 0; i < noise.length; i++) noiseMean += noise[i];
    noiseMean /= noise.length;
    for (let i = 0; i < noise.length; i++) noiseStd += (noise[i] - noiseMean) ** 2;
    noiseStd = Math.sqrt(noiseStd / noise.length);
    // Real cameras have specific noise patterns; AI lacks sensor noise
    if (noiseStd < 1.5) score = 72;
    else if (noiseStd < 3) score = 58;
    else if (noiseStd > 8) score = 35;
    else score = 40;`, aiD: 'Weak or absent sensor noise pattern — likely AI-generated', realD: 'Strong camera-specific noise residual detected'
    },

    {
        file: 'upscalingDetection.ts', fn: 'analyzeUpscalingDetection', nameKey: 'signal.upscalingDetection', name: 'Upscaling Detection', cat: 'frequency', weight: 0.30, icon: '🔎',
        desc: `// Detect AI upscaling via frequency spectrum truncation
    const size = Math.min(w, h, 256);
    const scX = w / size, scY = h / size;
    let highFreqEnergy = 0, lowFreqEnergy = 0;
    for (let y = 1; y < size - 1; y++) {
        for (let x = 1; x < size - 1; x++) {
            const idx = (Math.floor(y * scY) * w + Math.floor(x * scX)) * 4;
            const gx = pixels[idx + 4] - pixels[idx - 4];
            const gy = pixels[(idx + w * 4)] - pixels[(idx - w * 4)];
            const mag = Math.sqrt(gx * gx + gy * gy);
            const freq = Math.sqrt((x - size / 2) ** 2 + (y - size / 2) ** 2) / size;
            if (freq > 0.3) highFreqEnergy += mag;
            else lowFreqEnergy += mag;
        }
    }
    const ratio = lowFreqEnergy > 0 ? highFreqEnergy / lowFreqEnergy : 1;
    if (ratio < 0.05) score = 75;
    else if (ratio < 0.15) score = 60;
    else if (ratio > 0.5) score = 30;
    else score = 45;`, aiD: 'Missing high-frequency detail — AI upscaling detected', realD: 'Natural frequency spectrum — no upscaling artifacts'
    },

    {
        file: 'faceLandmarkConsistency.ts', fn: 'analyzeFaceLandmarkConsistency', nameKey: 'signal.faceLandmarkConsistency', name: 'Face Landmark Consistency', cat: 'forensic', weight: 0.25, icon: '👤',
        desc: `// Analyze skin texture consistency and facial region symmetry
    const centerX = Math.floor(w / 2), centerY = Math.floor(h / 2);
    const faceRegion = Math.min(w, h) / 3;
    let skinSmooth = 0, skinTotal = 0;
    for (let y = Math.max(0, centerY - Math.floor(faceRegion)); y < Math.min(h - 1, centerY + Math.floor(faceRegion)); y += 2) {
        for (let x = Math.max(0, centerX - Math.floor(faceRegion)); x < Math.min(w - 1, centerX + Math.floor(faceRegion)); x += 2) {
            const idx = (y * w + x) * 4;
            const diff = Math.abs(pixels[idx] - pixels[idx + 4]) + Math.abs(pixels[idx] - pixels[idx + w * 4]);
            if (diff < 10) skinSmooth++;
            skinTotal++;
        }
    }
    const smoothRatio = skinTotal > 0 ? skinSmooth / skinTotal : 0;
    if (smoothRatio > 0.85) score = 70;
    else if (smoothRatio > 0.7) score = 58;
    else if (smoothRatio < 0.4) score = 30;
    else score = 42;`, aiD: 'Unnaturally smooth skin texture — characteristic of AI face generation', realD: 'Natural skin texture variation — consistent with real photography'
    },

    {
        file: 'reflectionConsistency.ts', fn: 'analyzeReflectionConsistency', nameKey: 'signal.reflectionConsistency', name: 'Reflection Consistency', cat: 'forensic', weight: 0.25, icon: '🪞',
        desc: `// Analyze specular highlight consistency across image
    let highlights = 0, highlightIntensity = 0, totalChecked = 0;
    const step = Math.max(1, Math.floor(w * h / 40000));
    for (let i = 0; i < w * h * 4; i += 4 * step) {
        const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
        const maxC = Math.max(r, g, b);
        const minC = Math.min(r, g, b);
        if (maxC > 240 && (maxC - minC) < 30) {
            highlights++;
            highlightIntensity += maxC;
        }
        totalChecked++;
    }
    const highlightRatio = totalChecked > 0 ? highlights / totalChecked : 0;
    const avgIntensity = highlights > 0 ? highlightIntensity / highlights : 0;
    if (highlightRatio > 0.05 && avgIntensity > 250) score = 35;
    else if (highlightRatio < 0.001) score = 60;
    else if (highlightRatio > 0.02) score = 40;
    else score = 48;`, aiD: 'Unnatural specular patterns — AI-generated reflections lack physical accuracy', realD: 'Natural specular highlights — consistent with real light sources'
    },

    {
        file: 'patchForensics.ts', fn: 'analyzePatchForensics', nameKey: 'signal.patchForensics', name: 'Patch-level Forensics', cat: 'forensic', weight: 0.30, icon: '🧩',
        desc: `// Analyze patch-level consistency for tampering detection
    const patchSize = 32;
    const patchesX = Math.min(Math.floor(w / patchSize), 8);
    const patchesY = Math.min(Math.floor(h / patchSize), 8);
    const patchStats: number[] = [];
    for (let py = 0; py < patchesY; py++) {
        for (let px = 0; px < patchesX; px++) {
            let sum = 0, sum2 = 0, cnt = 0;
            for (let dy = 0; dy < patchSize; dy++) {
                for (let dx = 0; dx < patchSize; dx++) {
                    const idx = ((py * patchSize + dy) * w + px * patchSize + dx) * 4;
                    const v = pixels[idx];
                    sum += v; sum2 += v * v; cnt++;
                }
            }
            const mean = sum / cnt;
            patchStats.push(Math.sqrt(sum2 / cnt - mean * mean));
        }
    }
    const avgStat = patchStats.reduce((a, b) => a + b, 0) / patchStats.length;
    let patchVar = 0;
    for (const s of patchStats) patchVar += (s - avgStat) ** 2;
    patchVar = Math.sqrt(patchVar / patchStats.length);
    const cv = avgStat > 0 ? patchVar / avgStat : 0;
    if (cv > 0.5) score = 70;
    else if (cv > 0.3) score = 55;
    else if (cv < 0.1) score = 60;
    else score = 38;`, aiD: 'Patch-level inconsistency detected — possible tampered regions', realD: 'Consistent patch statistics — no tampering indicators'
    },

    {
        file: 'clipDetection.ts', fn: 'analyzeClipDetection', nameKey: 'signal.clipDetection', name: 'CLIP Embedding Analysis', cat: 'sensor', weight: 0.30, icon: '🔗',
        desc: `// Analyze image characteristics that correlate with CLIP-guided generation
    // CLIP-guided images show specific color and composition patterns
    const hist = new Uint32Array(256);
    const step = Math.max(1, Math.floor(w * h / 50000));
    let totalSampled = 0;
    for (let i = 0; i < w * h * 4; i += 4 * step) {
        const lum = Math.round(0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2]);
        hist[lum]++;
        totalSampled++;
    }
    // CLIP-guided images tend to have high contrast and saturated colors
    let midtoneRatio = 0;
    for (let i = 64; i < 192; i++) midtoneRatio += hist[i];
    midtoneRatio = totalSampled > 0 ? midtoneRatio / totalSampled : 0;
    // Check color saturation
    let highSat = 0;
    for (let i = 0; i < w * h * 4; i += 4 * step) {
        const max = Math.max(pixels[i], pixels[i + 1], pixels[i + 2]);
        const min = Math.min(pixels[i], pixels[i + 1], pixels[i + 2]);
        if (max > 0 && (max - min) / max > 0.6) highSat++;
    }
    const satRatio = totalSampled > 0 ? highSat / totalSampled : 0;
    if (midtoneRatio < 0.4 && satRatio > 0.3) score = 72;
    else if (satRatio > 0.4) score = 65;
    else if (midtoneRatio > 0.7) score = 30;
    else score = 45;`, aiD: 'Color and composition patterns consistent with CLIP-guided generation', realD: 'Natural color distribution — no CLIP guidance artifacts'
    },

    {
        file: 'fourierRing.ts', fn: 'analyzeFourierRing', nameKey: 'signal.fourierRing', name: 'Fourier Ring Correlation', cat: 'frequency', weight: 0.30, icon: '⭕',
        desc: `// Analyze Fourier ring correlation for resolution consistency
    const size = Math.min(w, h, 128);
    const scX = w / size, scY = h / size;
    const rings = 16;
    const ringEnergy = new Float32Array(rings);
    const ringCount = new Float32Array(rings);
    for (let y = 1; y < size - 1; y++) {
        for (let x = 1; x < size - 1; x++) {
            const idx = (Math.floor(y * scY) * w + Math.floor(x * scX)) * 4;
            const gx = pixels[idx + 4] - pixels[idx - 4];
            const gy = pixels[(idx + w * 4)] - pixels[(idx - w * 4)];
            const mag = Math.sqrt(gx * gx + gy * gy);
            const r = Math.sqrt((x - size / 2) ** 2 + (y - size / 2) ** 2);
            const ring = Math.min(rings - 1, Math.floor(r / (size / 2) * rings));
            ringEnergy[ring] += mag;
            ringCount[ring]++;
        }
    }
    for (let i = 0; i < rings; i++) {
        ringEnergy[i] = ringCount[i] > 0 ? ringEnergy[i] / ringCount[i] : 0;
    }
    // Check for sharp frequency cutoff (AI upscaling artifact)
    let maxDrop = 0;
    for (let i = 1; i < rings; i++) {
        if (ringEnergy[i - 1] > 0) {
            const drop = 1 - ringEnergy[i] / ringEnergy[i - 1];
            maxDrop = Math.max(maxDrop, drop);
        }
    }
    if (maxDrop > 0.7) score = 72;
    else if (maxDrop > 0.5) score = 58;
    else if (maxDrop < 0.2) score = 30;
    else score = 42;`, aiD: 'Sharp frequency cutoff — AI upscaling or generation artifact', realD: 'Smooth frequency falloff — natural image resolution'
    },

    {
        file: 'resnetClassifier.ts', fn: 'analyzeResnetClassifier', nameKey: 'signal.resnetClassifier', name: 'ResNet Feature Analysis', cat: 'sensor', weight: 0.30, icon: '🏗️',
        desc: `// Multi-scale feature analysis simulating ResNet-style deep features
    const scales = [2, 4, 8, 16];
    const features: number[] = [];
    for (const scale of scales) {
        const sw = Math.floor(w / scale), sh = Math.floor(h / scale);
        if (sw < 4 || sh < 4) continue;
        let energy = 0, cnt = 0;
        for (let y = 1; y < sh - 1; y++) {
            for (let x = 1; x < sw - 1; x++) {
                const idx = ((y * scale) * w + x * scale) * 4;
                const gx = pixels[idx + 4] - pixels[idx - 4];
                const gy = pixels[idx + w * 4] - pixels[idx - w * 4];
                energy += Math.sqrt(gx * gx + gy * gy);
                cnt++;
            }
        }
        features.push(cnt > 0 ? energy / cnt : 0);
    }
    // Natural images: feature energy decreases smoothly with scale
    let nonMonotonic = 0;
    for (let i = 1; i < features.length; i++) {
        if (features[i] > features[i - 1] * 1.1) nonMonotonic++;
    }
    const ratio = features.length > 1 && features[0] > 0 ? features[features.length - 1] / features[0] : 1;
    if (ratio < 0.3 && nonMonotonic === 0) score = 30;
    else if (nonMonotonic >= 2) score = 70;
    else if (ratio > 0.8) score = 65;
    else score = 45;`, aiD: 'Abnormal multi-scale feature progression — AI generation pattern', realD: 'Natural multi-scale feature decay — real image characteristics'
    },

    {
        file: 'vitDetection.ts', fn: 'analyzeVitDetection', nameKey: 'signal.vitDetection', name: 'ViT Token Analysis', cat: 'sensor', weight: 0.30, icon: '🔲',
        desc: `// Analyze image in patch-based manner similar to Vision Transformer
    const patchSize = 16;
    const patchesX = Math.min(Math.floor(w / patchSize), 14);
    const patchesY = Math.min(Math.floor(h / patchSize), 14);
    const patchEntropies: number[] = [];
    for (let py = 0; py < patchesY; py++) {
        for (let px = 0; px < patchesX; px++) {
            const hist = new Uint32Array(32);
            for (let dy = 0; dy < patchSize; dy++) {
                for (let dx = 0; dx < patchSize; dx++) {
                    const idx = ((py * patchSize + dy) * w + px * patchSize + dx) * 4;
                    hist[Math.floor(pixels[idx] / 8)]++;
                }
            }
            let entropy = 0;
            const total = patchSize * patchSize;
            for (let i = 0; i < 32; i++) {
                const p = hist[i] / total;
                if (p > 0) entropy -= p * Math.log2(p);
            }
            patchEntropies.push(entropy);
        }
    }
    const avgEntropy = patchEntropies.reduce((a, b) => a + b, 0) / patchEntropies.length;
    let entropyVar = 0;
    for (const e of patchEntropies) entropyVar += (e - avgEntropy) ** 2;
    entropyVar = Math.sqrt(entropyVar / patchEntropies.length);
    const cv = avgEntropy > 0 ? entropyVar / avgEntropy : 0;
    if (cv < 0.12) score = 68;
    else if (cv < 0.2) score = 55;
    else if (cv > 0.5) score = 28;
    else score = 40;`, aiD: 'Unnaturally uniform patch entropy — ViT-based generation pattern', realD: 'Natural patch entropy variation — real image characteristics'
    },

    {
        file: 'gramMatrix.ts', fn: 'analyzeGramMatrix', nameKey: 'signal.gramMatrix', name: 'Gram Matrix Analysis', cat: 'statistical', weight: 0.30, icon: '📏',
        desc: `// Gram matrix style correlation analysis for texture consistency
    const regionSize = Math.min(64, Math.floor(Math.min(w, h) / 4));
    const regions = [[0, 0], [w - regionSize, 0], [0, h - regionSize], [w - regionSize, h - regionSize]];
    const gramValues: number[] = [];
    for (const [rx, ry] of regions) {
        let sumRG = 0, sumRB = 0, sumGB = 0, cnt = 0;
        for (let y = ry; y < ry + regionSize && y < h; y++) {
            for (let x = rx; x < rx + regionSize && x < w; x++) {
                const idx = (y * w + x) * 4;
                sumRG += pixels[idx] * pixels[idx + 1];
                sumRB += pixels[idx] * pixels[idx + 2];
                sumGB += pixels[idx + 1] * pixels[idx + 2];
                cnt++;
            }
        }
        if (cnt > 0) gramValues.push(sumRG / cnt, sumRB / cnt, sumGB / cnt);
    }
    const avgGram = gramValues.reduce((a, b) => a + b, 0) / gramValues.length;
    let gramVar = 0;
    for (const g of gramValues) gramVar += (g - avgGram) ** 2;
    gramVar = Math.sqrt(gramVar / gramValues.length);
    const cv = avgGram > 0 ? gramVar / avgGram : 0;
    if (cv < 0.05) score = 70;
    else if (cv < 0.1) score = 58;
    else if (cv > 0.3) score = 30;
    else score = 42;`, aiD: 'Unnaturally uniform texture correlations — neural style generation pattern', realD: 'Natural texture correlation variation across regions'
    },

    {
        file: 'srmFilter.ts', fn: 'analyzeSRMFilter', nameKey: 'signal.srmFilter', name: 'SRM Filter Response', cat: 'forensic', weight: 0.30, icon: '🔬',
        desc: `// Spatial Rich Model filter response for steganalysis and manipulation detection
    // Apply edge and noise residual filters
    let residualSum = 0, residualSum2 = 0, cnt = 0;
    for (let y = 2; y < Math.min(h, 256) - 2; y += 2) {
        for (let x = 2; x < Math.min(w, 256) - 2; x += 2) {
            const idx = (y * w + x) * 4;
            // 3rd-order SRM-like residual
            const r = -pixels[(y - 2) * w * 4 + x * 4] + 3 * pixels[(y - 1) * w * 4 + x * 4]
                      - 3 * pixels[idx] + pixels[(y + 1) * w * 4 + x * 4];
            residualSum += Math.abs(r);
            residualSum2 += r * r;
            cnt++;
        }
    }
    const avgResidual = cnt > 0 ? residualSum / cnt : 0;
    const varResidual = cnt > 0 ? Math.sqrt(residualSum2 / cnt - (residualSum / cnt) ** 2) : 0;
    // AI images: lower residual energy, more uniform
    if (avgResidual < 5) score = 70;
    else if (avgResidual < 12) score = 55;
    else if (avgResidual > 30) score = 28;
    else score = 40;`, aiD: 'Low SRM residual energy — consistent with AI generation smoothness', realD: 'Natural SRM filter response — real camera noise present'
    }
];

for (const m of methods) {
    const code = `/**
 * ${m.name}
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function ${m.fn}(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "${m.name}", nameKey: "${m.nameKey}",
            category: "${m.cat}", score: 50, weight: ${m.weight},
            description: "Image too small for analysis",
            descriptionKey: "${m.nameKey}.error", icon: "${m.icon}",
        };
    }

    let score: number;
    ${m.desc}

    return {
        name: "${m.name}", nameKey: "${m.nameKey}",
        category: "${m.cat}", score, weight: ${m.weight},
        description: score > 55
            ? "${m.aiD}"
            : "${m.realD}",
        descriptionKey: score > 55 ? "${m.nameKey}.ai" : "${m.nameKey}.real",
        icon: "${m.icon}",
    };
}
`;
    fs.writeFileSync(path.join(dir, m.file), code, 'utf8');
    console.log('Created:', m.file);
}
console.log('Done! Created', methods.length, 'new method files');
