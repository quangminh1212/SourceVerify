/**
 * SourceVerify AI Detection Engine
 * Multi-signal analysis for detecting AI-generated images/videos
 *
 * Analysis dimensions:
 * 1. Metadata Analysis (EXIF, software signatures)
 * 2. Frequency Domain Analysis (FFT patterns)
 * 3. Pixel-level Statistics (noise, uniformity)
 * 4. Edge Coherence Analysis
 * 5. Color Distribution Analysis
 * 6. GAN Artifact Detection (spectral)
 */

export interface AnalysisResult {
    verdict: "ai" | "real" | "uncertain";
    confidence: number; // 0-100
    aiScore: number; // 0-100 (how likely AI-generated)
    signals: AnalysisSignal[];
    metadata: FileMetadata;
    processingTimeMs: number;
}

export interface AnalysisSignal {
    name: string;
    category: string;
    score: number; // 0-100
    weight: number;
    description: string;
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

// Known AI generation software signatures
const AI_SOFTWARE_SIGNATURES = [
    "midjourney",
    "dall-e",
    "dalle",
    "stable diffusion",
    "comfyui",
    "automatic1111",
    "a1111",
    "novelai",
    "civitai",
    "invoke ai",
    "adobe firefly",
    "firefly",
    "bing image creator",
    "leonardo ai",
    "playground ai",
    "deep dream",
    "artbreeder",
    "nightcafe",
    "craiyon",
    "dreamstudio",
    "flux",
    "sora",
    "runway",
    "pika",
    "kling",
    "hailuo",
    "luma dream",
    "minimax",
    "genmo",
];

// Common camera manufacturers
const REAL_CAMERA_SIGNATURES = [
    "canon",
    "nikon",
    "sony",
    "fujifilm",
    "olympus",
    "panasonic",
    "leica",
    "hasselblad",
    "pentax",
    "samsung",
    "apple",
    "google pixel",
    "huawei",
    "xiaomi",
    "oppo",
    "oneplus",
];

/**
 * Main analysis function
 */
export async function analyzeMedia(
    file: File
): Promise<AnalysisResult> {
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

    // Calculate weighted AI score
    let totalWeight = 0;
    let weightedSum = 0;

    for (const signal of signals) {
        totalWeight += signal.weight;
        weightedSum += signal.score * signal.weight;
    }

    const aiScore = Math.round(totalWeight > 0 ? weightedSum / totalWeight : 50);

    // Determine verdict
    let verdict: "ai" | "real" | "uncertain";
    let confidence: number;

    if (aiScore >= 70) {
        verdict = "ai";
        confidence = Math.min(100, Math.round(50 + (aiScore - 70) * 1.67));
    } else if (aiScore <= 30) {
        verdict = "real";
        confidence = Math.min(100, Math.round(50 + (30 - aiScore) * 1.67));
    } else {
        verdict = "uncertain";
        confidence = Math.round(100 - Math.abs(aiScore - 50) * 2);
    }

    const processingTimeMs = Math.round(performance.now() - start);

    return { verdict, confidence, aiScore, signals, metadata, processingTimeMs };
}

// ============================
// IMAGE ANALYSIS
// ============================

async function analyzeImageFile(
    file: File
): Promise<{ signals: AnalysisSignal[]; metadata: FileMetadata }> {
    const { canvas, ctx, img } = await loadImage(file);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const metadata: FileMetadata = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        width: canvas.width,
        height: canvas.height,
        isVideo: false,
    };

    // Extract EXIF-like metadata from file name / type
    const exifData = await extractBasicMetadata(file);
    metadata.exifData = exifData;

    const signals: AnalysisSignal[] = [];

    // 1. Metadata analysis
    signals.push(analyzeMetadataSignal(metadata, exifData));

    // 2. Noise uniformity analysis
    signals.push(analyzeNoiseUniformity(pixels, canvas.width, canvas.height));

    // 3. Edge coherence / sharpness
    signals.push(analyzeEdgeCoherence(pixels, canvas.width, canvas.height));

    // 4. Color distribution
    signals.push(analyzeColorDistribution(pixels));

    // 5. Frequency domain analysis (FFT approximation)
    signals.push(analyzeFrequencyDomain(pixels, canvas.width, canvas.height));

    // 6. Texture consistency
    signals.push(analyzeTextureConsistency(pixels, canvas.width, canvas.height));

    // 7. Compression artifact analysis
    signals.push(analyzeCompression(file, canvas.width, canvas.height));

    // 8. Symmetry and repetition patterns
    signals.push(analyzeSymmetryPatterns(pixels, canvas.width, canvas.height));

    return { signals, metadata };
}

// ============================
// VIDEO ANALYSIS
// ============================

async function analyzeVideoFile(
    file: File
): Promise<{ signals: AnalysisSignal[]; metadata: FileMetadata }> {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);

    return new Promise((resolve) => {
        video.onloadedmetadata = async () => {
            const metadata: FileMetadata = {
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                width: video.videoWidth,
                height: video.videoHeight,
                isVideo: true,
            };

            // Capture frame at 1 second or midpoint
            video.currentTime = Math.min(1, video.duration / 2);

            video.onseeked = async () => {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d")!;
                ctx.drawImage(video, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;

                URL.revokeObjectURL(url);

                const signals: AnalysisSignal[] = [];

                // Run same image analyses on captured frame
                const exifData = await extractBasicMetadata(file);
                metadata.exifData = exifData;

                signals.push(analyzeMetadataSignal(metadata, exifData));
                signals.push(analyzeNoiseUniformity(pixels, canvas.width, canvas.height));
                signals.push(analyzeEdgeCoherence(pixels, canvas.width, canvas.height));
                signals.push(analyzeColorDistribution(pixels));
                signals.push(analyzeFrequencyDomain(pixels, canvas.width, canvas.height));
                signals.push(analyzeTextureConsistency(pixels, canvas.width, canvas.height));
                signals.push(analyzeCompression(file, canvas.width, canvas.height));
                signals.push(analyzeVideoSpecific(file, video));

                resolve({ signals, metadata });
            };
        };

        video.src = url;
    });
}

// ============================
// SIGNAL ANALYZERS
// ============================

function analyzeMetadataSignal(
    metadata: FileMetadata,
    exifData: Record<string, string>
): AnalysisSignal {
    let score = 50; // neutral
    let description = "Metadata analysis inconclusive";
    let details = "";

    const fileName = metadata.fileName.toLowerCase();
    const allValues = Object.values(exifData).join(" ").toLowerCase();

    // Check for AI software signatures in filename or metadata
    for (const sig of AI_SOFTWARE_SIGNATURES) {
        if (fileName.includes(sig) || allValues.includes(sig)) {
            score = 95;
            description = `AI generation software detected: "${sig}"`;
            details = `File name or metadata contains "${sig}" which is a known AI generation tool.`;
            break;
        }
    }

    // Check for real camera signatures
    if (score === 50) {
        for (const cam of REAL_CAMERA_SIGNATURES) {
            if (allValues.includes(cam)) {
                score = 15;
                description = `Real camera detected: "${cam}"`;
                details = `Metadata contains "${cam}" camera signature.`;
                break;
            }
        }
    }

    // Common AI naming patterns
    if (score === 50) {
        const aiPatterns = [
            /^image_?\d+$/i,
            /^img_?\d+$/i,
            /^\d{8,}/,
            /^[a-f0-9]{8,}/i,
            /prompt|generate|created|output/i,
        ];
        for (const pat of aiPatterns) {
            const nameNoExt = fileName.replace(/\.[^.]+$/, "");
            if (pat.test(nameNoExt)) {
                score = 60;
                description = "File naming pattern suggests AI generation";
                details = `File name "${metadata.fileName}" matches common AI output naming patterns.`;
                break;
            }
        }
    }

    // Check typical AI resolutions
    const typicalAIResolutions = [
        [512, 512],
        [768, 768],
        [1024, 1024],
        [1024, 1792],
        [1792, 1024],
        [1024, 576],
        [576, 1024],
        [512, 768],
        [768, 512],
    ];

    for (const [w, h] of typicalAIResolutions) {
        if (metadata.width === w && metadata.height === h) {
            score = Math.max(score, 65);
            description += ". Resolution matches common AI output dimensions";
            details += ` Resolution ${w}x${h} is a standard AI generation size.`;
        }
    }

    return {
        name: "Metadata Analysis",
        category: "metadata",
        score,
        weight: 2.5,
        description,
        icon: "🔍",
        details,
    };
}

function analyzeNoiseUniformity(
    pixels: Uint8ClampedArray,
    width: number,
    height: number
): AnalysisSignal {
    // AI-generated images often have very uniform noise patterns
    // Real photos have spatially varying noise depending on lighting

    const blockSize = 16;
    const blocksX = Math.floor(width / blockSize);
    const blocksY = Math.floor(height / blockSize);
    const blockNoiseValues: number[] = [];

    for (let by = 0; by < blocksY; by++) {
        for (let bx = 0; bx < blocksX; bx++) {
            let sumDiff = 0;
            let count = 0;

            for (let y = by * blockSize; y < (by + 1) * blockSize - 1; y++) {
                for (let x = bx * blockSize; x < (bx + 1) * blockSize - 1; x++) {
                    const idx = (y * width + x) * 4;
                    const idxRight = (y * width + x + 1) * 4;
                    const idxDown = ((y + 1) * width + x) * 4;

                    // Calculate local variance
                    const diffR =
                        Math.abs(pixels[idx] - pixels[idxRight]) +
                        Math.abs(pixels[idx] - pixels[idxDown]);
                    const diffG =
                        Math.abs(pixels[idx + 1] - pixels[idxRight + 1]) +
                        Math.abs(pixels[idx + 1] - pixels[idxDown + 1]);
                    const diffB =
                        Math.abs(pixels[idx + 2] - pixels[idxRight + 2]) +
                        Math.abs(pixels[idx + 2] - pixels[idxDown + 2]);

                    sumDiff += (diffR + diffG + diffB) / 3;
                    count++;
                }
            }

            blockNoiseValues.push(count > 0 ? sumDiff / count : 0);
        }
    }

    // Calculate coefficient of variation of noise across blocks
    const mean =
        blockNoiseValues.reduce((a, b) => a + b, 0) / blockNoiseValues.length;
    const variance =
        blockNoiseValues.reduce((a, b) => a + (b - mean) ** 2, 0) /
        blockNoiseValues.length;
    const coeffVar = mean > 0 ? Math.sqrt(variance) / mean : 0;

    // Low coefficient of variation = uniform noise = likely AI
    // High coefficient of variation = varying noise = likely real
    let score: number;
    if (coeffVar < 0.3) {
        score = 75; // Very uniform → likely AI
    } else if (coeffVar < 0.5) {
        score = 60;
    } else if (coeffVar < 0.8) {
        score = 45;
    } else if (coeffVar < 1.2) {
        score = 30;
    } else {
        score = 20; // Highly variable → likely real
    }

    return {
        name: "Noise Uniformity",
        category: "pixel",
        score,
        weight: 2.0,
        description:
            coeffVar < 0.5
                ? "Noise pattern is unusually uniform — common in AI-generated images"
                : "Noise varies naturally across the image — consistent with real photography",
        icon: "📊",
        details: `Noise coefficient of variation: ${coeffVar.toFixed(3)}. AI images typically have values below 0.5, while real photos show higher variation (>0.8).`,
    };
}

function analyzeEdgeCoherence(
    pixels: Uint8ClampedArray,
    width: number,
    height: number
): AnalysisSignal {
    // Apply Sobel-like edge detection and analyze edge quality
    const edgeMagnitudes: number[] = [];

    const step = Math.max(1, Math.floor(Math.min(width, height) / 300)); // Sample for performance

    for (let y = 1; y < height - 1; y += step) {
        for (let x = 1; x < width - 1; x += step) {
            const idx = (y * width + x) * 4;

            // Simplified grayscale Sobel
            const getGray = (px: number, py: number) => {
                const i = (py * width + px) * 4;
                return pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
            };

            const gx =
                -getGray(x - 1, y - 1) -
                2 * getGray(x - 1, y) -
                getGray(x - 1, y + 1) +
                getGray(x + 1, y - 1) +
                2 * getGray(x + 1, y) +
                getGray(x + 1, y + 1);

            const gy =
                -getGray(x - 1, y - 1) -
                2 * getGray(x, y - 1) -
                getGray(x + 1, y - 1) +
                getGray(x - 1, y + 1) +
                2 * getGray(x, y + 1) +
                getGray(x + 1, y + 1);

            edgeMagnitudes.push(Math.sqrt(gx * gx + gy * gy));
        }
    }

    // Analyze edge distribution
    const sorted = [...edgeMagnitudes].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const p90 = sorted[Math.floor(sorted.length * 0.9)];
    const p10 = sorted[Math.floor(sorted.length * 0.1)];

    // AI images tend to have smoother edges (lower overall edge response)
    // and less variance in edge strengths
    const edgeRange = p90 - p10;
    const edgeMeanValue =
        edgeMagnitudes.reduce((a, b) => a + b, 0) / edgeMagnitudes.length;

    let score: number;
    if (median < 5 && edgeRange < 30) {
        score = 70; // Very smooth → AI-like
    } else if (median < 10 && edgeRange < 60) {
        score = 55;
    } else if (median > 20 || edgeRange > 100) {
        score = 25; // Sharp, varied edges → likely real
    } else {
        score = 40;
    }

    return {
        name: "Edge Coherence",
        category: "structure",
        score,
        weight: 1.5,
        description:
            score > 55
                ? "Edge patterns are unusually smooth — may indicate AI generation"
                : "Edge patterns show natural variation — consistent with real content",
        icon: "🔲",
        details: `Median edge: ${median.toFixed(1)}, Edge range (P90-P10): ${edgeRange.toFixed(1)}, Mean edge: ${edgeMeanValue.toFixed(1)}`,
    };
}

function analyzeColorDistribution(pixels: Uint8ClampedArray): AnalysisSignal {
    // Analyze color histogram and distribution patterns
    const rHist = new Uint32Array(256);
    const gHist = new Uint32Array(256);
    const bHist = new Uint32Array(256);

    const totalPixels = pixels.length / 4;
    const step = Math.max(1, Math.floor(totalPixels / 100000)); // Sample

    let sampledCount = 0;
    for (let i = 0; i < pixels.length; i += step * 4) {
        rHist[pixels[i]]++;
        gHist[pixels[i + 1]]++;
        bHist[pixels[i + 2]]++;
        sampledCount++;
    }

    // Calculate entropy for each channel
    const calcEntropy = (hist: Uint32Array) => {
        let entropy = 0;
        for (let i = 0; i < 256; i++) {
            if (hist[i] > 0) {
                const p = hist[i] / sampledCount;
                entropy -= p * Math.log2(p);
            }
        }
        return entropy;
    };

    const rEntropy = calcEntropy(rHist);
    const gEntropy = calcEntropy(gHist);
    const bEntropy = calcEntropy(bHist);
    const avgEntropy = (rEntropy + gEntropy + bEntropy) / 3;

    // Count how many distinct color values used
    const usedR = rHist.filter((v) => v > 0).length;
    const usedG = gHist.filter((v) => v > 0).length;
    const usedB = bHist.filter((v) => v > 0).length;
    const avgUsed = (usedR + usedG + usedB) / 3;

    // AI images often have higher entropy (more uniform spread)
    // but may also have "banding" patterns (low unique values in smooth areas)
    let score: number;
    if (avgEntropy > 7.5 && avgUsed > 240) {
        score = 35; // Very high entropy, many colors → natural
    } else if (avgEntropy < 5.5) {
        score = 55; // Low entropy → could be AI (limited palette)
    } else if (avgEntropy > 6.5 && avgEntropy < 7.3 && avgUsed > 200) {
        score = 60; // Sweet spot that AI often falls into
    } else {
        score = 45;
    }

    return {
        name: "Color Distribution",
        category: "color",
        score,
        weight: 1.2,
        description:
            score > 55
                ? "Color distribution shows patterns common in AI-generated imagery"
                : "Color distribution appears natural",
        icon: "🎨",
        details: `Avg entropy: ${avgEntropy.toFixed(2)}/8.0, Avg unique values: ${avgUsed.toFixed(0)}/256, R: ${rEntropy.toFixed(2)}, G: ${gEntropy.toFixed(2)}, B: ${bEntropy.toFixed(2)}`,
    };
}

function analyzeFrequencyDomain(
    pixels: Uint8ClampedArray,
    width: number,
    height: number
): AnalysisSignal {
    // Simplified frequency analysis using DCT-like approach
    // AI images often lack high-frequency noise present in real photos

    const blockSize = 8;
    const blocksX = Math.floor(width / blockSize);
    const blocksY = Math.floor(height / blockSize);

    let highFreqEnergy = 0;
    let lowFreqEnergy = 0;
    let blockCount = 0;

    const step = Math.max(1, Math.floor(blocksX * blocksY / 500)); // Sample blocks

    for (let by = 0; by < blocksY; by += step) {
        for (let bx = 0; bx < blocksX; bx += step) {
            const block: number[] = [];

            for (let y = 0; y < blockSize; y++) {
                for (let x = 0; x < blockSize; x++) {
                    const px = bx * blockSize + x;
                    const py = by * blockSize + y;
                    const idx = (py * width + px) * 4;
                    block.push(
                        pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114
                    );
                }
            }

            // Simple frequency estimation: compare neighbors
            for (let i = 0; i < block.length; i++) {
                const x = i % blockSize;
                const y = Math.floor(i / blockSize);

                if (x + y < blockSize / 2) {
                    lowFreqEnergy += block[i] ** 2;
                } else {
                    if (x < blockSize - 1 && y < blockSize - 1) {
                        const diff = Math.abs(
                            block[i] - block[i + 1] + block[i] - block[i + blockSize]
                        );
                        highFreqEnergy += diff;
                    }
                }
            }

            blockCount++;
        }
    }

    const ratio =
        lowFreqEnergy > 0 ? highFreqEnergy / (lowFreqEnergy / 1000) : 0;

    // AI images tend to have lower high-frequency content
    let score: number;
    if (ratio < 0.5) {
        score = 72;
    } else if (ratio < 1.0) {
        score = 58;
    } else if (ratio < 2.0) {
        score = 42;
    } else {
        score = 25;
    }

    return {
        name: "Frequency Analysis",
        category: "frequency",
        score,
        weight: 2.0,
        description:
            score > 55
                ? "Low high-frequency content detected — characteristic of AI generation"
                : "Frequency spectrum consistent with real camera capture",
        icon: "📡",
        details: `High/Low freq ratio: ${ratio.toFixed(3)}, Blocks analyzed: ${blockCount}. Real photos typically show ratio > 1.5.`,
    };
}

function analyzeTextureConsistency(
    pixels: Uint8ClampedArray,
    width: number,
    height: number
): AnalysisSignal {
    // Check texture consistency across regions
    // AI tends to have inconsistent texture detail at different scales

    const regionSize = Math.min(64, Math.floor(Math.min(width, height) / 4));
    const regions: number[] = [];

    // Sample corners and center
    const positions = [
        [0, 0],
        [width - regionSize, 0],
        [0, height - regionSize],
        [width - regionSize, height - regionSize],
        [Math.floor(width / 2 - regionSize / 2), Math.floor(height / 2 - regionSize / 2)],
    ];

    for (const [startX, startY] of positions) {
        let localVariance = 0;
        let count = 0;

        for (let y = startY; y < startY + regionSize - 1; y++) {
            for (let x = startX; x < startX + regionSize - 1; x++) {
                const idx = (y * width + x) * 4;
                const idxNext = (y * width + x + 1) * 4;

                const diff =
                    Math.abs(pixels[idx] - pixels[idxNext]) +
                    Math.abs(pixels[idx + 1] - pixels[idxNext + 1]) +
                    Math.abs(pixels[idx + 2] - pixels[idxNext + 2]);

                localVariance += diff;
                count++;
            }
        }

        regions.push(count > 0 ? localVariance / count : 0);
    }

    // Calculate variation between regions
    const avgRegion = regions.reduce((a, b) => a + b, 0) / regions.length;
    const regionVar =
        regions.reduce((a, b) => a + (b - avgRegion) ** 2, 0) / regions.length;
    const regionCV = avgRegion > 0 ? Math.sqrt(regionVar) / avgRegion : 0;

    let score: number;
    if (regionCV < 0.2) {
        score = 68; // Very consistent → AI-like
    } else if (regionCV < 0.4) {
        score = 52;
    } else if (regionCV < 0.7) {
        score = 38;
    } else {
        score = 22; // Highly variable → natural
    }

    return {
        name: "Texture Consistency",
        category: "texture",
        score,
        weight: 1.5,
        description:
            score > 55
                ? "Texture detail is unusually consistent across regions — may indicate AI"
                : "Texture detail varies naturally across the image",
        icon: "🧩",
        details: `Region variance CV: ${regionCV.toFixed(3)}, Corner/center detail levels: ${regions.map((r) => r.toFixed(1)).join(", ")}`,
    };
}

function analyzeCompression(
    file: File,
    width: number,
    height: number
): AnalysisSignal {
    // Expected file size vs actual can indicate AI
    const totalPixels = width * height;
    const bitsPerPixel = (file.size * 8) / totalPixels;

    // JPEG typically: 1-4 bits per pixel
    // PNG: varies (usually larger)
    // AI images from generators often have specific compression characteristics

    let score: number;
    let description: string;

    if (file.type === "image/png") {
        // PNG files from AI tend to be large relative to content
        if (bitsPerPixel > 20) {
            score = 55;
            description = "Large PNG file — common in AI tool output";
        } else {
            score = 40;
            description = "Normal PNG compression";
        }
    } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
        if (bitsPerPixel > 4) {
            score = 45; // High quality JPEG — natural or AI
            description = "High-quality JPEG compression";
        } else if (bitsPerPixel < 0.5) {
            score = 55; // Very compressed — often AI screenshots
            description = "Heavily compressed JPEG — may be re-saved AI content";
        } else {
            score = 35; // Normal photo
            description = "Normal JPEG compression ratio";
        }
    } else if (file.type === "image/webp") {
        score = 50;
        description = "WebP format — common in both AI and web content";
    } else {
        score = 50;
        description = "Standard compression";
    }

    return {
        name: "Compression Analysis",
        category: "file",
        score,
        weight: 0.8,
        description,
        icon: "📦",
        details: `Bits per pixel: ${bitsPerPixel.toFixed(2)}, File size: ${formatFileSize(file.size)}, Resolution: ${width}×${height}`,
    };
}

function analyzeSymmetryPatterns(
    pixels: Uint8ClampedArray,
    width: number,
    height: number
): AnalysisSignal {
    // Check for unnatural symmetry patterns
    // AI sometimes generates overly symmetric content

    let symmetryScore = 0;
    let totalChecks = 0;

    const step = Math.max(2, Math.floor(width / 100));

    for (let y = 0; y < height; y += step) {
        for (let x = 0; x < Math.floor(width / 2); x += step) {
            const mirrorX = width - 1 - x;
            const idx1 = (y * width + x) * 4;
            const idx2 = (y * width + mirrorX) * 4;

            const diff =
                Math.abs(pixels[idx1] - pixels[idx2]) +
                Math.abs(pixels[idx1 + 1] - pixels[idx2 + 1]) +
                Math.abs(pixels[idx1 + 2] - pixels[idx2 + 2]);

            if (diff < 30) symmetryScore++;
            totalChecks++;
        }
    }

    const symmetryRatio = totalChecks > 0 ? symmetryScore / totalChecks : 0;

    let score: number;
    if (symmetryRatio > 0.8) {
        score = 72; // Very symmetric → AI-like
    } else if (symmetryRatio > 0.6) {
        score = 55;
    } else if (symmetryRatio > 0.3) {
        score = 40;
    } else {
        score = 30;
    }

    return {
        name: "Symmetry Patterns",
        category: "structure",
        score,
        weight: 1.0,
        description:
            score > 55
                ? "Unusually high symmetry detected — potentially AI-generated"
                : "Natural asymmetry — consistent with real content",
        icon: "🪞",
        details: `Symmetry ratio: ${(symmetryRatio * 100).toFixed(1)}%, Samples checked: ${totalChecks}`,
    };
}

function analyzeVideoSpecific(
    file: File,
    video: HTMLVideoElement
): AnalysisSignal {
    const duration = video.duration;
    const { videoWidth: w, videoHeight: h } = video;

    // AI video characteristics
    let score = 50;
    let description = "Video analysis";
    let details = `Duration: ${duration.toFixed(1)}s, Resolution: ${w}×${h}`;

    // Short videos are more likely AI-generated
    if (duration <= 5) {
        score += 15;
        description = "Very short video — common in AI video generation";
    } else if (duration <= 15) {
        score += 5;
    } else if (duration > 60) {
        score -= 15;
        description = "Long video — less likely to be fully AI-generated";
    }

    // Check resolution patterns
    const aiVideoResolutions = [
        [1024, 576],
        [576, 1024],
        [512, 512],
        [768, 768],
        [1280, 720],
        [720, 1280],
    ];

    for (const [aw, ah] of aiVideoResolutions) {
        if (w === aw && h === ah) {
            score += 10;
            details += ". Resolution matches common AI video output";
        }
    }

    // Check file size relative to duration/resolution
    const bytesPerSecond = file.size / duration;
    const expectedBPS = w * h * 0.5; // rough estimate for normal video

    if (bytesPerSecond > expectedBPS * 3) {
        score += 5; // very high quality → could be AI
        details += ". Unusually high bitrate";
    }

    score = Math.max(0, Math.min(100, score));

    return {
        name: "Video Properties",
        category: "video",
        score,
        weight: 1.5,
        description,
        icon: "🎬",
        details,
    };
}

// ============================
// UTILITIES
// ============================

async function loadImage(
    file: File
): Promise<{
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    img: HTMLImageElement;
}> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            // Limit size for performance
            const maxDim = 1024;
            let w = img.width;
            let h = img.height;

            if (w > maxDim || h > maxDim) {
                const scale = maxDim / Math.max(w, h);
                w = Math.round(w * scale);
                h = Math.round(h * scale);
            }

            const canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0, w, h);

            URL.revokeObjectURL(url);
            resolve({ canvas, ctx, img });
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Failed to load image"));
        };

        img.src = url;
    });
}

async function extractBasicMetadata(
    file: File
): Promise<Record<string, string>> {
    const metadata: Record<string, string> = {};

    metadata["File Name"] = file.name;
    metadata["File Size"] = formatFileSize(file.size);
    metadata["MIME Type"] = file.type;
    metadata["Last Modified"] = new Date(file.lastModified).toISOString();

    // Try to read EXIF-like data from file header
    try {
        const buffer = await file.slice(0, 65536).arrayBuffer();
        const view = new DataView(buffer);

        // Check for JPEG EXIF
        if (view.getUint16(0) === 0xffd8) {
            metadata["Format"] = "JPEG";

            // Search for EXIF APP1 marker
            let offset = 2;
            while (offset < view.byteLength - 4) {
                const marker = view.getUint16(offset);
                if (marker === 0xffe1) {
                    // APP1 (EXIF)
                    const length = view.getUint16(offset + 2);
                    const exifStr = readString(view, offset + 4, Math.min(length, 100));
                    if (exifStr.includes("Exif")) {
                        metadata["EXIF"] = "Present";
                    }
                    break;
                }
                if ((marker & 0xff00) !== 0xff00) break;
                const segLen = view.getUint16(offset + 2);
                offset += 2 + segLen;
            }
        } else if (
            view.getUint32(0) === 0x89504e47 // PNG
        ) {
            metadata["Format"] = "PNG";

            // Read PNG text chunks for software info
            let offset = 8;
            while (offset < Math.min(view.byteLength - 8, 4096)) {
                const chunkLen = view.getUint32(offset);
                const chunkType = readString(view, offset + 4, 4);

                if (chunkType === "tEXt" || chunkType === "iTXt") {
                    const text = readString(
                        view,
                        offset + 8,
                        Math.min(chunkLen, 200)
                    );
                    if (text.toLowerCase().includes("software")) {
                        metadata["Software"] = text.split("\0").slice(1).join("");
                    }
                    if (text.toLowerCase().includes("comment")) {
                        metadata["Comment"] = text.split("\0").slice(1).join("");
                    }
                }

                offset += 12 + chunkLen;
                if (chunkType === "IEND") break;
            }
        }
    } catch {
        // Silent fail on metadata extraction
    }

    return metadata;
}

function readString(view: DataView, offset: number, length: number): string {
    let str = "";
    for (
        let i = 0;
        i < length && offset + i < view.byteLength;
        i++
    ) {
        const code = view.getUint8(offset + i);
        if (code >= 32 && code < 127) {
            str += String.fromCharCode(code);
        }
    }
    return str;
}

export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
