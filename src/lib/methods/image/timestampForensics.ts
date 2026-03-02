/**
 * Timestamp Forensics
 * Cross-references creation, modification, and digitized timestamps
 * to detect temporal anomalies indicative of AI generation or tampering.
 */

import type { AnalysisMethod, FileMetadata } from "../../types";

const TIMESTAMP_FIELDS = [
    "DateTimeOriginal", "Date/Time Original", "CreateDate", "Create Date",
    "DateTimeDigitized", "Date/Time Digitized", "ModifyDate", "Modify Date",
    "DateTime", "Date Time", "FileModifyDate", "File Modify Date",
    "GPSDateTime", "GPS Date Time", "SubSecTimeOriginal",
];

export function analyzeTimestampForensics(metadata: FileMetadata, exifData: Record<string, string>): AnalysisMethod {
    let score = 50;
    let details = "";

    // Collect all timestamps
    const timestamps: { field: string; date: Date }[] = [];
    for (const field of TIMESTAMP_FIELDS) {
        const val = findField(exifData, field);
        if (val) {
            const d = parseTimestamp(val);
            if (d) timestamps.push({ field, date: d });
        }
    }

    if (timestamps.length === 0) {
        score = 58;
        details += "No timestamp metadata found — suspicious for camera-captured images. ";
    } else if (timestamps.length === 1) {
        score = 40;
        details += `Single timestamp found: ${timestamps[0].field}. `;
    } else {
        // Analyze timestamp consistency
        const sorted = timestamps.sort((a, b) => a.date.getTime() - b.date.getTime());
        const earliest = sorted[0].date;
        const latest = sorted[sorted.length - 1].date;
        const spanMs = latest.getTime() - earliest.getTime();
        const spanDays = spanMs / (1000 * 60 * 60 * 24);

        if (spanDays > 365) {
            score = 65;
            details += `Timestamp span exceeds 1 year (${Math.round(spanDays)} days) — likely tampered. `;
        } else if (spanDays > 30) {
            score = 55;
            details += `Timestamp span: ${Math.round(spanDays)} days — unusual for single capture. `;
        } else if (spanMs < 10000) { // All within 10 seconds
            score = 18;
            details += `All ${timestamps.length} timestamps within 10 seconds — consistent capture event. `;
        } else {
            score = 30;
            details += `${timestamps.length} timestamps with reasonable span (${Math.round(spanMs / 1000)}s). `;
        }

        // Check for future dates
        const now = new Date();
        if (latest.getTime() > now.getTime() + 86400000) {
            score = Math.max(score, 75);
            details += "Future timestamp detected — definite anomaly. ";
        }

        // Check for epoch-like dates (near 1970 or 2000)
        if (earliest.getFullYear() <= 1980 || (earliest.getFullYear() === 2000 && earliest.getMonth() === 0 && earliest.getDate() === 1)) {
            score = Math.max(score, 65);
            details += "Default/epoch timestamp detected. ";
        }
    }

    const descriptionKey = score >= 55 ? "signal.timestampForensics.ai"
        : score <= 25 ? "signal.timestampForensics.real"
            : "signal.timestampForensics.inconclusive";

    return {
        name: "Timestamp Forensics", nameKey: "signal.timestampForensics",
        category: "metadata", score, weight: 0.25,
        description: score >= 55
            ? "Timestamp anomalies detected — inconsistent with authentic camera capture"
            : score <= 25
                ? "Timestamps consistent with authentic single capture event"
                : "Timestamp forensics inconclusive",
        descriptionKey, icon: "⏱️", details,
    };
}

function findField(exifData: Record<string, string>, fieldName: string): string | undefined {
    for (const [key, val] of Object.entries(exifData)) {
        if (key.toLowerCase().replace(/[\s_\/]/g, "") === fieldName.toLowerCase().replace(/[\s_\/]/g, "")) {
            return val;
        }
    }
    return undefined;
}

function parseTimestamp(val: string): Date | null {
    // Try standard EXIF format: "2024:01:15 14:30:00"
    const exifMatch = val.match(/(\d{4}):(\d{2}):(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/);
    if (exifMatch) {
        return new Date(`${exifMatch[1]}-${exifMatch[2]}-${exifMatch[3]}T${exifMatch[4]}:${exifMatch[5]}:${exifMatch[6]}`);
    }
    // Try ISO 8601
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
}
