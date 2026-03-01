/**
 * GPS Consistency Analysis
 * Validates GPS coordinates presence, format consistency, and plausibility.
 * AI-generated images rarely contain valid GPS coordinates.
 */

import type { AnalysisMethod, FileMetadata } from "../types";

export function analyzeGpsConsistency(metadata: FileMetadata, exifData: Record<string, string>): AnalysisMethod {
    let score = 50;
    let details = "";

    const allKeys = Object.keys(exifData).map(k => k.toLowerCase());
    const allValues = Object.entries(exifData);

    // Find GPS-related fields
    const gpsFields: Record<string, string> = {};
    for (const [key, val] of allValues) {
        const lk = key.toLowerCase();
        if (lk.includes("gps") || lk.includes("latitude") || lk.includes("longitude") || lk.includes("altitude")) {
            gpsFields[key] = val;
        }
    }

    const gpsCount = Object.keys(gpsFields).length;

    if (gpsCount >= 4) {
        // Rich GPS data — check validity
        const lat = parseGpsCoord(gpsFields, "lat");
        const lon = parseGpsCoord(gpsFields, "lon");

        if (lat !== null && lon !== null) {
            // Valid coordinates
            if (Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
                // Check for suspicious coordinates (0,0 or exact round numbers)
                if (lat === 0 && lon === 0) {
                    score = 60;
                    details += "GPS coordinates at (0,0) — Null Island, likely placeholder. ";
                } else if (Number.isInteger(lat) && Number.isInteger(lon)) {
                    score = 45;
                    details += `GPS coordinates are exact integers (${lat}, ${lon}) — slightly unusual. `;
                } else {
                    score = 12;
                    details += `Valid GPS coordinates found (${lat.toFixed(4)}, ${lon.toFixed(4)}) — strong indicator of real capture. `;
                }
            } else {
                score = 70;
                details += "GPS coordinates out of valid range — possible fabrication. ";
            }
        } else {
            score = 25;
            details += `GPS metadata present (${gpsCount} fields) but coordinates not fully parseable. `;
        }
    } else if (gpsCount >= 1) {
        score = 35;
        details += `Partial GPS data (${gpsCount} fields). `;
    } else {
        score = 55;
        details += "No GPS data — common for AI-generated and social media images. ";
    }

    const descriptionKey = score >= 55 ? "signal.gpsConsistency.ai"
        : score <= 25 ? "signal.gpsConsistency.real"
            : "signal.gpsConsistency.inconclusive";

    return {
        name: "GPS Consistency Analysis", nameKey: "signal.gpsConsistency",
        category: "metadata", score, weight: 0.25,
        description: score <= 25
            ? "Valid GPS coordinates detected — strong indicator of real camera capture"
            : score >= 55
                ? "GPS data absent or suspicious — consistent with AI-generated images"
                : "GPS consistency analysis inconclusive",
        descriptionKey, icon: "📍", details,
    };
}

function parseGpsCoord(fields: Record<string, string>, type: "lat" | "lon"): number | null {
    const search = type === "lat" ? "lat" : "lon";
    for (const [key, val] of Object.entries(fields)) {
        if (key.toLowerCase().includes(search)) {
            const num = parseFloat(val);
            if (!isNaN(num)) return num;
            // Try parsing DMS format (e.g., "40 deg 26' 46.302\" N")
            const dms = val.match(/(\d+)\s*(?:deg|°)\s*(\d+)\s*['′]\s*([\d.]+)\s*["″]?\s*([NSEW])?/i);
            if (dms) {
                let coord = parseInt(dms[1]) + parseInt(dms[2]) / 60 + parseFloat(dms[3]) / 3600;
                if (dms[4] && (dms[4] === "S" || dms[4] === "W")) coord = -coord;
                return coord;
            }
        }
    }
    return null;
}
