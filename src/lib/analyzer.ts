/**
 * SourceVerify AI Detection Engine v2
 * Main orchestrator — imports and coordinates all signal modules
 *
 * Based on latest research (2024-2025):
 * - SPAI (CVPR 2025): Spectral distribution of real images as invariant pattern
 * - SpAN (ICLR 2026): Training-free detection via spectral artifacts at Nyquist frequencies
 * - Johnson & Farid: Chromatic aberration as physical authenticity marker
 * - Benford's Law analysis for natural image statistics
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

    // Calculate weighted AI score
    const { aiScore, verdict, confidence } = calculateVerdict(signals);

    return { verdict, confidence, aiScore, signals, metadata, processingTimeMs: Math.round(performance.now() - start) };
}

// ============================
// SCORING ENGINE
// ============================

function calculateVerdict(signals: AnalysisSignal[]): { aiScore: number; verdict: "ai" | "real" | "uncertain"; confidence: number } {
    let totalWeight = 0;
    let weightedSum = 0;
    for (const signal of signals) {
        totalWeight += signal.weight;
        weightedSum += signal.score * signal.weight;
    }
    let aiScore = Math.round(totalWeight > 0 ? weightedSum / totalWeight : 50);

    // Peak signal amplification + consensus boost
    let peakBoost = 0;
    let peakPenalty = 0;
    let highCount = 0;
    let lowCount = 0;

    for (const signal of signals) {
        if (signal.score >= 75 && signal.weight >= 1.5) {
            peakBoost = Math.max(peakBoost, (signal.score - 60) * signal.weight * 0.12);
        } else if (signal.score >= 65 && signal.weight >= 2.0) {
            peakBoost = Math.max(peakBoost, (signal.score - 55) * signal.weight * 0.06);
        }
        if (signal.score <= 20 && signal.weight >= 2.0) {
            peakPenalty = Math.max(peakPenalty, (30 - signal.score) * signal.weight * 0.12);
        } else if (signal.score <= 25 && signal.weight >= 1.5) {
            peakPenalty = Math.max(peakPenalty, (35 - signal.score) * signal.weight * 0.06);
        }
        if (signal.score > 52) highCount++;
        if (signal.score < 45) lowCount++;
    }

    // Consensus boost — stronger amplification for multi-signal agreement
    if (highCount >= 7) peakBoost += 15;
    else if (highCount >= 5) peakBoost += 12;
    else if (highCount >= 4) peakBoost += 8;
    else if (highCount >= 3) peakBoost += 4;
    if (lowCount >= 5) peakPenalty += 12;
    else if (lowCount >= 4) peakPenalty += 8;
    else if (lowCount >= 3) peakPenalty += 4;

    aiScore = Math.round(Math.max(5, Math.min(95, aiScore + peakBoost - peakPenalty)));

    let verdict: "ai" | "real" | "uncertain";
    let confidence: number;
    if (aiScore >= 55) {
        verdict = "ai";
        confidence = Math.min(100, Math.round(50 + (aiScore - 55) * 1.12));
    } else if (aiScore <= 35) {
        verdict = "real";
        confidence = Math.min(100, Math.round(50 + (35 - aiScore) * 1.43));
    } else {
        verdict = "uncertain";
        confidence = Math.round(100 - Math.abs(aiScore - 50) * 2);
    }

    return { aiScore, verdict, confidence };
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
                    analyzeVideoSpecific(file, video),
                ];

                resolve({ signals, metadata });
            };
        };
        video.src = url;
    });
}
