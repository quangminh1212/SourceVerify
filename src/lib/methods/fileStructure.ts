/**
 * File Structure Analysis
 * Analyzes file header structure, encoding patterns, and metadata organization
 * to detect AI-generated images based on file-level characteristics.
 */

import type { AnalysisMethod, FileMetadata } from "../types";

export function analyzeFileStructure(metadata: FileMetadata, _exifData: Record<string, string>): AnalysisMethod {
    let score = 50;
    let details = "";

    const fileName = metadata.fileName.toLowerCase();
    const fileSize = metadata.fileSize;
    const width = metadata.width;
    const height = metadata.height;

    // 1. File naming pattern analysis
    // AI tools commonly generate UUID/hash-based names
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
    const hashPattern = /^[0-9a-f]{16,64}\./;
    const aiNamingPattern = /^(image|output|result|generated|sample|img)[\s_-]?\d+/;
    const comfyPattern = /^comfyui/;
    const sdPattern = /^(txt2img|img2img)/;

    if (uuidPattern.test(fileName) || hashPattern.test(fileName)) {
        score += 8;
        details += "UUID/hash-based filename — common with AI pipelines. ";
    }
    if (aiNamingPattern.test(fileName) || comfyPattern.test(fileName) || sdPattern.test(fileName)) {
        score += 15;
        details += "AI-typical naming pattern detected. ";
    }

    // 2. Resolution analysis — AI models have preferred output sizes
    const aiResolutions = [
        [512, 512], [768, 768], [1024, 1024], [1024, 576], [576, 1024],
        [1024, 768], [768, 1024], [1280, 768], [768, 1280],
        [2048, 2048], [1920, 1080], [1080, 1920],
    ];

    const isAiResolution = aiResolutions.some(([w, h]) =>
        (width === w && height === h));
    if (isAiResolution) {
        score += 10;
        details += `Resolution ${width}×${height} matches common AI output size. `;
    }

    // 3. Aspect ratio analysis — typical AI ratios
    const ratio = width / height;
    const aiRatios = [1, 4 / 3, 3 / 4, 16 / 9, 9 / 16, 3 / 2, 2 / 3];
    const isExactRatio = aiRatios.some(r => Math.abs(ratio - r) < 0.001);
    if (isExactRatio) {
        score += 3;
        details += `Exact standard aspect ratio (${ratio.toFixed(3)}) — common for AI. `;
    }

    // 4. File size vs resolution ratio (bytes per pixel)
    const totalPixels = width * height;
    if (totalPixels > 0) {
        const bytesPerPixel = fileSize / totalPixels;
        if (bytesPerPixel < 0.3) {
            score += 5;
            details += `Low bytes/pixel ratio (${bytesPerPixel.toFixed(2)}) — heavy compression or AI generation. `;
        } else if (bytesPerPixel > 3) {
            score -= 10;
            details += `High bytes/pixel ratio (${bytesPerPixel.toFixed(2)}) — raw/professional capture. `;
        }
    }

    // 5. Camera naming patterns (reduce score for camera-generated names)
    const cameraPattern = /^(dsc|img|p|dscn|dscf|sam|imgp|_mg)[\s_]?\d+/i;
    if (cameraPattern.test(fileName)) {
        score -= 15;
        details += "Camera-typical filename pattern detected. ";
    }

    score = Math.max(5, Math.min(95, score));

    const descriptionKey = score >= 55 ? "signal.fileStructure.ai"
        : score <= 35 ? "signal.fileStructure.real"
            : "signal.fileStructure.inconclusive";

    return {
        name: "File Structure Analysis", nameKey: "signal.fileStructure",
        category: "metadata", score, weight: 0.25,
        description: score >= 55
            ? "File structure patterns suggest AI-generated or synthetic origin"
            : score <= 35
                ? "File structure consistent with authentic camera capture"
                : "File structure analysis inconclusive",
        descriptionKey, icon: "📁", details,
    };
}
