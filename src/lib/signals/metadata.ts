/**
 * Signal 1: Metadata Analysis
 * Detects AI generation from file metadata, EXIF data, naming patterns,
 * and resolution matching
 */

import type { AnalysisSignal, FileMetadata } from "../types";
import { AI_SOFTWARE_SIGNATURES, REAL_CAMERA_SIGNATURES, TYPICAL_AI_RESOLUTIONS } from "../constants";

export function analyzeMetadata(metadata: FileMetadata, exifData: Record<string, string>): AnalysisSignal {
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

    for (const [rw, rh] of TYPICAL_AI_RESOLUTIONS) {
        if (metadata.width === rw && metadata.height === rh) {
            score = Math.max(score, 75);
            details += ` Resolution ${rw}×${rh} matches typical AI output.`;
        }
    }

    // Square aspect ratio heuristic
    if (metadata.width === metadata.height) {
        const isPow2 = (n: number) => n > 0 && (n & (n - 1)) === 0;
        if (isPow2(metadata.width) || [768, 1536].includes(metadata.width)) {
            score = Math.max(score, 74);
            details += ` Square ${metadata.width}×${metadata.height} power-of-2 — typical AI output.`;
        } else if (metadata.width >= 512) {
            score = Math.max(score, 65);
            details += ` Square ${metadata.width}×${metadata.height} — unusual for real cameras.`;
        }
    }

    // EXIF richness — strong indicator
    const exifKeys = Object.keys(exifData).length;
    if (exifKeys >= 5) {
        score = Math.min(score, 30);
        details += ` Rich EXIF data (${exifKeys} fields) — likely real camera.`;
    } else if (exifKeys <= 1) {
        score = Math.max(score, 66);
        details += ` Minimal EXIF — AI images typically lack metadata.`;
    } else if (exifKeys <= 3 && score >= 40) {
        score = Math.max(score, 60);
        details += ` Sparse EXIF (${exifKeys} fields) — not typical of real cameras.`;
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
