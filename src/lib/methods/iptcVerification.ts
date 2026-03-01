/**
 * IPTC Data Verification
 * Analyzes IPTC (International Press Telecommunications Council) metadata
 * for authenticity markers, digital source type, and AI tool signatures.
 */

import type { AnalysisMethod, FileMetadata } from "../types";

const IPTC_AUTHENTICITY_FIELDS = [
    "credit", "source", "copyright", "writer", "caption",
    "byline", "city", "country", "headline", "keywords",
];

export function analyzeIptcVerification(metadata: FileMetadata, exifData: Record<string, string>): AnalysisMethod {
    let score = 50;
    let details = "";

    const allKeys = Object.keys(exifData).map(k => k.toLowerCase());
    const allValues = Object.values(exifData).join(" ").toLowerCase();

    // Check for IPTC DigitalSourceType (ISO 12639)
    const digitalSourceType = exifData["DigitalSourceType"] || exifData["Digital Source Type"] || "";
    if (digitalSourceType.toLowerCase().includes("training") ||
        digitalSourceType.toLowerCase().includes("composite") ||
        digitalSourceType.toLowerCase().includes("algorithmicmedia") ||
        digitalSourceType.toLowerCase().includes("virtual")) {
        score = 90;
        details += `IPTC DigitalSourceType indicates non-photographic origin: "${digitalSourceType}". `;
    }

    // Count IPTC authenticity fields
    if (score === 50) {
        let iptcCount = 0;
        for (const field of IPTC_AUTHENTICITY_FIELDS) {
            if (allKeys.some(k => k.includes(field))) iptcCount++;
        }

        if (iptcCount >= 4) {
            score = 15;
            details += `Rich IPTC data (${iptcCount} fields) — professional news/stock photo workflow. `;
        } else if (iptcCount >= 2) {
            score = 30;
            details += `Some IPTC fields present (${iptcCount} fields). `;
        } else if (iptcCount === 0) {
            // Check if there are any IPTC-related keys
            const hasAnyIptc = allKeys.some(k => k.includes("iptc") || k.includes("photoshop"));
            if (!hasAnyIptc) {
                score = 55;
                details += "No IPTC data — AI-generated images typically lack IPTC metadata. ";
            }
        }
    }

    // Check for suspicious content in IPTC fields
    if (allValues.includes("generated") || allValues.includes("synthetic") || allValues.includes("artificial")) {
        score = Math.max(score, 75);
        details += "IPTC fields contain synthetic/generated references. ";
    }

    const descriptionKey = score >= 70 ? "signal.iptcVerification.ai"
        : score <= 25 ? "signal.iptcVerification.real"
            : "signal.iptcVerification.inconclusive";

    return {
        name: "IPTC Data Verification", nameKey: "signal.iptcVerification",
        category: "metadata", score, weight: 0.25,
        description: score >= 70
            ? "IPTC metadata indicates non-photographic or AI-generated origin"
            : score <= 25
                ? "IPTC data consistent with professional photography workflow"
                : "IPTC verification inconclusive",
        descriptionKey, icon: "📰", details,
    };
}
