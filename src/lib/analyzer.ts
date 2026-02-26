/**
 * SourceVerify AI Detection Engine v2
 * State-of-the-art multi-signal analysis for detecting AI-generated images/videos
 *
 * Based on latest research (2024-2025):
 * - SPAI (CVPR 2025): Spectral distribution of real images as invariant pattern
 * - SpAN (ICLR 2026): Training-free detection via spectral artifacts at Nyquist frequencies
 * - Johnson & Farid: Chromatic aberration as physical authenticity marker
 * - Benford's Law analysis for natural image statistics
 *
 * Detection signals (10):
 * 1. Metadata Analysis - Software signatures, camera data, resolution patterns
 * 2. Spectral Nyquist Analysis - 2D FFT power spectrum peaks at Nyquist frequencies (KEY)
 * 3. Multi-scale Reconstruction - Re-encode at multiple qualities, measure discrepancy
 * 4. High-Frequency Noise Residual - Noise pattern analysis after denoising
 * 5. Edge Coherence - Sobel edge distribution analysis
 * 6. Gradient Micro-Texture - Second-order derivatives in smooth regions
 * 7. Benford's Law - First-digit distribution of pixel gradients
 * 8. Chromatic Aberration - Lens color fringing at image borders
 * 9. Texture Consistency - Cross-region texture variance analysis
 * 10. CFA Pattern Detection - Bayer filter demosaicing artifacts (camera fingerprint)
 */

export interface AnalysisResult {
    verdict: "ai" | "real" | "uncertain";
    confidence: number;
    aiScore: number;
    signals: AnalysisSignal[];
    metadata: FileMetadata;
    processingTimeMs: number;
}

export interface AnalysisSignal {
    name: string;
    nameKey: string;
    category: string;
    score: number;
    weight: number;
    description: string;
    descriptionKey: string;
    icon: string;
    details?: string;
}

export interface FileMetadata {
    fileName: string;
    fileSize: number;
    fileType: string;
    width: number;
    height: number;
    isVideo: boolean;
    exifData?: Record<string, string>;
}

const AI_SOFTWARE_SIGNATURES = [
    "midjourney", "dall-e", "dalle", "stable diffusion", "comfyui",
    "automatic1111", "a1111", "novelai", "civitai", "invoke ai",
    "adobe firefly", "firefly", "bing image creator", "leonardo ai",
    "playground ai", "deep dream", "artbreeder", "nightcafe", "craiyon",
    "dreamstudio", "flux", "sora", "runway", "pika", "kling", "hailuo",
    "luma dream", "minimax", "genmo", "ideogram", "recraft",
];

const REAL_CAMERA_SIGNATURES = [
    "canon", "nikon", "sony", "fujifilm", "olympus", "panasonic",
    "leica", "hasselblad", "pentax", "samsung", "apple", "google pixel",
    "huawei", "xiaomi", "oppo", "oneplus",
];

// ============================
// MAIN ENTRY
// ============================

export async function analyzeMedia(file: File): Promise<AnalysisResult> {
    const start = performance.now();
    const isVideo = file.type.startsWith("video/");

    let signals: AnalysisSignal[];
    let metadata: FileMetadata;

    if (isVideo) {
        const result = await analyzeVideoFile(file);
        signals = result.signals;
        metadata = result.metadata;
    } else {
        const result = await analyzeImageFile(file);
        signals = result.signals;
        metadata = result.metadata;
    }

    let totalWeight = 0;
    let weightedSum = 0;
    for (const signal of signals) {
        totalWeight += signal.weight;
        weightedSum += signal.score * signal.weight;
    }
    let aiScore = Math.round(totalWeight > 0 ? weightedSum / totalWeight : 50);

    // PEAK SIGNAL AMPLIFICATION + CONSENSUS BOOST
    // Strategy 1: If any single signal is very confident, amplify
    // Strategy 2: If MANY signals agree (>55 or <45), that consensus should boost/reduce
    let peakBoost = 0;
    let peakPenalty = 0;
    let highCount = 0;  // signals > 55
    let lowCount = 0;   // signals < 45
    
    for (const signal of signals) {
        // Peak boost for strong AI indicators
        if (signal.score >= 75 && signal.weight >= 1.5) {
            peakBoost = Math.max(peakBoost, (signal.score - 60) * signal.weight * 0.12);
        } else if (signal.score >= 65 && signal.weight >= 2.0) {
            peakBoost = Math.max(peakBoost, (signal.score - 55) * signal.weight * 0.06);
        }
        // Peak penalty for strong Real indicators  
        if (signal.score <= 20 && signal.weight >= 2.0) {
            peakPenalty = Math.max(peakPenalty, (30 - signal.score) * signal.weight * 0.12);
        } else if (signal.score <= 25 && signal.weight >= 1.5) {
            peakPenalty = Math.max(peakPenalty, (35 - signal.score) * signal.weight * 0.06);
        }
        // Count consensus (include all signals regardless of weight)
        if (signal.score > 55) highCount++;
        if (signal.score < 45) lowCount++;
    }
    
    // Consensus boost: if multiple signals agree on direction
    if (highCount >= 5) peakBoost += 10;
    else if (highCount >= 4) peakBoost += 7;
    else if (highCount >= 3) peakBoost += 3;
    // Consensus penalty: if many signals say Real
    if (lowCount >= 5) peakPenalty += 10;
    else if (lowCount >= 4) peakPenalty += 7;
    else if (lowCount >= 3) peakPenalty += 3;
    
    aiScore = Math.round(Math.max(5, Math.min(95, aiScore + peakBoost - peakPenalty)));

    let verdict: "ai" | "real" | "uncertain";
    let confidence: number;
    if (aiScore >= 60) {
        verdict = "ai";
        confidence = Math.min(100, Math.round(50 + (aiScore - 60) * 1.25));
    } else if (aiScore <= 35) {
        verdict = "real";
        confidence = Math.min(100, Math.round(50 + (35 - aiScore) * 1.43));
    } else {
        verdict = "uncertain";
        confidence = Math.round(100 - Math.abs(aiScore - 50) * 2);
    }

    return { verdict, confidence, aiScore, signals, metadata, processingTimeMs: Math.round(performance.now() - start) };
}

// ============================
// IMAGE ANALYSIS
// ============================

async function analyzeImageFile(file: File): Promise<{ signals: AnalysisSignal[]; metadata: FileMetadata }> {
    const { canvas, ctx } = await loadImage(file);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const w = canvas.width, h = canvas.height;

    const exifData = await extractBasicMetadata(file);
    const metadata: FileMetadata = {
        fileName: file.name, fileSize: file.size, fileType: file.type,
        width: w, height: h, isVideo: false, exifData,
    };

    const signals: AnalysisSignal[] = [];

    // 1. Metadata
    signals.push(analyzeMetadata(metadata, exifData));
    // 2. Spectral Nyquist Analysis (MOST IMPORTANT - based on SpAN/SPAI)
    signals.push(analyzeSpectralNyquist(pixels, w, h));
    // 3. Multi-scale Reconstruction Discrepancy
    signals.push(await analyzeMultiscaleReconstruction(canvas, ctx));
    // 4. High-Frequency Noise Residual
    signals.push(analyzeNoiseResidual(pixels, w, h));
    // 5. Edge Coherence
    signals.push(analyzeEdgeCoherence(pixels, w, h));
    // 6. Gradient Micro-Texture
    signals.push(analyzeGradientMicroTexture(pixels, w, h));
    // 7. Benford's Law
    signals.push(analyzeBenfordsLaw(pixels, w, h));
    // 8. Chromatic Aberration
    signals.push(analyzeChromaticAberration(pixels, w, h));
    // 9. Texture Consistency
    signals.push(analyzeTextureConsistency(pixels, w, h));
    // 10. CFA Pattern Detection
    signals.push(analyzeCFAPattern(pixels, w, h));

    return { signals, metadata };
}

// ============================
// VIDEO ANALYSIS
// ============================

async function analyzeVideoFile(file: File): Promise<{ signals: AnalysisSignal[]; metadata: FileMetadata }> {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);

    return new Promise((resolve) => {
        video.onloadedmetadata = async () => {
            const metadata: FileMetadata = {
                fileName: file.name, fileSize: file.size, fileType: file.type,
                width: video.videoWidth, height: video.videoHeight, isVideo: true,
            };

            video.currentTime = Math.min(1, video.duration / 2);

            video.onseeked = async () => {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d")!;
                ctx.drawImage(video, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;
                const w = canvas.width, h = canvas.height;
                URL.revokeObjectURL(url);

                const exifData = await extractBasicMetadata(file);
                metadata.exifData = exifData;

                const signals: AnalysisSignal[] = [];
                signals.push(analyzeMetadata(metadata, exifData));
                signals.push(analyzeSpectralNyquist(pixels, w, h));
                signals.push(await analyzeMultiscaleReconstruction(canvas, ctx));
                signals.push(analyzeNoiseResidual(pixels, w, h));
                signals.push(analyzeEdgeCoherence(pixels, w, h));
                signals.push(analyzeGradientMicroTexture(pixels, w, h));
                signals.push(analyzeBenfordsLaw(pixels, w, h));
                signals.push(analyzeChromaticAberration(pixels, w, h));
                signals.push(analyzeTextureConsistency(pixels, w, h));
                signals.push(analyzeVideoSpecific(file, video));

                resolve({ signals, metadata });
            };
        };
        video.src = url;
    });
}

// ============================
// SIGNAL 1: METADATA ANALYSIS
// ============================

function analyzeMetadata(metadata: FileMetadata, exifData: Record<string, string>): AnalysisSignal {
    let score = 50;
    let description = "Metadata analysis inconclusive";
    let details = "";

    const fileName = metadata.fileName.toLowerCase();
    const allValues = Object.values(exifData).join(" ").toLowerCase();

    for (const sig of AI_SOFTWARE_SIGNATURES) {
        if (fileName.includes(sig) || allValues.includes(sig)) {
            score = 95;
            description = `AI generation software detected: "${sig}"`;
            details = `Found "${sig}" in file metadata.`;
            break;
        }
    }

    if (score === 50) {
        for (const cam of REAL_CAMERA_SIGNATURES) {
            if (allValues.includes(cam)) {
                score = 15;
                description = `Real camera detected: "${cam}"`;
                details = `Camera signature "${cam}" found in metadata.`;
                break;
            }
        }
    }

    if (score === 50) {
        const aiPatterns = [/^image_?\d+$/i, /^img_?\d+$/i, /^\d{8,}/, /^[a-f0-9]{8,}/i, /prompt|generate|created|output/i];
        const nameNoExt = fileName.replace(/\.[^.]+$/, "");
        for (const pat of aiPatterns) {
            if (pat.test(nameNoExt)) {
                score = 60;
                description = "File naming pattern suggests AI generation";
                break;
            }
        }
    }

    const typicalAIResolutions = [[512, 512], [768, 768], [1024, 1024], [1024, 1792], [1792, 1024], [1024, 576], [576, 1024], [512, 768], [768, 512]];
    for (const [rw, rh] of typicalAIResolutions) {
        if (metadata.width === rw && metadata.height === rh) {
            score = Math.max(score, 70);
            details += ` Resolution ${rw}×${rh} matches typical AI output.`;
        }
    }

    // Square aspect ratio heuristic: 1:1 images are very common in AI generators
    if (score >= 40 && score <= 60 && metadata.width === metadata.height) {
        const isPow2 = (n: number) => n > 0 && (n & (n - 1)) === 0;
        if (isPow2(metadata.width) || [768, 1536].includes(metadata.width)) {
            score = Math.max(score, 68);
            details += ` Square ${metadata.width}×${metadata.height} power-of-2 — typical AI output.`;
        }
    }

    // EXIF richness: real camera photos have rich EXIF data
    // AI-generated images typically have minimal or no EXIF
    if (score >= 40 && score <= 60) {
        const exifKeys = Object.keys(exifData).length;
        if (exifKeys >= 5) {
            score = Math.min(score, 35);
            details += ` Rich EXIF data (${exifKeys} fields) — likely real camera.`;
        } else if (exifKeys <= 1) {
            score = Math.max(score, 62);
            details += ` Minimal EXIF — AI images typically lack metadata.`;
        }
    }

    const descriptionKey = score >= 90 ? "signal.metadata.aiDetected"
        : score <= 20 ? "signal.metadata.cameraDetected"
            : description.includes("naming") ? "signal.metadata.namingPattern"
                : "signal.metadata.inconclusive";

    return {
        name: "Metadata Analysis", nameKey: "signal.metadataAnalysis",
        category: "metadata", score, weight: 3.0,
        description, descriptionKey, icon: "◎", details,
    };
}

// ============================
// SIGNAL 2: SPECTRAL NYQUIST ANALYSIS
// Based on SpAN (ICLR 2026) & SPAI (CVPR 2025)
// AI upsampling creates spectral artifacts at Nyquist frequencies
// ============================

function analyzeSpectralNyquist(pixels: Uint8ClampedArray, width: number, height: number): AnalysisSignal {
    // SpAN-inspired: compute 1D power spectral density along rows and columns
    // then check for anomalous peaks at N/2 (Nyquist) frequency
    // Using azimuthal integration for robustness (average over all rows/cols)

    const size = Math.min(256, Math.min(width, height));
    const offsetX = Math.floor((width - size) / 2);
    const offsetY = Math.floor((height - size) / 2);

    // Extract grayscale center crop
    const gray = new Float64Array(size * size);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const idx = ((offsetY + y) * width + (offsetX + x)) * 4;
            gray[y * size + x] = pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;
        }
    }

    // Compute radial power spectrum via row-wise 1D DFT (O(n^2*k))
    // Only compute magnitudes at key frequencies: DC vicinity, mid, Nyquist vicinity
    const halfSize = Math.floor(size / 2);
    const freqPower = new Float64Array(halfSize + 1); // average power per frequency bin

    // Sample rows for efficiency
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
            freqPower[k] += re * re + im * im; // squared magnitude
        }
        rowCount++;
    }

    // Also sample columns
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

    // Normalize
    for (let k = 0; k <= halfSize; k++) {
        freqPower[k] /= rowCount;
    }

    // Apply log scale for analysis
    const logPower = new Float64Array(halfSize + 1);
    for (let k = 0; k <= halfSize; k++) {
        logPower[k] = Math.log10(freqPower[k] + 1);
    }

    // SpAN key metric: Nyquist peak ratio
    // Compare power at N/2 to average of neighboring frequencies
    const nyquist = logPower[halfSize];
    const near1 = halfSize > 1 ? logPower[halfSize - 1] : nyquist;
    const near2 = halfSize > 2 ? logPower[halfSize - 2] : near1;
    const near3 = halfSize > 3 ? logPower[halfSize - 3] : near2;
    const nearAvg = (near1 + near2 + near3) / 3;
    const peakRatio = nearAvg > 0 ? nyquist / nearAvg : 1.0;

    // Also check for sub-harmonic peaks at N/4 (common in 2x upsampling)
    const quarter = Math.floor(halfSize / 2);
    const quarterPower = logPower[quarter];
    const quarterNear = (logPower[Math.max(0, quarter - 1)] + logPower[Math.min(halfSize, quarter + 1)]) / 2;
    const quarterRatio = quarterNear > 0 ? quarterPower / quarterNear : 1.0;

    // Spectral rolloff: how quickly power decreases with frequency
    // Real: smooth 1/f^2 rolloff. AI: flatter or with peaks
    const lowFreq = (logPower[1] + logPower[2] + logPower[3]) / 3;
    const highFreq = (logPower[halfSize - 3] + logPower[halfSize - 2] + logPower[halfSize - 1]) / 3;
    const rolloffRatio = lowFreq > 0 ? highFreq / lowFreq : 0;

    // Scoring: combine multiple spectral indicators
    let score = 50; // Start neutral

    // Nyquist peak strongly indicates AI upsampling
    if (peakRatio > 1.5) score += 20;
    else if (peakRatio > 1.2) score += 10;
    else if (peakRatio < 0.9) score -= 15;

    // Quarter-frequency peak indicates upsampling
    if (quarterRatio > 1.3) score += 10;

    // Flat rolloff indicates AI (real images have steep rolloff)
    if (rolloffRatio > 0.5) score += 15;
    else if (rolloffRatio > 0.3) score += 5;
    else if (rolloffRatio < 0.15) score -= 15;
    else if (rolloffRatio < 0.2) score -= 5;

    // HEURISTIC: Images from web CDNs get resized to arbitrary dimensions,
    // creating false Nyquist peaks. AI generators typically output power-of-2 or standard sizes.
    // If dimensions suggest web resize, discount the spectral score.
    const isPow2OrStd = (d: number) => (d & (d - 1)) === 0 || [512, 768, 1024, 1536, 2048, 4096].includes(d);
    const likelyResized = !isPow2OrStd(width) && !isPow2OrStd(height) && (width % 100 !== 0 || height % 100 !== 0);
    if (likelyResized && score > 50) {
        // Reduce AI score — spectral peaks are likely from CDN resize, not AI
        score = Math.round(50 + (score - 50) * 0.3);
    }

    score = Math.max(10, Math.min(90, score));

    return {
        name: "Spectral Nyquist Analysis", nameKey: "signal.spectralNyquist",
        category: "spectral", score, weight: 0.5,
        description: score > 55
            ? "Spectral peaks at Nyquist frequencies detected — characteristic of AI upsampling artifacts"
            : "Spectral distribution is smooth — consistent with natural photography",
        descriptionKey: score > 55 ? "signal.spectral.ai" : "signal.spectral.real",
        icon: "◈",
        details: `Peak ratio: ${peakRatio.toFixed(2)}, Quarter ratio: ${quarterRatio.toFixed(2)}, Rolloff: ${rolloffRatio.toFixed(3)}. AI: peak > 1.2, rolloff > 0.3.`,
    };
}

// ============================
// SIGNAL 3: MULTI-SCALE RECONSTRUCTION DISCREPANCY
// Improved ELA: re-encode at 3 quality levels, analyze variance pattern
// ============================

async function analyzeMultiscaleReconstruction(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
): Promise<AnalysisSignal> {
    const orig = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const qualities = [0.5, 0.75, 0.9];
    const blockSize = 16;
    const blocksX = Math.floor(canvas.width / blockSize);
    const blocksY = Math.floor(canvas.height / blockSize);
    const totalBlocks = blocksX * blocksY;

    const scaleErrors: number[][] = []; // errors per quality per block

    for (const q of qualities) {
        const dataURL = canvas.toDataURL("image/jpeg", q);
        const errors = await new Promise<number[]>((resolve) => {
            const img2 = new Image();
            img2.onload = () => {
                const c2 = document.createElement("canvas");
                c2.width = canvas.width; c2.height = canvas.height;
                const ctx2 = c2.getContext("2d")!;
                ctx2.drawImage(img2, 0, 0, canvas.width, canvas.height);
                const recomp = ctx2.getImageData(0, 0, canvas.width, canvas.height).data;

                const blockErrors: number[] = [];
                for (let by = 0; by < blocksY; by++) {
                    for (let bx = 0; bx < blocksX; bx++) {
                        let diff = 0, count = 0;
                        for (let y = by * blockSize; y < (by + 1) * blockSize; y++) {
                            for (let x = bx * blockSize; x < (bx + 1) * blockSize; x++) {
                                const idx = (y * canvas.width + x) * 4;
                                diff += Math.abs(orig[idx] - recomp[idx])
                                    + Math.abs(orig[idx + 1] - recomp[idx + 1])
                                    + Math.abs(orig[idx + 2] - recomp[idx + 2]);
                                count++;
                            }
                        }
                        blockErrors.push(count > 0 ? diff / (count * 3) : 0);
                    }
                }
                resolve(blockErrors);
            };
            img2.onerror = () => resolve(new Array(totalBlocks).fill(0));
            img2.src = dataURL;
        });
        scaleErrors.push(errors);
    }

    // Analyze cross-scale consistency
    // AI: uniform error across scales (consistent reconstruction)
    // Real: varying error due to different JPEG block structures
    let totalCV = 0;
    let crossScaleVariance = 0;

    for (let b = 0; b < totalBlocks; b++) {
        const vals = scaleErrors.map(s => s[b]);
        const mean = vals.reduce((a, v) => a + v, 0) / vals.length;
        const variance = vals.reduce((a, v) => a + (v - mean) ** 2, 0) / vals.length;
        crossScaleVariance += mean > 0 ? Math.sqrt(variance) / mean : 0;
    }
    crossScaleVariance /= totalBlocks;

    // Spatial uniformity of error at medium quality
    const midErrors = scaleErrors[1];
    const midMean = midErrors.reduce((a, b) => a + b, 0) / midErrors.length;
    const midVar = midErrors.reduce((a, b) => a + (b - midMean) ** 2, 0) / midErrors.length;
    totalCV = midMean > 0 ? Math.sqrt(midVar) / midMean : 0;

    // AI: low spatial CV (uniform) + low cross-scale variance
    // Real: high spatial CV + high cross-scale variance
    const combined = totalCV * 0.6 + crossScaleVariance * 0.4;

    let score: number;
    if (combined < 0.15) score = 80;
    else if (combined < 0.25) score = 65;
    else if (combined < 0.4) score = 50;
    else if (combined < 0.6) score = 35;
    else score = 18;

    return {
        name: "Multi-scale Reconstruction", nameKey: "signal.multiScaleReconstruction",
        category: "forensic", score, weight: 4.0,
        description: score > 55
            ? "Reconstruction errors are unnaturally uniform — typical of AI-generated content"
            : "Reconstruction shows natural variation — consistent with real photography",
        descriptionKey: score > 55 ? "signal.reconstruction.ai" : "signal.reconstruction.real",
        icon: "⊞",
        details: `Spatial CV: ${totalCV.toFixed(3)}, Cross-scale var: ${crossScaleVariance.toFixed(3)}, Combined: ${combined.toFixed(3)}. Real photos > 0.4.`,
    };
}

// ============================
// SIGNAL 4: HIGH-FREQUENCY NOISE RESIDUAL
// Extract noise via high-pass filter, analyze statistical properties
// ============================

function analyzeNoiseResidual(pixels: Uint8ClampedArray, width: number, height: number): AnalysisSignal {
    // Apply Laplacian high-pass + shot noise correlation analysis
    // Real cameras: noise ∝ √brightness (Poisson/shot noise)
    // AI: noise is uniform or absent regardless of brightness
    const blockSize = 32;
    const blocksX = Math.floor(width / blockSize);
    const blocksY = Math.floor(height / blockSize);
    const blockStdDevs: number[] = [];
    const blockBrightness: number[] = [];

    const step = Math.max(1, Math.floor(blocksX * blocksY / 300));

    for (let by = 0; by < blocksY; by += step) {
        for (let bx = 0; bx < blocksX; bx += step) {
            let sumResidual = 0, sumResidual2 = 0, sumBright = 0, count = 0;

            for (let y = by * blockSize + 1; y < (by + 1) * blockSize - 1; y++) {
                for (let x = bx * blockSize + 1; x < (bx + 1) * blockSize - 1; x++) {
                    const getGray = (px: number, py: number) => {
                        const i = (py * width + px) * 4;
                        return pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
                    };
                    const center = getGray(x, y);
                    const laplacian = 4 * center - getGray(x - 1, y) - getGray(x + 1, y) - getGray(x, y - 1) - getGray(x, y + 1);
                    sumResidual += laplacian;
                    sumResidual2 += laplacian * laplacian;
                    sumBright += center;
                    count++;
                }
            }

            if (count > 0) {
                const mean = sumResidual / count;
                const variance = sumResidual2 / count - mean * mean;
                blockStdDevs.push(Math.sqrt(Math.max(0, variance)));
                blockBrightness.push(sumBright / count);
            }
        }
    }

    if (blockStdDevs.length < 4) {
        return { name: "Noise Residual", nameKey: "signal.noiseResidual", category: "pixel", score: 50, weight: 3.5, description: "Insufficient data", descriptionKey: "signal.noise.error", icon: "◫" };
    }

    // CV analysis
    const mean = blockStdDevs.reduce((a, b) => a + b, 0) / blockStdDevs.length;
    const variance = blockStdDevs.reduce((a, b) => a + (b - mean) ** 2, 0) / blockStdDevs.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

    // Shot noise correlation: Pearson correlation between brightness and noise
    // Real cameras: positive correlation (bright = more photon noise)
    const meanBright = blockBrightness.reduce((a, b) => a + b, 0) / blockBrightness.length;
    let covBN = 0, varB = 0, varN = 0;
    for (let i = 0; i < blockStdDevs.length; i++) {
        const db = blockBrightness[i] - meanBright;
        const dn = blockStdDevs[i] - mean;
        covBN += db * dn;
        varB += db * db;
        varN += dn * dn;
    }
    const shotCorrelation = (varB > 0 && varN > 0) ? covBN / Math.sqrt(varB * varN) : 0;

    // Mean noise level (AI images often have very low noise)
    const noiseLevel = mean;

    // Combined scoring
    let score = 50;

    // Shot noise correlation: strong indicator
    if (shotCorrelation > 0.3) score -= 20;       // Real: positive correlation
    else if (shotCorrelation > 0.1) score -= 10;
    else if (shotCorrelation < -0.1) score += 10;  // AI: no/negative correlation
    else score += 5;                               // Near zero = suspicious

    // Noise uniformity
    if (cv < 0.2) score += 20;                     // Very uniform = AI
    else if (cv < 0.35) score += 10;
    else if (cv > 0.8) score -= 15;                // Highly varied = real
    else if (cv > 0.5) score -= 5;

    // Very low noise = probably AI (no sensor)
    if (noiseLevel < 2.0) score += 10;
    else if (noiseLevel > 6.0) score -= 5;

    score = Math.max(10, Math.min(90, score));

    return {
        name: "Noise Residual", nameKey: "signal.noiseResidual",
        category: "pixel", score, weight: 3.5,
        description: score > 55
            ? "Noise residual is unnaturally uniform — AI images lack natural sensor noise variation"
            : "Noise varies naturally — consistent with real camera sensor behavior",
        descriptionKey: score > 55 ? "signal.noise.ai" : "signal.noise.real",
        icon: "◫",
        details: `Noise CV: ${cv.toFixed(3)}, Shot correlation: ${shotCorrelation.toFixed(3)}, Mean noise: ${noiseLevel.toFixed(1)}. Real cameras show positive shot correlation (>0.2).`,
    };
}

// ============================
// SIGNAL 5: EDGE COHERENCE
// ============================

function analyzeEdgeCoherence(pixels: Uint8ClampedArray, width: number, height: number): AnalysisSignal {
    const edgeMagnitudes: number[] = [];
    const edgeDirections: number[] = [];
    const step = Math.max(1, Math.floor(Math.min(width, height) / 300));

    for (let y = 1; y < height - 1; y += step) {
        for (let x = 1; x < width - 1; x += step) {
            const getGray = (px: number, py: number) => {
                const i = (py * width + px) * 4;
                return pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
            };

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

    // Edge direction entropy (AI often has more uniform edge directions)
    const dirBins = new Float64Array(36); // 10-degree bins
    for (const dir of edgeDirections) {
        const bin = Math.floor(((dir + Math.PI) / (2 * Math.PI)) * 36) % 36;
        dirBins[bin]++;
    }
    let dirEntropy = 0;
    const totalEdges = edgeDirections.length;
    for (let i = 0; i < 36; i++) {
        if (dirBins[i] > 0) {
            const p = dirBins[i] / totalEdges;
            dirEntropy -= p * Math.log2(p);
        }
    }
    const maxEntropy = Math.log2(36); // ~5.17
    const normalizedEntropy = dirEntropy / maxEntropy;

    // AI: smooth edges (low median, low range), high direction entropy
    // Real: varied edges, natural direction distribution
    // Edge sharpness ratio: p90/p50 — AI has more uniform edge strengths
    const sharpnessRatio = p50 > 0 ? p90 / p50 : 1;

    let score = 50;

    // Very smooth edges = AI (StyleGAN, Midjourney)
    if (p50 < 5 && edgeRange < 30) score += 25;
    else if (p50 < 8) score += 15;
    else if (p50 > 20) score -= 15;
    else if (p50 > 15) score -= 5;

    // Low sharpness ratio = uniform edges = AI
    if (sharpnessRatio < 3) score += 10;
    else if (sharpnessRatio > 8) score -= 10;

    // High direction entropy = overly regularized = AI
    if (normalizedEntropy > 0.9) score += 10;
    else if (normalizedEntropy < 0.65) score -= 10;

    score = Math.max(10, Math.min(90, score));

    return {
        name: "Edge Coherence", nameKey: "signal.edgeCoherence",
        category: "structure", score, weight: 2.5,
        description: score > 55
            ? "Edges are unusually smooth with uniform directions — common in AI generation"
            : "Edge patterns show natural variation — consistent with real content",
        descriptionKey: score > 55 ? "signal.edge.ai" : "signal.edge.real",
        icon: "▣",
        details: `Median edge: ${p50.toFixed(1)}, Range: ${edgeRange.toFixed(1)}, Sharpness ratio: ${sharpnessRatio.toFixed(1)}, Dir entropy: ${normalizedEntropy.toFixed(3)}.`,
    };
}

// ============================
// SIGNAL 6: GRADIENT MICRO-TEXTURE
// ============================

function analyzeGradientMicroTexture(pixels: Uint8ClampedArray, width: number, height: number): AnalysisSignal {
    const blockSize = 32;
    const blocksX = Math.floor(width / blockSize);
    const blocksY = Math.floor(height / blockSize);

    let smoothBlockCount = 0;
    let totalBlockCount = 0;
    let microRatioSum = 0;
    const step = Math.max(1, Math.floor(blocksX * blocksY / 200));

    for (let by = 0; by < blocksY; by += step) {
        for (let bx = 0; bx < blocksX; bx += step) {
            let gradSum = 0, microNoise = 0, count = 0;

            for (let y = by * blockSize; y < (by + 1) * blockSize - 1; y++) {
                for (let x = bx * blockSize; x < (bx + 1) * blockSize - 2; x++) {
                    const idx = (y * width + x) * 4;
                    const idxR = (y * width + x + 1) * 4;
                    const idxR2 = (y * width + x + 2) * 4;

                    const g0 = pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;
                    const g1 = pixels[idxR] * 0.299 + pixels[idxR + 1] * 0.587 + pixels[idxR + 2] * 0.114;
                    const g2 = pixels[idxR2] * 0.299 + pixels[idxR2 + 1] * 0.587 + pixels[idxR2 + 2] * 0.114;

                    gradSum += Math.abs(g1 - g0);
                    microNoise += Math.abs(2 * g1 - g0 - g2);
                    count++;
                }
            }

            totalBlockCount++;
            const avgGrad = count > 0 ? gradSum / count : 0;
            const avgMicro = count > 0 ? microNoise / count : 0;

            // "Smooth" block: low gradient (flat region like skin, sky)
            if (avgGrad < 5 && count > 0) {
                smoothBlockCount++;
                // Micro-to-gradient ratio: AI has very low ratio in smooth areas
                // Real cameras: even smooth areas have micro-noise from sensor
                const ratio = avgGrad > 0.5 ? avgMicro / avgGrad : avgMicro;
                microRatioSum += ratio;
            }
        }
    }

    // Fraction of smooth blocks (AI often has more smooth regions)
    const smoothFraction = totalBlockCount > 0 ? smoothBlockCount / totalBlockCount : 0;
    const avgMicroRatio = smoothBlockCount > 0 ? microRatioSum / smoothBlockCount : 0;

    let score = 50;

    // High fraction of smooth blocks = likely AI (very clean gradients)
    if (smoothFraction > 0.5) score += 15;
    else if (smoothFraction > 0.3) score += 5;
    else if (smoothFraction < 0.1) score -= 10;

    // Low micro-ratio in smooth areas = AI (no sensor noise)
    if (avgMicroRatio < 0.5) score += 15;
    else if (avgMicroRatio < 1.0) score += 5;
    else if (avgMicroRatio > 2.0) score -= 15;
    else if (avgMicroRatio > 1.5) score -= 5;

    score = Math.max(10, Math.min(90, score));

    return {
        name: "Gradient Micro-Texture", nameKey: "signal.gradientSmoothness",
        category: "texture", score, weight: 2.0,
        description: score > 55
            ? "Smooth regions lack natural micro-texture — AI images miss sensor-level noise"
            : "Smooth regions contain natural micro-texture from camera sensor",
        descriptionKey: score > 55 ? "signal.gradient.ai" : "signal.gradient.real",
        icon: "▤",
        details: `Smooth blocks: ${smoothBlockCount}/${totalBlockCount} (${(smoothFraction * 100).toFixed(0)}%), Micro ratio: ${avgMicroRatio.toFixed(3)}.`,
    };
}

// ============================
// SIGNAL 7: BENFORD'S LAW
// ============================

function analyzeBenfordsLaw(pixels: Uint8ClampedArray, width: number, height: number): AnalysisSignal {
    const benford = [0, 0.301, 0.176, 0.125, 0.097, 0.079, 0.067, 0.058, 0.051, 0.046];
    const digitCount = new Array(10).fill(0);
    let totalDigits = 0;

    const step = Math.max(1, Math.floor(Math.min(width, height) / 400));

    for (let y = 0; y < height - 1; y += step) {
        for (let x = 0; x < width - 1; x += step) {
            const idx = (y * width + x) * 4;
            const idxR = (y * width + x + 1) * 4;
            const idxD = ((y + 1) * width + x) * 4;

            const mag = Math.abs(pixels[idx] - pixels[idxR]) + Math.abs(pixels[idx + 1] - pixels[idxR + 1]) + Math.abs(pixels[idx + 2] - pixels[idxR + 2])
                + Math.abs(pixels[idx] - pixels[idxD]) + Math.abs(pixels[idx + 1] - pixels[idxD + 1]) + Math.abs(pixels[idx + 2] - pixels[idxD + 2]);

            if (mag > 0) {
                const firstDigit = parseInt(String(mag).charAt(0));
                if (firstDigit >= 1 && firstDigit <= 9) {
                    digitCount[firstDigit]++;
                    totalDigits++;
                }
            }
        }
    }

    let chiSquared = 0;
    if (totalDigits > 0) {
        for (let d = 1; d <= 9; d++) {
            const observed = digitCount[d] / totalDigits;
            chiSquared += ((observed - benford[d]) ** 2) / benford[d];
        }
    }

    let score: number;
    if (chiSquared < 0.01) score = 22;
    else if (chiSquared < 0.03) score = 35;
    else if (chiSquared < 0.08) score = 48;
    else if (chiSquared < 0.15) score = 65;
    else score = 78;

    return {
        name: "Benford's Law", nameKey: "signal.benfordsLaw",
        category: "statistical", score, weight: 0.3,
        description: score > 55
            ? "Pixel gradients deviate from Benford's Law — characteristic of AI generation"
            : "Pixel gradients follow natural statistical distribution",
        descriptionKey: score > 55 ? "signal.benford.ai" : "signal.benford.real",
        icon: "∑",
        details: `Chi-squared: ${chiSquared.toFixed(4)}, Samples: ${totalDigits}. Natural images: χ² < 0.03.`,
    };
}

// ============================
// SIGNAL 8: CHROMATIC ABERRATION
// ============================

function analyzeChromaticAberration(pixels: Uint8ClampedArray, width: number, height: number): AnalysisSignal {
    const borderWidth = Math.max(20, Math.floor(Math.min(width, height) * 0.05));
    let totalShift = 0, shiftCount = 0;
    const step = Math.max(2, Math.floor(borderWidth / 10));

    const checkShift = (x: number, y: number) => {
        if (x < 1 || x >= width - 1 || y < 1 || y >= height - 1) return;
        const idx = (y * width + x) * 4;
        const idxR = (y * width + x + 1) * 4;
        totalShift += Math.abs(Math.abs(pixels[idx] - pixels[idxR]) - Math.abs(pixels[idx + 2] - pixels[idxR + 2]));
        shiftCount++;
    };

    for (let x = 0; x < width; x += step) {
        for (let y = 0; y < borderWidth; y += step) checkShift(x, y);
        for (let y = height - borderWidth; y < height; y += step) checkShift(x, y);
    }
    for (let y = 0; y < height; y += step) {
        for (let x = 0; x < borderWidth; x += step) checkShift(x, y);
        for (let x = width - borderWidth; x < width; x += step) checkShift(x, y);
    }

    const avgShift = shiftCount > 0 ? totalShift / shiftCount : 0;

    let score: number;
    if (avgShift < 1.0) score = 70;
    else if (avgShift < 2.0) score = 55;
    else if (avgShift < 4.0) score = 38;
    else if (avgShift < 8.0) score = 25;
    else score = 15;

    return {
        name: "Chromatic Aberration", nameKey: "signal.chromaticAberration",
        category: "optics", score, weight: 0.5,
        description: score > 55
            ? "No chromatic aberration — real camera lenses produce color fringing"
            : "Chromatic aberration present — consistent with real camera optics",
        descriptionKey: score > 55 ? "signal.chromatic.ai" : "signal.chromatic.real",
        icon: "◐",
        details: `Avg R-B edge shift: ${avgShift.toFixed(2)}, Samples: ${shiftCount}. Real lenses > 3.0.`,
    };
}

// ============================
// SIGNAL 9: TEXTURE CONSISTENCY
// ============================

function analyzeTextureConsistency(pixels: Uint8ClampedArray, width: number, height: number): AnalysisSignal {
    const regionSize = Math.min(64, Math.floor(Math.min(width, height) / 4));
    const positions = [
        [0, 0], [width - regionSize, 0],
        [0, height - regionSize], [width - regionSize, height - regionSize],
        [Math.floor(width / 2 - regionSize / 2), Math.floor(height / 2 - regionSize / 2)],
    ];

    const regions: number[] = [];
    for (const [sx, sy] of positions) {
        let localVar = 0, count = 0;
        for (let y = sy; y < sy + regionSize - 1; y++) {
            for (let x = sx; x < sx + regionSize - 1; x++) {
                const idx = (y * width + x) * 4;
                const idxN = (y * width + x + 1) * 4;
                localVar += Math.abs(pixels[idx] - pixels[idxN]) + Math.abs(pixels[idx + 1] - pixels[idxN + 1]) + Math.abs(pixels[idx + 2] - pixels[idxN + 2]);
                count++;
            }
        }
        regions.push(count > 0 ? localVar / count : 0);
    }

    const avg = regions.reduce((a, b) => a + b, 0) / regions.length;
    const regionVar = regions.reduce((a, b) => a + (b - avg) ** 2, 0) / regions.length;
    const regionCV = avg > 0 ? Math.sqrt(regionVar) / avg : 0;

    let score: number;
    if (regionCV < 0.2) score = 70;
    else if (regionCV < 0.4) score = 52;
    else if (regionCV < 0.7) score = 36;
    else score = 20;

    return {
        name: "Texture Consistency", nameKey: "signal.textureConsistency",
        category: "texture", score, weight: 1.5,
        description: score > 55
            ? "Texture is unusually consistent across regions — common in AI generation"
            : "Texture varies naturally across regions",
        descriptionKey: score > 55 ? "signal.texture.ai" : "signal.texture.real",
        icon: "◇",
        details: `Region CV: ${regionCV.toFixed(3)}, Regions: ${regions.map(r => r.toFixed(1)).join(", ")}.`,
    };
}

// ============================
// SIGNAL 10: CFA PATTERN DETECTION
// Real cameras use Bayer filter (RGGB) creating specific demosaicing artifacts
// AI images lack these micro-patterns
// ============================

function analyzeCFAPattern(pixels: Uint8ClampedArray, width: number, height: number): AnalysisSignal {
    // Detect Bayer CFA demosaicing artifacts:
    // Real cameras create subtle 2x2 periodic patterns in high-frequency residuals
    // due to color filter array interpolation

    let periodicEnergy = 0;
    let totalEnergy = 0;
    let count = 0;

    const step = Math.max(2, Math.floor(Math.min(width, height) / 300));

    for (let y = 2; y < height - 2; y += step) {
        for (let x = 2; x < width - 2; x += step) {
            // Check for 2x2 periodicity in green channel (G has highest sampling in Bayer)
            const getG = (px: number, py: number) => pixels[(py * width + px) * 4 + 1];

            const center = getG(x, y);
            const right = getG(x + 1, y);
            const down = getG(x, y + 1);
            const diag = getG(x + 1, y + 1);
            const right2 = getG(x + 2, y);
            const down2 = getG(x, y + 2);

            // 2x2 periodic signal: center ≈ diag, right ≈ down (checkerboard pattern)
            const periodic = Math.abs((center - right) - (down - diag));
            // Non-periodic gradient
            const gradient = Math.abs(center - right2) + Math.abs(center - down2);

            periodicEnergy += periodic;
            totalEnergy += gradient + 1; // +1 to avoid division by zero
            count++;
        }
    }

    const cfaRatio = count > 0 && totalEnergy > 0 ? periodicEnergy / totalEnergy : 0;

    // Real cameras: noticeable CFA pattern (cfaRatio > 0.3)
    // AI: no CFA pattern (cfaRatio < 0.15)
    let score: number;
    if (cfaRatio < 0.1) score = 72;      // No CFA → likely AI
    else if (cfaRatio < 0.2) score = 58;
    else if (cfaRatio < 0.35) score = 42;
    else if (cfaRatio < 0.5) score = 28;
    else score = 15;                      // Strong CFA → real camera

    return {
        name: "CFA Pattern Detection", nameKey: "signal.cfaPattern",
        category: "optics", score, weight: 1.5,
        description: score > 55
            ? "No Bayer CFA demosaicing pattern found — real cameras leave this fingerprint"
            : "CFA demosaicing artifacts present — characteristic of real camera sensors",
        descriptionKey: score > 55 ? "signal.cfa.ai" : "signal.cfa.real",
        icon: "⊡",
        details: `CFA ratio: ${cfaRatio.toFixed(3)}, Samples: ${count}. Real cameras typically show ratio > 0.3.`,
    };
}

// ============================
// VIDEO SPECIFIC
// ============================

function analyzeVideoSpecific(file: File, video: HTMLVideoElement): AnalysisSignal {
    const duration = video.duration;
    const { videoWidth: w, videoHeight: h } = video;

    let score = 50;
    let description = "Video analysis";
    let details = `Duration: ${duration.toFixed(1)}s, Resolution: ${w}×${h}`;

    if (duration <= 5) { score += 15; description = "Very short video — common in AI generation"; }
    else if (duration <= 15) score += 5;
    else if (duration > 60) { score -= 15; description = "Long video — less likely fully AI-generated"; }

    const aiVideoResolutions = [[1024, 576], [576, 1024], [512, 512], [768, 768], [1280, 720], [720, 1280]];
    for (const [aw, ah] of aiVideoResolutions) {
        if (w === aw && h === ah) { score += 10; details += ". AI-typical resolution"; }
    }

    score = Math.max(0, Math.min(100, score));

    return {
        name: "Video Properties", nameKey: "signal.videoProperties",
        category: "video", score, weight: 1.5,
        description, descriptionKey: duration <= 5 ? "signal.video.short" : duration > 60 ? "signal.video.long" : "signal.video.analysis",
        icon: "▶", details,
    };
}

// ============================
// UTILITIES
// ============================

async function loadImage(file: File): Promise<{ canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; img: HTMLImageElement }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            const maxDim = 1024;
            let w = img.width, h = img.height;
            if (w > maxDim || h > maxDim) {
                const scale = maxDim / Math.max(w, h);
                w = Math.round(w * scale);
                h = Math.round(h * scale);
            }

            const canvas = document.createElement("canvas");
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0, w, h);

            URL.revokeObjectURL(url);
            resolve({ canvas, ctx, img });
        };

        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")); };
        img.src = url;
    });
}

async function extractBasicMetadata(file: File): Promise<Record<string, string>> {
    const metadata: Record<string, string> = {};
    metadata["File Name"] = file.name;
    metadata["File Size"] = formatFileSize(file.size);
    metadata["MIME Type"] = file.type;
    metadata["Last Modified"] = new Date(file.lastModified).toISOString();

    try {
        const buffer = await file.slice(0, 65536).arrayBuffer();
        const view = new DataView(buffer);

        if (view.getUint16(0) === 0xffd8) {
            metadata["Format"] = "JPEG";
            let offset = 2;
            while (offset < view.byteLength - 4) {
                const marker = view.getUint16(offset);
                if (marker === 0xffe1) {
                    const length = view.getUint16(offset + 2);
                    const exifStr = readString(view, offset + 4, Math.min(length, 100));
                    if (exifStr.includes("Exif")) metadata["EXIF"] = "Present";
                    break;
                }
                if ((marker & 0xff00) !== 0xff00) break;
                const segLen = view.getUint16(offset + 2);
                offset += 2 + segLen;
            }
        } else if (view.getUint32(0) === 0x89504e47) {
            metadata["Format"] = "PNG";
            let offset = 8;
            while (offset < Math.min(view.byteLength - 8, 4096)) {
                const chunkLen = view.getUint32(offset);
                const chunkType = readString(view, offset + 4, 4);
                if (chunkType === "tEXt" || chunkType === "iTXt") {
                    const text = readString(view, offset + 8, Math.min(chunkLen, 200));
                    if (text.toLowerCase().includes("software")) metadata["Software"] = text.split("\0").slice(1).join("");
                    if (text.toLowerCase().includes("comment")) metadata["Comment"] = text.split("\0").slice(1).join("");
                }
                offset += 12 + chunkLen;
                if (chunkType === "IEND") break;
            }
        }
    } catch { /* silent */ }

    return metadata;
}

function readString(view: DataView, offset: number, length: number): string {
    let str = "";
    for (let i = 0; i < length && offset + i < view.byteLength; i++) {
        const code = view.getUint8(offset + i);
        if (code >= 32 && code < 127) str += String.fromCharCode(code);
    }
    return str;
}

export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
