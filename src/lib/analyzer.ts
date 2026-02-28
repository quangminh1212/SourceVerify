/**
 * SourceVerify AI Detection Engine v6
 * Main orchestrator — imports and coordinates all 43 analysis methods
 *
 * Terminology: "method" = phương pháp phân tích (analysis method)
 * Each method analyzes a specific aspect of the image and returns a result with a score.
 *
 * v6 Changes:
 * - Added 30 new forensic methods (total 43) from peer-reviewed research
 * - Categories: spatial, frequency, statistical, compression, generative, geometric, color
 * - New methods have lower weights (0.3-0.6) to supplement rather than dominate existing methods
 * - Verdict engine unchanged — thresholds calibrated from v5.1
 */

export type { AnalysisResult, AnalysisMethod, FileMetadata } from "./types";
/** @deprecated Use AnalysisMethod instead */
export type { AnalysisMethod as AnalysisSignal } from "./types";
export { formatFileSize } from "./utils";

import type { AnalysisResult, AnalysisMethod, FileMetadata } from "./types";
import { loadImage, extractBasicMetadata, validateFileMagicBytes } from "./utils";
import {
    // Original 13 methods
    analyzeMetadata,
    analyzeSpectralNyquist,
    analyzeMultiscaleReconstruction,
    analyzeNoiseResidual,
    analyzeEdgeCoherence,
    analyzeGradientMicroTexture,
    analyzeBenfordsLaw,
    analyzeChromaticAberration,
    analyzeTextureConsistency,
    analyzeCFAPattern,
    analyzeVideoSpecific,
    analyzeDCTBlockArtifacts,
    analyzeColorChannelCorrelation,
    analyzePRNUPattern,
    // New: Spatial Domain (6)
    analyzeLocalBinaryPattern,
    analyzeHOGAnomaly,
    analyzeGLCM,
    analyzeLocalVarianceMap,
    analyzeMorphologicalGradient,
    analyzeWeberDescriptor,
    // New: Frequency Domain (6)
    analyzeWaveletStatistics,
    analyzeGaborResponse,
    analyzePowerSpectralDensity,
    analyzePhaseCongruency,
    analyzeRadialSpectrum,
    analyzeFrequencyBandRatio,
    // New: Statistical (6)
    analyzeEntropyMap,
    analyzeHigherOrderStatistics,
    analyzeZipfLaw,
    analyzeChiSquareUniformity,
    analyzeMarkovTransition,
    analyzeSaturationDistribution,
    // New: Compression (4)
    analyzeJPEGGhost,
    analyzeQuantizationFingerprint,
    analyzeErrorLevel,
    analyzeColorBanding,
    // New: Generative (3)
    analyzeGANFingerprint,
    analyzeUpsamplingArtifact,
    analyzeDiffusionArtifact,
    // New: Geometric (3)
    analyzePerspectiveConsistency,
    analyzeLightingConsistency,
    analyzeShadowConsistency,
    // New: Advanced Color (2)
    analyzeColorGamut,
    analyzeWhiteBalance,
} from "./methods";

// ============================
// MAIN ENTRY
// ============================

export async function analyzeMedia(file: File, enabledMethods?: string[]): Promise<AnalysisResult> {
    const start = performance.now();

    // Security: validate file magic bytes match claimed MIME type
    const isValid = await validateFileMagicBytes(file);
    if (!isValid) {
        throw new Error("File content does not match declared type");
    }

    const isVideo = file.type.startsWith("video/");

    let methods: AnalysisMethod[];
    let metadata: FileMetadata;

    if (isVideo) {
        const result = await analyzeVideoFile(file, enabledMethods);
        methods = result.methods;
        metadata = result.metadata;
    } else {
        const result = await analyzeImageFile(file, enabledMethods);
        methods = result.methods;
        metadata = result.metadata;
    }

    // Calculate weighted AI score with advanced verdict engine
    const { aiScore, verdict, confidence } = calculateVerdict(methods);

    // Backward compat: provide both 'methods' and deprecated 'signals'
    return { verdict, confidence, aiScore, methods, signals: methods, metadata, processingTimeMs: Math.round(performance.now() - start) };
}

// ============================
// SCORING ENGINE v4
// ============================

function calculateVerdict(methods: AnalysisMethod[]): { aiScore: number; verdict: "ai" | "real" | "uncertain"; confidence: number } {
    // Step 1: Weighted average as baseline
    let totalWeight = 0;
    let weightedSum = 0;
    for (const method of methods) {
        totalWeight += method.weight;
        weightedSum += method.score * method.weight;
    }
    let aiScore = Math.round(totalWeight > 0 ? weightedSum / totalWeight : 50);

    // Step 2: Count method agreement (v4 thresholds, proven better recall)
    let aiLeaningWeight = 0;
    let realLeaningWeight = 0;
    let strongAI = 0;
    let strongReal = 0;
    let veryStrongAI = 0;
    let veryStrongReal = 0;

    for (const method of methods) {
        if (method.score > 50) aiLeaningWeight += method.weight;
        if (method.score < 50) realLeaningWeight += method.weight;
        if (method.score >= 65) strongAI++;
        if (method.score <= 35) strongReal++;
        if (method.score >= 78) veryStrongAI++;
        if (method.score <= 22) veryStrongReal++;
    }

    // Step 3: Consensus amplification (v4 power, proven with benchmark)
    let adjustment = 0;

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

    // Weighted majority vote (v4 strength)
    const weightRatio = totalWeight > 0
        ? (aiLeaningWeight - realLeaningWeight) / totalWeight
        : 0;
    adjustment += Math.round(weightRatio * 14);

    // Step 4: Directional amplification (v4 strength)
    const deviation = aiScore - 50;
    if (Math.abs(deviation) > 1) {
        const linear = deviation * 1.1;
        const quadratic = Math.sign(deviation) * (deviation * deviation) * 0.025;
        adjustment += Math.round(linear + quadratic);
    }

    // Step 5: Metadata definitive override
    const metadataMethod = methods.find(s => s.nameKey === "signal.metadataAnalysis");
    if (metadataMethod) {
        if (metadataMethod.score >= 90) adjustment += 25;
        else if (metadataMethod.score <= 15) adjustment -= 25;
    }

    // Step 5b: Anti-FP guard (v5: stronger)
    let heavyRealCount = 0;
    let heavyAICount = 0;
    for (const method of methods) {
        if (method.weight >= 3.0) {
            if (method.score < 40) heavyRealCount++;
            if (method.score > 60) heavyAICount++;
        }
    }
    if (heavyRealCount >= 2 && heavyAICount === 0 && aiScore + adjustment > 50) {
        adjustment -= 5;
    }

    aiScore = Math.round(Math.max(3, Math.min(97, aiScore + adjustment)));

    // Step 6: Verdict (v5.1: threshold 55/40 — best balance from benchmark)
    let verdict: "ai" | "real" | "uncertain";
    let confidence: number;

    if (aiScore >= 55) {
        verdict = "ai";
        confidence = Math.min(100, Math.round(50 + (aiScore - 55) * 1.1));
    } else if (aiScore <= 40) {
        verdict = "real";
        confidence = Math.min(100, Math.round(50 + (40 - aiScore) * 1.3));
    } else {
        verdict = "uncertain";
        confidence = Math.round(100 - Math.abs(aiScore - 47) * 6);
    }

    return { aiScore, verdict, confidence };

}

// ============================
// IMAGE ANALYSIS (43 methods)
// ============================

// Method ID → nameKey mapping
const METHOD_MAP: Record<string, string> = {
    // Original 13
    metadata: "signal.metadataAnalysis",
    spectral: "signal.spectralNyquist",
    reconstruction: "signal.multiScaleReconstruction",
    noise: "signal.noiseResidual",
    edge: "signal.edgeCoherence",
    gradient: "signal.gradientSmoothness",
    benford: "signal.benfordsLaw",
    chromatic: "signal.chromaticAberration",
    texture: "signal.textureConsistency",
    cfa: "signal.cfaPattern",
    dct: "signal.dctBlock",
    color: "signal.colorCorrelation",
    prnu: "signal.prnuPattern",
    // Spatial Domain (6)
    lbp: "signal.localBinaryPattern",
    hog: "signal.hogAnomaly",
    glcm: "signal.glcmTexture",
    localVariance: "signal.localVarianceMap",
    morphGradient: "signal.morphGradient",
    weber: "signal.weberDescriptor",
    // Frequency Domain (6)
    wavelet: "signal.waveletStats",
    gabor: "signal.gaborResponse",
    psd: "signal.psdSlope",
    phase: "signal.phaseCongruency",
    radial: "signal.radialSpectrum",
    freqBand: "signal.freqBandRatio",
    // Statistical (6)
    entropy: "signal.entropyMap",
    hos: "signal.higherOrderStats",
    zipf: "signal.zipfLaw",
    chiSquare: "signal.chiSquareUniformity",
    markov: "signal.markovTransition",
    saturation: "signal.saturationDist",
    // Compression (4)
    jpegGhost: "signal.jpegGhost",
    quantization: "signal.quantFingerprint",
    ela: "signal.errorLevel",
    banding: "signal.colorBanding",
    // Generative (3)
    ganFingerprint: "signal.ganFingerprint",
    upsampling: "signal.upsamplingArtifact",
    diffusion: "signal.diffusionArtifact",
    // Geometric (3)
    perspective: "signal.perspectiveConsistency",
    lighting: "signal.lightingConsistency",
    shadow: "signal.shadowConsistency",
    // Advanced Color (2)
    gamut: "signal.colorGamut",
    whiteBalance: "signal.whiteBalance",
};

export const ALL_METHOD_IDS = Object.keys(METHOD_MAP);
/** @deprecated Use ALL_METHOD_IDS instead */
export const ALL_SIGNAL_IDS = ALL_METHOD_IDS;

async function analyzeImageFile(file: File, enabledMethods?: string[]): Promise<{ methods: AnalysisMethod[]; metadata: FileMetadata }> {
    const { canvas, ctx } = await loadImage(file);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const w = canvas.width, h = canvas.height;

    const exifData = await extractBasicMetadata(file);
    const metadata: FileMetadata = {
        fileName: file.name, fileSize: file.size, fileType: file.type,
        width: w, height: h, isVideo: false, exifData,
    };

    const enabled = new Set(enabledMethods || ALL_METHOD_IDS);

    const allMethods: AnalysisMethod[] = [
        // Original 13
        analyzeMetadata(metadata, exifData),
        analyzeSpectralNyquist(pixels, w, h),
        await analyzeMultiscaleReconstruction(canvas, ctx),
        analyzeNoiseResidual(pixels, w, h),
        analyzeEdgeCoherence(pixels, w, h),
        analyzeGradientMicroTexture(pixels, w, h),
        analyzeBenfordsLaw(pixels, w, h),
        analyzeChromaticAberration(pixels, w, h),
        analyzeTextureConsistency(pixels, w, h),
        analyzeCFAPattern(pixels, w, h),
        analyzeDCTBlockArtifacts(pixels, w, h),
        analyzeColorChannelCorrelation(pixels, w, h),
        analyzePRNUPattern(pixels, w, h),
        // Spatial Domain (6)
        analyzeLocalBinaryPattern(pixels, w, h),
        analyzeHOGAnomaly(pixels, w, h),
        analyzeGLCM(pixels, w, h),
        analyzeLocalVarianceMap(pixels, w, h),
        analyzeMorphologicalGradient(pixels, w, h),
        analyzeWeberDescriptor(pixels, w, h),
        // Frequency Domain (6)
        analyzeWaveletStatistics(pixels, w, h),
        analyzeGaborResponse(pixels, w, h),
        analyzePowerSpectralDensity(pixels, w, h),
        analyzePhaseCongruency(pixels, w, h),
        analyzeRadialSpectrum(pixels, w, h),
        analyzeFrequencyBandRatio(pixels, w, h),
        // Statistical (6)
        analyzeEntropyMap(pixels, w, h),
        analyzeHigherOrderStatistics(pixels, w, h),
        analyzeZipfLaw(pixels, w, h),
        analyzeChiSquareUniformity(pixels, w, h),
        analyzeMarkovTransition(pixels, w, h),
        analyzeSaturationDistribution(pixels, w, h),
        // Compression (4)
        analyzeJPEGGhost(pixels, w, h),
        analyzeQuantizationFingerprint(pixels, w, h),
        analyzeErrorLevel(pixels, w, h),
        analyzeColorBanding(pixels, w, h),
        // Generative (3)
        analyzeGANFingerprint(pixels, w, h),
        analyzeUpsamplingArtifact(pixels, w, h),
        analyzeDiffusionArtifact(pixels, w, h),
        // Geometric (3)
        analyzePerspectiveConsistency(pixels, w, h),
        analyzeLightingConsistency(pixels, w, h),
        analyzeShadowConsistency(pixels, w, h),
        // Advanced Color (2)
        analyzeColorGamut(pixels, w, h),
        analyzeWhiteBalance(pixels, w, h),
    ];

    // Filter methods based on enabled set
    const methods = allMethods.filter(s => {
        for (const [id, nameKey] of Object.entries(METHOD_MAP)) {
            if (s.nameKey === nameKey && enabled.has(id)) return true;
        }
        return false;
    });

    return { methods, metadata };
}

// ============================
// VIDEO ANALYSIS
// ============================

async function analyzeVideoFile(file: File, enabledMethods?: string[]): Promise<{ methods: AnalysisMethod[]; metadata: FileMetadata }> {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    const enabled = new Set(enabledMethods || ALL_METHOD_IDS);

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

                const allMethods: AnalysisMethod[] = [
                    // Original 13 (without CFA for video)
                    analyzeMetadata(metadata, exifData),
                    analyzeSpectralNyquist(pixels, w, h),
                    await analyzeMultiscaleReconstruction(canvas, ctx),
                    analyzeNoiseResidual(pixels, w, h),
                    analyzeEdgeCoherence(pixels, w, h),
                    analyzeGradientMicroTexture(pixels, w, h),
                    analyzeBenfordsLaw(pixels, w, h),
                    analyzeChromaticAberration(pixels, w, h),
                    analyzeTextureConsistency(pixels, w, h),
                    analyzeDCTBlockArtifacts(pixels, w, h),
                    analyzeColorChannelCorrelation(pixels, w, h),
                    analyzePRNUPattern(pixels, w, h),
                    analyzeVideoSpecific(file, video),
                    // Spatial Domain (6)
                    analyzeLocalBinaryPattern(pixels, w, h),
                    analyzeHOGAnomaly(pixels, w, h),
                    analyzeGLCM(pixels, w, h),
                    analyzeLocalVarianceMap(pixels, w, h),
                    analyzeMorphologicalGradient(pixels, w, h),
                    analyzeWeberDescriptor(pixels, w, h),
                    // Frequency Domain (6)
                    analyzeWaveletStatistics(pixels, w, h),
                    analyzeGaborResponse(pixels, w, h),
                    analyzePowerSpectralDensity(pixels, w, h),
                    analyzePhaseCongruency(pixels, w, h),
                    analyzeRadialSpectrum(pixels, w, h),
                    analyzeFrequencyBandRatio(pixels, w, h),
                    // Statistical (6)
                    analyzeEntropyMap(pixels, w, h),
                    analyzeHigherOrderStatistics(pixels, w, h),
                    analyzeZipfLaw(pixels, w, h),
                    analyzeChiSquareUniformity(pixels, w, h),
                    analyzeMarkovTransition(pixels, w, h),
                    analyzeSaturationDistribution(pixels, w, h),
                    // Compression (4)
                    analyzeJPEGGhost(pixels, w, h),
                    analyzeQuantizationFingerprint(pixels, w, h),
                    analyzeErrorLevel(pixels, w, h),
                    analyzeColorBanding(pixels, w, h),
                    // Generative (3)
                    analyzeGANFingerprint(pixels, w, h),
                    analyzeUpsamplingArtifact(pixels, w, h),
                    analyzeDiffusionArtifact(pixels, w, h),
                    // Geometric (3)
                    analyzePerspectiveConsistency(pixels, w, h),
                    analyzeLightingConsistency(pixels, w, h),
                    analyzeShadowConsistency(pixels, w, h),
                    // Advanced Color (2)
                    analyzeColorGamut(pixels, w, h),
                    analyzeWhiteBalance(pixels, w, h),
                ];

                const methods = allMethods.filter(s => {
                    if (s.nameKey === "signal.videoProperties") return true; // always include video method
                    for (const [id, nameKey] of Object.entries(METHOD_MAP)) {
                        if (s.nameKey === nameKey && enabled.has(id)) return true;
                    }
                    return false;
                });

                resolve({ methods, metadata });
            };
        };
        video.src = url;
    });
}
