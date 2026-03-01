/**
 * EXIF Integrity Validation
 * Checks for structural anomalies, missing mandatory fields, and inconsistencies
 * in EXIF data that indicate AI generation or post-processing tampering.
 */

import type { AnalysisMethod, FileMetadata } from "../types";

const MANDATORY_CAMERA_FIELDS = [
    "Make", "Model", "ExifVersion", "DateTimeOriginal",
    "FocalLength", "ExposureTime", "FNumber", "ISOSpeedRatings",
];

const BASIC_FILE_INFO_KEYS = ["File Name", "File Size", "MIME Type", "Last Modified", "Format"];

export function analyzeExifIntegrity(metadata: FileMetadata, exifData: Record<string, string>): AnalysisMethod {
    let score = 50;
    let details = "";

    const realExifKeys = Object.keys(exifData).filter(k => !BASIC_FILE_INFO_KEYS.includes(k));

    // Check mandatory EXIF fields presence
    let presentCount = 0;
    const missingFields: string[] = [];
    for (const field of MANDATORY_CAMERA_FIELDS) {
        const found = realExifKeys.some(k => k.toLowerCase().includes(field.toLowerCase()));
        if (found) presentCount++;
        else missingFields.push(field);
    }

    const integrityRatio = presentCount / MANDATORY_CAMERA_FIELDS.length;

    // Check for field value consistency
    let hasInconsistency = false;

    // Check if DateTimeOriginal is before DateTimeDigitized
    const dateOriginal = exifData["DateTimeOriginal"] || exifData["Date/Time Original"];
    const dateDigitized = exifData["DateTimeDigitized"] || exifData["Date/Time Digitized"];
    if (dateOriginal && dateDigitized) {
        if (new Date(dateOriginal) > new Date(dateDigitized)) {
            hasInconsistency = true;
            details += "Timestamp inconsistency: original date after digitized date. ";
        }
    }

    // Check for unusual ExifVersion values
    const exifVersion = exifData["ExifVersion"] || exifData["Exif Version"];
    if (exifVersion && !["0220", "0221", "0230", "0231", "0232", "2.2", "2.21", "2.3", "2.31", "2.32"].some(v => exifVersion.includes(v))) {
        hasInconsistency = true;
        details += `Unusual EXIF version: ${exifVersion}. `;
    }

    // Scoring logic
    if (integrityRatio >= 0.75) {
        score = 15; // Rich, complete EXIF → likely real
        details += `EXIF integrity high: ${presentCount}/${MANDATORY_CAMERA_FIELDS.length} mandatory fields present. `;
    } else if (integrityRatio >= 0.5) {
        score = 30;
        details += `Partial EXIF data: ${presentCount}/${MANDATORY_CAMERA_FIELDS.length} fields. `;
    } else if (realExifKeys.length === 0) {
        score = 60; // No EXIF at all → slightly suspicious
        details += "No EXIF data found — common with AI-generated or web-sourced images. ";
    } else {
        score = 45;
        details += `Sparse EXIF: ${presentCount} mandatory fields, ${realExifKeys.length} total fields. `;
    }

    if (hasInconsistency) score = Math.min(score + 15, 90);

    const descriptionKey = score >= 55 ? "signal.exifIntegrity.ai"
        : score <= 25 ? "signal.exifIntegrity.real"
            : "signal.exifIntegrity.inconclusive";

    return {
        name: "EXIF Integrity Validation", nameKey: "signal.exifIntegrity",
        category: "metadata", score, weight: 0.3,
        description: score >= 55
            ? "EXIF structure shows anomalies suggesting non-camera origin"
            : "EXIF integrity consistent with authentic camera capture",
        descriptionKey, icon: "🔍", details,
    };
}
