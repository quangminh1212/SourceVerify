/**
 * SourceVerify AI Detection Engine v3
 * Main orchestrator — imports and coordinates all 13 signal modules
 *
 * Signal weights calibrated from peer-reviewed research (2024-2025):
 * - SPAI (CVPR 2025): Spectral distribution as invariant pattern (5.5% AUC improvement)
 * - SpAN (ICLR 2026): Training-free detection via spectral artifacts
 * - Johnson & Farid: Chromatic aberration as authenticity marker
 * - Lukas, Fridrich & Goljan (2006): PRNU sensor fingerprint
 * - Bianchi & Piva (2012): DCT block artifact forensics
 * - Ojha et al. (CVPR 2023): Universal fake image detectors
 * - Benford's Law for natural image statistics
 * - Li et al. (2024): DCT coefficient traces in AI images
 * - Zhang et al. (2025): Channel correlation forensics
 *
 * Weight hierarchy (based on discriminative power in literature):
 *   Tier 1 (weight 4.0): Multi-scale Reconstruction — strongest proxy for ELA
 *   Tier 2 (weight 3.5): Noise Residual — shot noise correlation is definitive
 *   Tier 3 (weight 3.0): Metadata — direct evidence when present
 *   Tier 4 (weight 2.5): Edge, Texture, CFA, PRNU — strong structural/sensor signals
 *   Tier 5 (weight 2.0): Spectral, Gradient, DCT, Color — important but more context-dependent
 *   Tier 6 (weight 1.5): Chromatic — physical optics marker
 *   Tier 7 (weight 0.5): Benford — supporting statistical signal
 */

export type { AnalysisResult, AnalysisSignal, FileMetadata } from "./types";
export { formatFileSize } from "./utils";

import type { AnalysisResult, AnalysisSignal, FileMetadata } from "./types";
import { loadImage, extractBasicMetadata, validateFileMagicBytes } from "./utils";
import {
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
} from "./signals";

// ============================
// MAIN ENTRY
// ============================

export async function analyzeMedia(file: File): Promise<AnalysisResult> {
    const start = performance.now();

    // Security: validate file magic bytes match claimed MIME type
    const isValid = await validateFileMagicBytes(file);
    if (!isValid) {
        throw new Error("File content does not match declared type");
    }

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

    // Calculate weighted AI score with advanced verdict engine
    const { aiScore, verdict, confidence } = calculateVerdict(signals);

    return { verdict, confidence, aiScore, signals, metadata, processingTimeMs: Math.round(performance.now() - start) };
}

// ============================
// SCORING ENGINE v3
// ============================

function calculateVerdict(signals: AnalysisSignal[]): { aiScore: number; verdict: "ai" | "real" | "uncertain"; confidence: number } {
    let totalWeight = 0;
    let weightedSum = 0;
    for (const signal of signals) {
        totalWeight += signal.weight;
        weightedSum += signal.score * signal.weight;
    }
    let aiScore = Math.round(totalWeight > 0 ? weightedSum / totalWeight : 50);

    // ============================
    // ADAPTIVE SIGNAL AMPLIFICATION
    // ============================

    // Tier-based amplification: strong signals with extreme values get amplified
    let peakBoost = 0;
    let peakPenalty = 0;
    let highCount = 0; // signals indicating AI
    let lowCount = 0;  // signals indicating real
    let strongHighCount = 0; // strong signals (weight >= 2.5) indicating AI
    let strongLowCount = 0;  // strong signals indicating real

    for (const signal of signals) {
        // AI indicators
        if (signal.score >= 75 && signal.weight >= 2.0) {
            peakBoost = Math.max(peakBoost, (signal.score - 60) * signal.weight * 0.14);
            strongHighCount++;
        } else if (signal.score >= 65 && signal.weight >= 2.5) {
            peakBoost = Math.max(peakBoost, (signal.score - 55) * signal.weight * 0.08);
            strongHighCount++;
        }

        // Real indicators
        if (signal.score <= 20 && signal.weight >= 2.0) {
            peakPenalty = Math.max(peakPenalty, (30 - signal.score) * signal.weight * 0.14);
            strongLowCount++;
        } else if (signal.score <= 25 && signal.weight >= 2.5) {
            peakPenalty = Math.max(peakPenalty, (35 - signal.score) * signal.weight * 0.08);
            strongLowCount++;
        }

        if (signal.score > 55) highCount++;
        if (signal.score < 42) lowCount++;
    }

    // ============================
    // MULTI-SIGNAL CONSENSUS BOOST
    // ============================
    // When many independent signals agree, confidence should increase dramatically
    // This is the key insight from ensemble forensics research

    const totalSignals = signals.length;

    // AI consensus
    if (highCount >= 10) peakBoost += 22;
    else if (highCount >= 8) peakBoost += 18;
    else if (highCount >= 6) peakBoost += 14;
    else if (highCount >= 5) peakBoost += 10;
    else if (highCount >= 4) peakBoost += 6;

    // Real consensus
    if (lowCount >= 8) peakPenalty += 20;
    else if (lowCount >= 6) peakPenalty += 16;
    else if (lowCount >= 5) peakPenalty += 12;
    else if (lowCount >= 4) peakPenalty += 8;
    else if (lowCount >= 3) peakPenalty += 4;

    // Strong signal consensus (weight >= 2.5 signals agreeing)
    if (strongHighCount >= 5) peakBoost += 10;
    else if (strongHighCount >= 3) peakBoost += 5;
    if (strongLowCount >= 5) peakPenalty += 10;
    else if (strongLowCount >= 3) peakPenalty += 5;

    // ============================
    // DEFINITIVE EVIDENCE OVERRIDE
    // ============================
    // Metadata with AI software signature is definitive evidence
    const metadataSignal = signals.find(s => s.nameKey === "signal.metadataAnalysis");
    if (metadataSignal) {
        if (metadataSignal.score >= 90) {
            // AI software detected in metadata — near-definitive
            peakBoost += 20;
        } else if (metadataSignal.score <= 15) {
            // Real camera detected in metadata — near-definitive
            peakPenalty += 20;
        }
    }

    aiScore = Math.round(Math.max(3, Math.min(97, aiScore + peakBoost - peakPenalty)));

    // ============================
    // VERDICT WITH ADAPTIVE THRESHOLDS
    // ============================
    let verdict: "ai" | "real" | "uncertain";
    let confidence: number;

    if (aiScore >= 52) {
        verdict = "ai";
        confidence = Math.min(100, Math.round(50 + (aiScore - 52) * 1.1));
    } else if (aiScore <= 38) {
        verdict = "real";
        confidence = Math.min(100, Math.round(50 + (38 - aiScore) * 1.3));
    } else {
        verdict = "uncertain";
        confidence = Math.round(100 - Math.abs(aiScore - 45) * 3.5);
    }

    return { aiScore, verdict, confidence };
}

// ============================
// IMAGE ANALYSIS (13 signals)
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

    const signals: AnalysisSignal[] = [
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
    ];

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

                const signals: AnalysisSignal[] = [
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
                ];

                resolve({ signals, metadata });
            };
        };
        video.src = url;
    });
}
