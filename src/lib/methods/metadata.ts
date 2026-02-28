/**
 * Signal 1: Metadata Analysis
 * Detects AI generation from file metadata, EXIF data, naming patterns
 * 
 * IMPORTANT: Only counts REAL EXIF/camera fields, not basic file info
 * fields like File Name, File Size, MIME Type, Last Modified, Format.
 */

import type { AnalysisMethod, FileMetadata } from "../types";
import { AI_SOFTWARE_SIGNATURES, REAL_CAMERA_SIGNATURES } from "../constants";

// These are NOT real EXIF fields — they are basic file info added by extractBasicMetadata
const BASIC_FILE_INFO_KEYS = ["File Name", "File Size", "MIME Type", "Last Modified", "Format"];

export function analyzeMetadata(metadata: FileMetadata, exifData: Record<string, string>): AnalysisMethod {
    let score = 50;
    let description = "Metadata analysis inconclusive";
    let details = "";

    const fileName = metadata.fileName.toLowerCase();
    const allValues = Object.values(exifData).join(" ").toLowerCase();

    // === DEFINITIVE EVIDENCE ===

    // AI software signature found
    for (const sig of AI_SOFTWARE_SIGNATURES) {
        if (fileName.includes(sig) || allValues.includes(sig)) {
            score = 95;
            description = `AI generation software detected: "${sig}"`;
            details = `Found "${sig}" in file metadata.`;
            break;
        }
    }

    // Real camera model found
    if (score === 50) {
        for (const cam of REAL_CAMERA_SIGNATURES) {
            if (allValues.includes(cam)) {
                score = 10;
                description = `Real camera detected: "${cam}"`;
                details = `Camera signature "${cam}" found in metadata.`;
                break;
            }
        }
    }

    // Count REAL EXIF fields only (exclude basic file info)
    if (score === 50) {
        const realExifKeys = Object.keys(exifData).filter(k => !BASIC_FILE_INFO_KEYS.includes(k));
        const realExifCount = realExifKeys.length;

        if (realExifCount >= 3) {
            score = 18;
            details += ` Rich EXIF data (${realExifCount} camera fields) — likely real camera.`;
        } else if (realExifCount >= 1) {
            score = 35;
            details += ` Some EXIF (${realExifCount} fields).`;
        }
        // realExifCount === 0 → keep neutral at 50
        // Web images (both real and AI) typically lack camera EXIF
    }

    const descriptionKey = score >= 90 ? "signal.metadata.aiDetected"
        : score <= 20 ? "signal.metadata.cameraDetected"
            : "signal.metadata.inconclusive";

    return {
        name: "Metadata Analysis", nameKey: "signal.metadataAnalysis",
        category: "metadata", score, weight: 1.5,
        description, descriptionKey, icon: "◎", details,
    };
}
