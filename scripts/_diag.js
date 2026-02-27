
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const MAX = 1024;

/**
 * SourceVerify Node.js Headless Benchmark
 * Ports all 12 pixel-based signals to node-canvas for headless testing
 * Skips analyzeMultiscaleReconstruction (requires JPEG re-encoding in browser)
 */

const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

process.on('unhandledRejection', (e) => { console.error('UNHANDLED:', e); process.exit(1); });
process.on('uncaughtException', (e) => { console.error('UNCAUGHT:', e); process.exit(1); });

// Constants
const AI_SOFTWARE_SIGNATURES = ["midjourney", "dall-e", "dalle", "stable diffusion", "comfyui", "automatic1111", "a1111", "novelai", "civitai", "invoke ai", "adobe firefly", "firefly", "bing image creator", "leonardo ai", "playground ai", "deep dream", "artbreeder", "nightcafe", "craiyon", "dreamstudio", "flux", "sora", "runway", "pika", "kling", "hailuo", "luma dream", "minimax", "genmo", "ideogram", "recraft", "grok", "gemini", "imagen", "copilot designer", "meta ai", "stability ai", "sdxl", "sd3", "kandinsky", "wuerstchen", "pixart", "deepfloyd", "kolors", "hunyuan", "cogview", "glide", "veo", "lumiere", "dream machine", "emu"];
const REAL_CAMERA_SIGNATURES = ["canon", "nikon", "sony", "fujifilm", "olympus", "panasonic", "leica", "hasselblad", "pentax", "samsung", "apple", "google pixel", "huawei", "xiaomi", "oppo", "oneplus", "vivo", "realme", "motorola", "nokia", "dji", "gopro", "ricoh", "sigma", "phase one", "red", "blackmagic", "arri"];
const MAX_PROCESS_DIMENSION = 1024;
const BASIC_FILE_INFO_KEYS = ["File Name", "File Size", "MIME Type", "Last Modified", "Format"];

// ============ SIGNAL FUNCTIONS (ported from TypeScript) ============

function analyzeMetadata(fileName, fileSize) {
    let score = 50;
    const fn = fileName.toLowerCase();
    for (const sig of AI_SOFTWARE_SIGNATURES) {
        if (fn.includes(sig)) { score = 95; break; }
    }
    if (score === 50) {
        for (const cam of REAL_CAMERA_SIGNATURES) {
            if (fn.includes(cam)) { score = 10; break; }
        }
    }
    return { name: "Metadata Analysis", score, weight: 1.5 };
}

function analyzeSpectralNyquist(pixels, width, height) {
    const size = Math.min(64, Math.min(width, height));
    const offsetX = Math.floor((width - size) / 2);
    const offsetY = Math.floor((height - size) / 2);
    const gray = new Float64Array(size * size);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const idx = ((offsetY + y) * width + (offsetX + x)) * 4;
            gray[y * size + x] = pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;
        }
    }
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
    for (let k = 0; k <= halfSize; k++) freqPower[k] /= rowCount;
    const logPower = new Float64Array(halfSize + 1);
    for (let k = 0; k <= halfSize; k++) logPower[k] = Math.log10(freqPower[k] + 1);
    const nyquist = logPower[halfSize];
    const near1 = halfSize > 1 ? logPower[halfSize - 1] : nyquist;
    const near2 = halfSize > 2 ? logPower[halfSize - 2] : near1;
    const near3 = halfSize > 3 ? logPower[halfSize - 3] : near2;
    const nearAvg = (near1 + near2 + near3) / 3;
    const peakRatio = nearAvg > 0 ? nyquist / nearAvg : 1.0;
    const quarter = Math.floor(halfSize / 2);
    const quarterPower = logPower[quarter];
    const quarterNear = (logPower[Math.max(0, quarter - 1)] + logPower[Math.min(halfSize, quarter + 1)]) / 2;
    const quarterRatio = quarterNear > 0 ? quarterPower / quarterNear : 1.0;
    const lowFreq = (logPower[1] + logPower[2] + logPower[3]) / 3;
    const highFreq = (logPower[halfSize - 3] + logPower[halfSize - 2] + logPower[halfSize - 1]) / 3;
    const rolloffRatio = lowFreq > 0 ? highFreq / lowFreq : 0;
    let score = 50;
    if (peakRatio > 1.5) score += 20; else if (peakRatio > 1.2) score += 10; else if (peakRatio < 0.9) score -= 15;
    if (quarterRatio > 1.3) score += 10;
    if (rolloffRatio > 0.5) score += 15; else if (rolloffRatio > 0.3) score += 5; else if (rolloffRatio < 0.15) score -= 15; else if (rolloffRatio < 0.2) score -= 5;
    const isPow2OrStd = (d) => (d & (d - 1)) === 0 || [512, 768, 1024, 1536, 2048, 4096].includes(d);
    const likelyResized = !isPow2OrStd(width) && !isPow2OrStd(height) && (width % 100 !== 0 || height % 100 !== 0);
    if (likelyResized && score > 50) score = Math.round(50 + (score - 50) * 0.3);
    score = Math.max(10, Math.min(90, score));
    return { name: "Spectral Nyquist", score, weight: 3.0 };
}

function analyzeNoiseResidual(pixels, width, height) {
    const blockSize = 32;
    const blocksX = Math.floor(width / blockSize), blocksY = Math.floor(height / blockSize);
    const blockStdDevs = [], blockBrightness = [], blockKurtosis = [];
    const step = Math.max(1, Math.floor(blocksX * blocksY / 300));
    for (let by = 0; by < blocksY; by += step) {
        for (let bx = 0; bx < blocksX; bx += step) {
            let sumR = 0, sumR2 = 0, sumR4 = 0, sumB = 0, count = 0;
            for (let y = by * blockSize + 1; y < (by + 1) * blockSize - 1; y++) {
                for (let x = bx * blockSize + 1; x < (bx + 1) * blockSize - 1; x++) {
                    const getGray = (px, py) => { const i = (py * width + px) * 4; return pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114; };
                    const center = getGray(x, y);
                    const lap = 4 * center - getGray(x - 1, y) - getGray(x + 1, y) - getGray(x, y - 1) - getGray(x, y + 1);
                    sumR += lap; sumR2 += lap * lap; sumR4 += lap ** 4; sumB += center; count++;
                }
            }
            if (count > 0) {
                const mean = sumR / count, variance = sumR2 / count - mean * mean;
                blockStdDevs.push(Math.sqrt(Math.max(0, variance)));
                blockBrightness.push(sumB / count);
                const m4 = sumR4 / count - 4 * mean * (sumR2 * sumR / (count * count)) + 6 * mean * mean * (sumR2 / count) - 3 * mean ** 4;
                blockKurtosis.push(variance > 0.01 ? m4 / (variance * variance) : 3);
            }
        }
    }
    if (blockStdDevs.length < 4) return { name: "Noise Residual", score: 50, weight: 3.5 };
    const mean = blockStdDevs.reduce((a, b) => a + b, 0) / blockStdDevs.length;
    const variance = blockStdDevs.reduce((a, b) => a + (b - mean) ** 2, 0) / blockStdDevs.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;
    const meanBright = blockBrightness.reduce((a, b) => a + b, 0) / blockBrightness.length;
    let covBN = 0, varB = 0, varN = 0;
    for (let i = 0; i < blockStdDevs.length; i++) {
        const db = blockBrightness[i] - meanBright, dn = blockStdDevs[i] - mean;
        covBN += db * dn; varB += db * db; varN += dn * dn;
    }
    const shotCorrelation = (varB > 0 && varN > 0) ? covBN / Math.sqrt(varB * varN) : 0;
    const noiseLevel = mean;
    const meanKurt = blockKurtosis.reduce((a, b) => a + b, 0) / blockKurtosis.length;
    const kurtDeviation = Math.abs(meanKurt - 3);
    let score = 50;
    if (shotCorrelation > 0.45) score -= 18; else if (shotCorrelation > 0.3) score -= 12; else if (shotCorrelation > 0.15) score -= 6; else if (shotCorrelation < -0.15) score += 15; else if (shotCorrelation < 0) score += 8; else score += 5;
    if (cv < 0.12) score += 22; else if (cv < 0.2) score += 14; else if (cv < 0.3) score += 6; else if (cv > 0.8) score -= 14; else if (cv > 0.5) score -= 8;
    if (noiseLevel < 1.2) score += 10; else if (noiseLevel < 2.0) score += 5; else if (noiseLevel > 7.0) score -= 10; else if (noiseLevel > 5.0) score -= 5;
    if (kurtDeviation > 3.0) score += 8; else if (kurtDeviation > 1.5) score += 4; else if (kurtDeviation < 0.5) score -= 4;
    return { name: "Noise Residual", score: Math.max(5, Math.min(95, score)), weight: 3.5 };
}

function analyzeEdgeCoherence(pixels, width, height) {
    const edgeMagnitudes = [], edgeDirections = [];
    const step = Math.max(1, Math.floor(Math.min(width, height) / 300));
    for (let y = 1; y < height - 1; y += step) {
        for (let x = 1; x < width - 1; x += step) {
            const getGray = (px, py) => { const i = (py * width + px) * 4; return pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114; };
            const gx = -getGray(x - 1, y - 1) - 2 * getGray(x - 1, y) - getGray(x - 1, y + 1) + getGray(x + 1, y - 1) + 2 * getGray(x + 1, y) + getGray(x + 1, y + 1);
            const gy = -getGray(x - 1, y - 1) - 2 * getGray(x, y - 1) - getGray(x + 1, y - 1) + getGray(x - 1, y + 1) + 2 * getGray(x, y + 1) + getGray(x + 1, y + 1);
            const mag = Math.sqrt(gx * gx + gy * gy);
            edgeMagnitudes.push(mag);
            if (mag > 5) edgeDirections.push(Math.atan2(gy, gx));
        }
    }
    const sorted = [...edgeMagnitudes].sort((a, b) => a - b);
    const p10 = sorted[Math.floor(sorted.length * 0.1)];
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p90 = sorted[Math.floor(sorted.length * 0.9)];
    const edgeRange = p90 - p10;
    const dirBins = new Float64Array(36);
    for (const dir of edgeDirections) { const bin = Math.floor(((dir + Math.PI) / (2 * Math.PI)) * 36) % 36; dirBins[bin]++; }
    let dirEntropy = 0; const totalEdges = edgeDirections.length;
    for (let i = 0; i < 36; i++) { if (dirBins[i] > 0) { const p = dirBins[i] / totalEdges; dirEntropy -= p * Math.log2(p); } }
    const normalizedEntropy = dirEntropy / Math.log2(36);
    const sharpnessRatio = p50 > 0 ? p90 / p50 : 1;
    let score = 50;
    if (p50 < 4 && edgeRange < 25) score += 28; else if (p50 < 6) score += 18; else if (p50 < 10) score += 8; else if (p50 > 25) score -= 20; else if (p50 > 18) score -= 10;
    if (sharpnessRatio < 2.5) score += 12; else if (sharpnessRatio < 4) score += 5; else if (sharpnessRatio > 10) score -= 12; else if (sharpnessRatio > 7) score -= 5;
    if (normalizedEntropy > 0.92) score += 10; else if (normalizedEntropy > 0.85) score += 4; else if (normalizedEntropy < 0.6) score -= 12; else if (normalizedEntropy < 0.7) score -= 5;
    return { name: "Edge Coherence", score: Math.max(5, Math.min(95, score)), weight: 1.5 };
}

function analyzeGradientMicroTexture(pixels, width, height) {
    const blockSize = 32; const blocksX = Math.floor(width / blockSize), blocksY = Math.floor(height / blockSize);
    let smoothBlockCount = 0, totalBlockCount = 0, microRatioSum = 0;
    const step = Math.max(1, Math.floor(blocksX * blocksY / 200));
    for (let by = 0; by < blocksY; by += step) {
        for (let bx = 0; bx < blocksX; bx += step) {
            let gradSum = 0, microNoise = 0, count = 0;
            for (let y = by * blockSize; y < (by + 1) * blockSize - 1; y++) {
                for (let x = bx * blockSize; x < (bx + 1) * blockSize - 2; x++) {
                    const idx = (y * width + x) * 4, idxR = (y * width + x + 1) * 4, idxR2 = (y * width + x + 2) * 4;
                    const g0 = pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;
                    const g1 = pixels[idxR] * 0.299 + pixels[idxR + 1] * 0.587 + pixels[idxR + 2] * 0.114;
                    const g2 = pixels[idxR2] * 0.299 + pixels[idxR2 + 1] * 0.587 + pixels[idxR2 + 2] * 0.114;
                    gradSum += Math.abs(g1 - g0); microNoise += Math.abs(2 * g1 - g0 - g2); count++;
                }
            }
            totalBlockCount++;
            const avgGrad = count > 0 ? gradSum / count : 0, avgMicro = count > 0 ? microNoise / count : 0;
            if (avgGrad < 5 && count > 0) { smoothBlockCount++; microRatioSum += avgGrad > 0.5 ? avgMicro / avgGrad : avgMicro; }
        }
    }
    const smoothFraction = totalBlockCount > 0 ? smoothBlockCount / totalBlockCount : 0;
    const avgMicroRatio = smoothBlockCount > 0 ? microRatioSum / smoothBlockCount : 0;
    let score = 50;
    if (smoothFraction > 0.6) score += 20; else if (smoothFraction > 0.45) score += 12; else if (smoothFraction > 0.3) score += 5; else if (smoothFraction < 0.08) score -= 15; else if (smoothFraction < 0.15) score -= 8;
    if (avgMicroRatio < 0.3) score += 20; else if (avgMicroRatio < 0.6) score += 12; else if (avgMicroRatio < 1.0) score += 3; else if (avgMicroRatio > 2.5) score -= 18; else if (avgMicroRatio > 1.8) score -= 10;
    return { name: "Gradient Micro-Texture", score: Math.max(5, Math.min(95, score)), weight: 1.5 };
}

function analyzeBenfordsLaw(pixels, width, height) {
    const benford = [0, 0.301, 0.176, 0.125, 0.097, 0.079, 0.067, 0.058, 0.051, 0.046];
    const digitCount = new Array(10).fill(0); let totalDigits = 0;
    const step = Math.max(1, Math.floor(Math.min(width, height) / 400));
    for (let y = 0; y < height - 1; y += step) {
        for (let x = 0; x < width - 1; x += step) {
            const idx = (y * width + x) * 4, idxR = (y * width + x + 1) * 4, idxD = ((y + 1) * width + x) * 4;
            const mag = Math.abs(pixels[idx] - pixels[idxR]) + Math.abs(pixels[idx + 1] - pixels[idxR + 1]) + Math.abs(pixels[idx + 2] - pixels[idxR + 2]) + Math.abs(pixels[idx] - pixels[idxD]) + Math.abs(pixels[idx + 1] - pixels[idxD + 1]) + Math.abs(pixels[idx + 2] - pixels[idxD + 2]);
            if (mag > 0) { const fd = parseInt(String(mag).charAt(0)); if (fd >= 1 && fd <= 9) { digitCount[fd]++; totalDigits++; } }
        }
    }
    let chiSquared = 0;
    if (totalDigits > 0) { for (let d = 1; d <= 9; d++) { const obs = digitCount[d] / totalDigits; chiSquared += ((obs - benford[d]) ** 2) / benford[d]; } }
    let score; if (chiSquared < 0.01) score = 22; else if (chiSquared < 0.03) score = 35; else if (chiSquared < 0.08) score = 48; else if (chiSquared < 0.15) score = 65; else score = 78;
    return { name: "Benford's Law", score, weight: 0.3 };
}

function analyzeChromaticAberration(pixels, width, height) {
    const borderWidth = Math.max(20, Math.floor(Math.min(width, height) * 0.05));
    let totalShift = 0, shiftCount = 0;
    const step = Math.max(2, Math.floor(borderWidth / 10));
    const checkShift = (x, y) => {
        if (x < 1 || x >= width - 1 || y < 1 || y >= height - 1) return;
        const idx = (y * width + x) * 4, idxR = (y * width + x + 1) * 4;
        totalShift += Math.abs(Math.abs(pixels[idx] - pixels[idxR]) - Math.abs(pixels[idx + 2] - pixels[idxR + 2]));
        shiftCount++;
    };
    for (let x = 0; x < width; x += step) { for (let y = 0; y < borderWidth; y += step) checkShift(x, y); for (let y = height - borderWidth; y < height; y += step) checkShift(x, y); }
    for (let y = 0; y < height; y += step) { for (let x = 0; x < borderWidth; x += step) checkShift(x, y); for (let x = width - borderWidth; x < width; x += step) checkShift(x, y); }
    const avgShift = shiftCount > 0 ? totalShift / shiftCount : 0;
    let score; if (avgShift < 0.5) score = 82; else if (avgShift < 1.0) score = 68; else if (avgShift < 2.0) score = 52; else if (avgShift < 4.0) score = 35; else if (avgShift < 7.0) score = 20; else score = 10;
    return { name: "Chromatic Aberration", score, weight: 0.5 };
}

function analyzeTextureConsistency(pixels, width, height) {
    const regionSize = Math.min(64, Math.floor(Math.min(width, height) / 4));
    const positions = [[0, 0], [width - regionSize, 0], [0, height - regionSize], [width - regionSize, height - regionSize], [Math.floor(width / 2 - regionSize / 2), Math.floor(height / 2 - regionSize / 2)]];
    const regions = [];
    for (const [sx, sy] of positions) {
        let localVar = 0, count = 0;
        for (let y = sy; y < sy + regionSize - 1; y++) {
            for (let x = sx; x < sx + regionSize - 1; x++) {
                const idx = (y * width + x) * 4, idxN = (y * width + x + 1) * 4;
                localVar += Math.abs(pixels[idx] - pixels[idxN]) + Math.abs(pixels[idx + 1] - pixels[idxN + 1]) + Math.abs(pixels[idx + 2] - pixels[idxN + 2]);
                count++;
            }
        }
        regions.push(count > 0 ? localVar / count : 0);
    }
    const avg = regions.reduce((a, b) => a + b, 0) / regions.length;
    const regionVar = regions.reduce((a, b) => a + (b - avg) ** 2, 0) / regions.length;
    const regionCV = avg > 0 ? Math.sqrt(regionVar) / avg : 0;
    let score; if (regionCV < 0.10) score = 85; else if (regionCV < 0.18) score = 72; else if (regionCV < 0.30) score = 58; else if (regionCV < 0.45) score = 42; else if (regionCV < 0.65) score = 28; else score = 12;
    return { name: "Texture Consistency", score, weight: 1.0 };
}

function analyzeCFAPattern(pixels, width, height) {
    let periodicEnergy = 0, totalEnergy = 0, count = 0;
    const step = Math.max(2, Math.floor(Math.min(width, height) / 300));
    for (let y = 2; y < height - 2; y += step) {
        for (let x = 2; x < width - 2; x += step) {
            const getG = (px, py) => pixels[(py * width + px) * 4 + 1];
            const center = getG(x, y), right = getG(x + 1, y), down = getG(x, y + 1), diag = getG(x + 1, y + 1), right2 = getG(x + 2, y), down2 = getG(x, y + 2);
            periodicEnergy += Math.abs((center - right) - (down - diag));
            totalEnergy += Math.abs(center - right2) + Math.abs(center - down2) + 1;
            count++;
        }
    }
    const cfaRatio = count > 0 && totalEnergy > 0 ? periodicEnergy / totalEnergy : 0;
    let score; if (cfaRatio < 0.08) score = 85; else if (cfaRatio < 0.15) score = 70; else if (cfaRatio < 0.25) score = 55; else if (cfaRatio < 0.38) score = 38; else if (cfaRatio < 0.52) score = 22; else score = 10;
    return { name: "CFA Pattern", score, weight: 1.0 };
}

function analyzeDCTBlockArtifacts(pixels, width, height) {
    const blockSize = 8, blocksX = Math.floor(width / blockSize), blocksY = Math.floor(height / blockSize);
    if (blocksX < 3 || blocksY < 3) return { name: "DCT Block", score: 50, weight: 1.5 };
    let boundaryEnergy = 0, interiorEnergy = 0, boundaryCount = 0, interiorCount = 0;
    const step = Math.max(1, Math.floor(Math.min(blocksX, blocksY) / 60));
    const getGray = (px, py) => { const i = (py * width + px) * 4; return pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114; };
    for (let by = 1; by < blocksY - 1; by += step) {
        const boundaryY = by * blockSize;
        for (let x = 1; x < width - 1; x += 2) {
            const ab = getGray(x, boundaryY - 1), at = getGray(x, boundaryY), bl = getGray(x, boundaryY + 1);
            boundaryEnergy += Math.abs(at - ab) + Math.abs(at - bl); boundaryCount++;
            const mid = by * blockSize + 4;
            if (mid > 0 && mid < height - 1) { interiorEnergy += Math.abs(getGray(x, mid) - getGray(x, mid - 1)) + Math.abs(getGray(x, mid) - getGray(x, mid + 1)); interiorCount++; }
        }
    }
    for (let bx = 1; bx < blocksX - 1; bx += step) {
        const boundaryX = bx * blockSize;
        for (let y = 1; y < height - 1; y += 2) {
            const lb = getGray(boundaryX - 1, y), at = getGray(boundaryX, y), rb = getGray(boundaryX + 1, y);
            boundaryEnergy += Math.abs(at - lb) + Math.abs(at - rb); boundaryCount++;
            const mid = bx * blockSize + 4;
            if (mid > 0 && mid < width - 1) { interiorEnergy += Math.abs(getGray(mid, y) - getGray(mid - 1, y)) + Math.abs(getGray(mid, y) - getGray(mid + 1, y)); interiorCount++; }
        }
    }
    const avgBoundary = boundaryCount > 0 ? boundaryEnergy / boundaryCount : 0;
    const avgInterior = interiorCount > 0 ? interiorEnergy / interiorCount : 0;
    const blockRatio = avgInterior > 0.1 ? avgBoundary / avgInterior : (avgBoundary > 0.5 ? 2.0 : 1.0);
    // Region CV
    const regionBlockRatios = [];
    const regionSize = Math.floor(Math.min(blocksX, blocksY) / 3);
    if (regionSize >= 2) {
        const positions = [[0, 0], [blocksX - regionSize, 0], [0, blocksY - regionSize], [blocksX - regionSize, blocksY - regionSize], [Math.floor(blocksX / 2 - regionSize / 2), Math.floor(blocksY / 2 - regionSize / 2)]];
        for (const [sx, sy] of positions) {
            let regBound = 0, regInter = 0, regCount = 0;
            for (let by = sy; by < Math.min(sy + regionSize, blocksY - 1); by++) {
                const bndY = (by + 1) * blockSize, midY = by * blockSize + 4;
                if (bndY >= height - 1 || midY >= height - 1) continue;
                for (let bx = sx; bx < Math.min(sx + regionSize, blocksX - 1); bx++) {
                    const midX = bx * blockSize + 4;
                    if (midX >= width - 1) continue;
                    regBound += Math.abs(getGray(midX, bndY) - getGray(midX, bndY - 1));
                    regInter += Math.abs(getGray(midX, midY) - getGray(midX, midY - 1));
                    regCount++;
                }
            }
            if (regCount > 0 && regInter > 0) regionBlockRatios.push((regBound / regCount) / Math.max(0.1, regInter / regCount));
        }
    }
    let regionCV = 0;
    if (regionBlockRatios.length >= 3) {
        const avg = regionBlockRatios.reduce((a, b) => a + b, 0) / regionBlockRatios.length;
        const v = regionBlockRatios.reduce((a, b) => a + (b - avg) ** 2, 0) / regionBlockRatios.length;
        regionCV = avg > 0 ? Math.sqrt(v) / avg : 0;
    }
    let score = 50;
    if (blockRatio < 0.95) score += 20; else if (blockRatio > 1.3) score -= 20; else if (blockRatio > 1.1) score -= 10;
    if (regionCV < 0.08) score += 15; else if (regionCV < 0.15) score += 5; else if (regionCV > 0.4) score -= 15; else if (regionCV > 0.25) score -= 8;
    return { name: "DCT Block", score: Math.max(10, Math.min(90, score)), weight: 1.5 };
}

function analyzeColorChannelCorrelation(pixels, width, height) {
    const totalPixels = width * height, sampleStep = Math.max(1, Math.floor(totalPixels / 50000));
    let sumR = 0, sumG = 0, sumB = 0, sumRR = 0, sumGG = 0, sumBB = 0, sumRG = 0, sumGB = 0, sumRB = 0, count = 0;
    const histR = new Float64Array(32), histG = new Float64Array(32), histB = new Float64Array(32);
    for (let i = 0; i < totalPixels * 4; i += sampleStep * 4) {
        const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
        sumR += r; sumG += g; sumB += b; sumRR += r * r; sumGG += g * g; sumBB += b * b; sumRG += r * g; sumGB += g * b; sumRB += r * b; count++;
        histR[Math.floor(r / 8)]++; histG[Math.floor(g / 8)]++; histB[Math.floor(b / 8)]++;
    }
    if (count < 100) return { name: "Color Correlation", score: 50, weight: 2.0 };
    const mR = sumR / count, mG = sumG / count, mB = sumB / count;
    const vR = sumRR / count - mR * mR, vG = sumGG / count - mG * mG, vB = sumBB / count - mB * mB;
    const corrRG = (vR > 0 && vG > 0) ? (sumRG / count - mR * mG) / Math.sqrt(vR * vG) : 0;
    const corrGB = (vG > 0 && vB > 0) ? (sumGB / count - mG * mB) / Math.sqrt(vG * vB) : 0;
    const corrRB = (vR > 0 && vB > 0) ? (sumRB / count - mR * mB) / Math.sqrt(vR * vB) : 0;
    const avgCorr = (corrRG + corrGB + corrRB) / 3;
    const corrSpread = Math.max(corrRG, corrGB, corrRB) - Math.min(corrRG, corrGB, corrRB);
    const calcEntropy = (hist) => { let e = 0; const t = hist.reduce((a, b) => a + b, 0); if (t === 0) return 0; for (let i = 0; i < hist.length; i++) { if (hist[i] > 0) { const p = hist[i] / t; e -= p * Math.log2(p); } } return e; };
    const avgEntropy = (calcEntropy(histR) + calcEntropy(histG) + calcEntropy(histB)) / 3;
    const normalizedEntropy = avgEntropy / Math.log2(32);
    const entropySpread = Math.max(calcEntropy(histR), calcEntropy(histG), calcEntropy(histB)) - Math.min(calcEntropy(histR), calcEntropy(histG), calcEntropy(histB));
    let noiseRG = 0, noiseCnt = 0;
    const noiseStep = Math.max(2, Math.floor(Math.min(width, height) / 200));
    for (let y = 1; y < height - 1; y += noiseStep) { for (let x = 1; x < width - 1; x += noiseStep) { const idx = (y * width + x) * 4, idxL = (y * width + x - 1) * 4, idxR2 = (y * width + x + 1) * 4, idxU = ((y - 1) * width + x) * 4, idxD = ((y + 1) * width + x) * 4; const nR = 4 * pixels[idx] - pixels[idxL] - pixels[idxR2] - pixels[idxU] - pixels[idxD]; const nG = 4 * pixels[idx + 1] - pixels[idxL + 1] - pixels[idxR2 + 1] - pixels[idxU + 1] - pixels[idxD + 1]; noiseRG += nR * nG; noiseCnt++; } }
    const normalizedNoiseCorr = noiseCnt > 0 ? Math.abs(noiseRG / noiseCnt) / 100 : 0;
    let score = 50;
    if (avgCorr > 0.995) score += 10; else if (avgCorr > 0.92 && avgCorr < 0.99) score -= 12; else if (avgCorr < 0.75) score += 15; else if (avgCorr < 0.85) score += 8;
    if (corrSpread > 0.15) score -= 5; else if (corrSpread < 0.03) score += 8;
    if (normalizedEntropy > 0.85) score -= 8; else if (normalizedEntropy < 0.5) score += 10;
    if (entropySpread < 0.1) score += 5; else if (entropySpread > 0.5) score -= 5;
    if (normalizedNoiseCorr > 2.0) score -= 15; else if (normalizedNoiseCorr > 0.5) score -= 8; else if (normalizedNoiseCorr < 0.1) score += 12;
    return { name: "Color Correlation", score: Math.max(10, Math.min(90, score)), weight: 2.0 };
}

function analyzePRNUPattern(pixels, width, height) {
    const kernelRadius = 2, noiseStep = Math.max(1, Math.floor(Math.min(width, height) / 250));
    const residuals = [], positions = [];
    for (let y = kernelRadius; y < height - kernelRadius; y += noiseStep) { for (let x = kernelRadius; x < width - kernelRadius; x += noiseStep) { const idx = (y * width + x) * 4; const center = pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114; let sum = 0, cnt = 0; for (let dy = -kernelRadius; dy <= kernelRadius; dy++) { for (let dx = -kernelRadius; dx <= kernelRadius; dx++) { if (dx === 0 && dy === 0) continue; const ni = ((y + dy) * width + (x + dx)) * 4; sum += pixels[ni] * 0.299 + pixels[ni + 1] * 0.587 + pixels[ni + 2] * 0.114; cnt++; } } residuals.push(center - sum / cnt); positions.push([x, y]); } }
    if (residuals.length < 200) return { name: "PRNU Pattern", score: 50, weight: 1.5 };
    const cols = Math.floor((width - 2 * kernelRadius) / noiseStep);
    let autoCorr = 0, autoCorrCount = 0;
    for (let i = 0; i < residuals.length - 1; i++) { const [x1, y1] = positions[i], [x2, y2] = positions[i + 1]; if (y1 === y2 && Math.abs(x2 - x1) <= noiseStep * 2) { autoCorr += residuals[i] * residuals[i + 1]; autoCorrCount++; } }
    let autoCorrV = 0, autoCorrVCount = 0;
    if (cols > 0) { for (let i = 0; i < residuals.length - cols; i++) { const [x1, y1] = positions[i], [x2, y2] = positions[i + cols]; if (x1 === x2 && Math.abs(y2 - y1) <= noiseStep * 2) { autoCorrV += residuals[i] * residuals[i + cols]; autoCorrVCount++; } } }
    const meanR = residuals.reduce((a, b) => a + b, 0) / residuals.length;
    const varR = residuals.reduce((a, b) => a + (b - meanR) ** 2, 0) / residuals.length;
    const stdR = Math.sqrt(Math.max(0, varR));
    const nAutoCorr = (autoCorrCount > 0 && varR > 0) ? (autoCorr / autoCorrCount) / varR : 0;
    const nAutoCorrV = (autoCorrVCount > 0 && varR > 0) ? (autoCorrV / autoCorrVCount) / varR : 0;
    const quads = [{ r: [] }, { r: [] }, { r: [] }, { r: [] }];
    const midX = width / 2, midY = height / 2;
    for (let i = 0; i < positions.length; i++) { const [x, y] = positions[i]; quads[(x < midX ? 0 : 1) + (y < midY ? 0 : 2)].r.push(residuals[i]); }
    const stds = quads.map(q => { if (q.r.length < 10) return 0; const m = q.r.reduce((a, b) => a + b, 0) / q.r.length; return Math.sqrt(Math.max(0, q.r.reduce((a, b) => a + (b - m) ** 2, 0) / q.r.length)); }).filter(s => s > 0);
    const avgStd = stds.length > 0 ? stds.reduce((a, b) => a + b, 0) / stds.length : 0;
    const stdCV = avgStd > 0 ? Math.sqrt(stds.reduce((a, b) => a + (b - avgStd) ** 2, 0) / stds.length) / avgStd : 0;
    let score = 50;
    const avgAutoCorr = (nAutoCorr + nAutoCorrV) / 2;
    if (avgAutoCorr > 0.3) score -= 25; else if (avgAutoCorr > 0.15) score -= 15; else if (avgAutoCorr > 0.05) score -= 5; else if (avgAutoCorr < -0.05) score += 15; else score += 10;
    if (stdCV < 0.1) score -= 10; else if (stdCV > 0.5) score += 12; else if (stdCV > 0.3) score += 5;
    if (stdR < 0.5) score += 15; else if (stdR < 1.0) score += 5; else if (stdR > 4.0) score -= 8;
    return { name: "PRNU Pattern", score: Math.max(10, Math.min(90, score)), weight: 1.5 };
}

// ============ VERDICT ENGINE (exact copy from analyzer.ts) ============

function calculateVerdict(signals) {
    let totalWeight = 0, weightedSum = 0;
    for (const s of signals) { totalWeight += s.weight; weightedSum += s.score * s.weight; }
    let aiScore = Math.round(totalWeight > 0 ? weightedSum / totalWeight : 50);
    let aiLeaningWeight = 0, realLeaningWeight = 0, strongAI = 0, strongReal = 0, veryStrongAI = 0, veryStrongReal = 0;
    for (const s of signals) {
        if (s.score > 50) aiLeaningWeight += s.weight;
        if (s.score < 50) realLeaningWeight += s.weight;
        if (s.score >= 65) strongAI++;
        if (s.score <= 35) strongReal++;
        if (s.score >= 78) veryStrongAI++;
        if (s.score <= 22) veryStrongReal++;
    }
    let adjustment = 0;
    // Consensus amplification (restored from v4)
    if (veryStrongAI >= 3) adjustment += 14;
    else if (strongAI >= 5) adjustment += 12;
    else if (strongAI >= 3) adjustment += 8;
    else if (strongAI >= 2) adjustment += 5;
    else if (strongAI >= 1) adjustment += 2;

    if (veryStrongReal >= 3) adjustment -= 14;
    else if (strongReal >= 5) adjustment -= 12;
    else if (strongReal >= 3) adjustment -= 8;
    else if (strongReal >= 2) adjustment -= 5;
    else if (strongReal >= 1) adjustment -= 2;

    // Weighted majority (restored from v4)
    const weightRatio = totalWeight > 0 ? (aiLeaningWeight - realLeaningWeight) / totalWeight : 0;
    adjustment += Math.round(weightRatio * 14);

    // Directional amplification (restored from v4)
    const deviation = aiScore - 50;
    if (Math.abs(deviation) > 1) {
        const linear = deviation * 1.1;
        const quadratic = Math.sign(deviation) * (deviation * deviation) * 0.025;
        adjustment += Math.round(linear + quadratic);
    }

    // Metadata override
    const metaSig = signals.find(s => s.name === "Metadata Analysis");
    if (metaSig) { if (metaSig.score >= 90) adjustment += 25; else if (metaSig.score <= 15) adjustment -= 25; }

    // Anti-FP guard (stronger)
    let heavyReal = 0, heavyAI = 0;
    for (const s of signals) { if (s.weight >= 3.0) { if (s.score < 40) heavyReal++; if (s.score > 60) heavyAI++; } }
    if (heavyReal >= 2 && heavyAI === 0 && aiScore + adjustment > 50) adjustment -= 5;

    aiScore = Math.round(Math.max(3, Math.min(97, aiScore + adjustment)));

    // Threshold 55
    let verdict, confidence;
    if (aiScore >= 55) { verdict = "ai"; confidence = Math.min(100, Math.round(50 + (aiScore - 55) * 1.1)); }
    else if (aiScore <= 40) { verdict = "real"; confidence = Math.min(100, Math.round(50 + (40 - aiScore) * 1.3)); }
    else { verdict = "uncertain"; confidence = Math.round(100 - Math.abs(aiScore - 47) * 6); }
    return { aiScore, verdict, confidence };
}



async function analyze(fp) {
    const img = await loadImage(fp);
    let w = img.width, h = img.height;
    if (w > MAX || h > MAX) { const s = MAX / Math.max(w,h); w = Math.round(w*s); h = Math.round(h*s); }
    const c = createCanvas(w,h), ctx = c.getContext('2d');
    ctx.drawImage(img,0,0,w,h);
    const px = ctx.getImageData(0,0,w,h).data;
    const fn = path.basename(fp);
    return [
        analyzeMetadata(fn, 0),
        analyzeSpectralNyquist(px, w, h),
        analyzeNoiseResidual(px, w, h),
        analyzeEdgeCoherence(px, w, h),
        analyzeGradientMicroTexture(px, w, h),
        analyzeBenfordsLaw(px, w, h),
        analyzeChromaticAberration(px, w, h),
        analyzeTextureConsistency(px, w, h),
        analyzeCFAPattern(px, w, h),
        analyzeDCTBlockArtifacts(px, w, h),
        analyzeColorChannelCorrelation(px, w, h),
        analyzePRNUPattern(px, w, h),
    ];
}

async function run() {
    const dir = path.join(__dirname, '..', 'public', 'benchmark');
    const aiFiles = ['ai_face_001.jpg','ai_face_050.jpg','ai_face_100.jpg','ai_face_200.jpg','ai_face_500.jpg'];
    const realFiles = ['real_photo_001.jpg','real_photo_050.jpg','real_photo_100.jpg','real_photo_200.jpg','real_photo_500.jpg'];
    
    console.log('\n=== AI IMAGE SIGNALS ===');
    for (const f of aiFiles) {
        const signals = await analyze(path.join(dir, f));
        const v = calculateVerdict(signals);
        console.log('\n' + f + ' => score=' + v.aiScore + ' verdict=' + v.verdict);
        for (const s of signals) console.log('  ' + s.name.padEnd(25) + ' score=' + String(s.score).padStart(3) + ' weight=' + s.weight);
    }
    
    console.log('\n=== REAL IMAGE SIGNALS ===');
    for (const f of realFiles) {
        const signals = await analyze(path.join(dir, f));
        const v = calculateVerdict(signals);
        console.log('\n' + f + ' => score=' + v.aiScore + ' verdict=' + v.verdict);
        for (const s of signals) console.log('  ' + s.name.padEnd(25) + ' score=' + String(s.score).padStart(3) + ' weight=' + s.weight);
    }
}
run().catch(e => console.error(e));
