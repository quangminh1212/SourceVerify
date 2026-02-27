/**
 * SourceVerify AI Detection Engine v5
 * Main orchestrator — imports and coordinates all 13 signal modules
 *
 * v5 Changes (calibrated against 2000-image benchmark):
 * - Raised signal agreement thresholds (strongAI >= 70, veryStrong >= 82)
 * - Reduced directional amplification (1.1→0.5, quadratic 0.025→0.008)
 * - Reduced weighted majority coefficient (14→8)
 * - Widened verdict thresholds: AI >= 56, Real <= 44 (from 50/46)
 * - Stronger anti-FP guard (-5 instead of -3)
 * - Reduced weights: CFA 2.5→1.5, DCT 3.0→2.0, Chromatic 1.0→0.5
 * - Conservative approach: prioritize reducing false positives on web images
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
// SCORING ENGINE v4
// ============================

function calculateVerdict(signals: AnalysisSignal[]): { aiScore: number; verdict: "ai" | "real" | "uncertain"; confidence: number } {
    // Step 1: Weighted average as baseline
    let totalWeight = 0;
    let weightedSum = 0;
    for (const signal of signals) {
        totalWeight += signal.weight;
        weightedSum += signal.score * signal.weight;
    }
    let aiScore = Math.round(totalWeight > 0 ? weightedSum / totalWeight : 50);

    // Step 2: Count signal agreement (v5: raised thresholds)
    let aiLeaningWeight = 0;
    let realLeaningWeight = 0;
    let strongAI = 0;
    let strongReal = 0;
    let veryStrongAI = 0;
    let veryStrongReal = 0;

    for (const signal of signals) {
        if (signal.score > 55) aiLeaningWeight += signal.weight;
        if (signal.score < 45) realLeaningWeight += signal.weight;
        if (signal.score >= 70) strongAI++;
        if (signal.score <= 30) strongReal++;
        if (signal.score >= 82) veryStrongAI++;
        if (signal.score <= 18) veryStrongReal++;
    }

    // Step 3: Consensus amplification (v5: more conservative)
    let adjustment = 0;

    if (veryStrongAI >= 4) adjustment += 12;
    else if (strongAI >= 6) adjustment += 10;
    else if (strongAI >= 4) adjustment += 6;
    else if (strongAI >= 2) adjustment += 3;

    if (veryStrongReal >= 4) adjustment -= 12;
    else if (strongReal >= 6) adjustment -= 10;
    else if (strongReal >= 4) adjustment -= 6;
    else if (strongReal >= 2) adjustment -= 3;

    // Weighted majority vote (v5: reduced from 14 to 8)
    const weightRatio = totalWeight > 0
        ? (aiLeaningWeight - realLeaningWeight) / totalWeight
        : 0;
    adjustment += Math.round(weightRatio * 8);

    // Step 4: Directional amplification (v5: much weaker)
    const deviation = aiScore - 50;
    if (Math.abs(deviation) > 3) {
        const linear = deviation * 0.5;
        const quadratic = Math.sign(deviation) * (deviation * deviation) * 0.008;
        adjustment += Math.round(linear + quadratic);
    }

    // Step 5: Metadata definitive override
    const metadataSignal = signals.find(s => s.nameKey === "signal.metadataAnalysis");
    if (metadataSignal) {
        if (metadataSignal.score >= 90) adjustment += 25;
        else if (metadataSignal.score <= 15) adjustment -= 25;
    }

    // Step 5b: Anti-FP guard (v5: stronger)
    let heavyRealCount = 0;
    let heavyAICount = 0;
    for (const signal of signals) {
        if (signal.weight >= 3.0) {
            if (signal.score < 40) heavyRealCount++;
            if (signal.score > 60) heavyAICount++;
        }
    }
    if (heavyRealCount >= 2 && heavyAICount === 0 && aiScore + adjustment > 50) {
        adjustment -= 5;
    }

    aiScore = Math.round(Math.max(3, Math.min(97, aiScore + adjustment)));

    // Step 6: Verdict (v5: widened thresholds)
    let verdict: "ai" | "real" | "uncertain";
    let confidence: number;

    if (aiScore >= 56) {
        verdict = "ai";
        confidence = Math.min(100, Math.round(50 + (aiScore - 56) * 1.1));
    } else if (aiScore <= 44) {
        verdict = "real";
        confidence = Math.min(100, Math.round(50 + (44 - aiScore) * 1.1));
    } else {
        verdict = "uncertain";
        confidence = Math.round(100 - Math.abs(aiScore - 50) * 6);
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
