/**
 * Resolution Consistency Analysis
 * Analyzes DPI/resolution metadata vs actual pixel dimensions,
 * EXIF image size declarations, and resolution patterns typical of AI models.
 */

import type { AnalysisMethod, FileMetadata } from "../../types";

const AI_MODEL_RESOLUTIONS: [number, number][] = [
    [512, 512], [768, 768], [1024, 1024], [2048, 2048],
    [512, 768], [768, 512], [768, 1024], [1024, 768],
    [1024, 576], [576, 1024], [1280, 768], [768, 1280],
    [1536, 1024], [1024, 1536], [1792, 1024], [1024, 1792],
];

export function analyzeResolutionConsistency(metadata: FileMetadata, exifData: Record<string, string>): AnalysisMethod {
    let score = 50;
    let details = "";

    const width = metadata.width;
    const height = metadata.height;

    // 1. Check for AI model resolution matches
    const isAiResolution = AI_MODEL_RESOLUTIONS.some(([w, h]) =>
        (width === w && height === h) || (width === h && height === w));

    if (isAiResolution) {
        score += 15;
        details += `Resolution ${width}×${height} matches known AI model output size. `;
    }

    // 2. Check DPI metadata vs actual resolution
    const xRes = findResolution(exifData, "x");
    const yRes = findResolution(exifData, "y");

    if (xRes && yRes) {
        if (xRes !== yRes) {
            score += 8;
            details += `Non-square DPI (${xRes}×${yRes}) — unusual, possible metadata tampering. `;
        } else if (xRes === 72 || xRes === 96) {
            score += 3;
            details += `Standard screen DPI (${xRes}) — common for web/AI images. `;
        } else if (xRes === 300 || xRes === 240) {
            score -= 10;
            details += `Print-quality DPI (${xRes}) — typical of professional photography. `;
        }
    }

    // 3. Check ExifImageWidth/Height vs actual dimensions
    const exifWidth = parseInt(exifData["ExifImageWidth"] || exifData["Exif Image Width"] || "0");
    const exifHeight = parseInt(exifData["ExifImageHeight"] || exifData["Exif Image Height"] || "0");

    if (exifWidth > 0 && exifHeight > 0) {
        if (exifWidth !== width || exifHeight !== height) {
            score += 12;
            details += `EXIF dimensions (${exifWidth}×${exifHeight}) differ from actual (${width}×${height}) — possible resize/crop. `;
        } else {
            score -= 5;
            details += "EXIF dimensions match actual pixel dimensions. ";
        }
    }

    // 4. Check if dimensions are powers of 2 or multiples of 64
    const w64 = width % 64 === 0;
    const h64 = height % 64 === 0;
    if (w64 && h64) {
        score += 5;
        details += "Dimensions are multiples of 64 — typical for AI model outputs. ";
    }

    // 5. Unusual megapixel counts for cameras
    const megapixels = (width * height) / 1e6;
    if (megapixels > 50) {
        score -= 8;
        details += `High megapixel count (${megapixels.toFixed(1)} MP) — professional camera. `;
    }

    score = Math.max(5, Math.min(95, score));

    const descriptionKey = score >= 55 ? "signal.resolutionConsistency.ai"
        : score <= 35 ? "signal.resolutionConsistency.real"
            : "signal.resolutionConsistency.inconclusive";

    return {
        name: "Resolution Consistency", nameKey: "signal.resolutionConsistency",
        category: "metadata", score, weight: 0.2,
        description: score >= 55
            ? "Resolution patterns consistent with AI model output"
            : score <= 35
                ? "Resolution characteristics suggest authentic camera capture"
                : "Resolution consistency analysis inconclusive",
        descriptionKey, icon: "📐", details,
    };
}

function findResolution(exifData: Record<string, string>, axis: "x" | "y"): number | null {
    const patterns = axis === "x"
        ? ["XResolution", "X Resolution", "X-Resolution"]
        : ["YResolution", "Y Resolution", "Y-Resolution"];

    for (const p of patterns) {
        for (const [key, val] of Object.entries(exifData)) {
            if (key.toLowerCase().replace(/[\s_-]/g, "") === p.toLowerCase().replace(/[\s_-]/g, "")) {
                return parseInt(val);
            }
        }
    }
    return null;
}
