/**
 * C2PA Content Credentials Verification
 * Checks for C2PA (Coalition for Content Provenance and Authenticity) 
 * content credentials and provenance data embedded in the image.
 */

import type { AnalysisMethod, FileMetadata } from "../../types";

const C2PA_MARKERS = [
    "c2pa", "content credentials", "content authenticity",
    "cai", "content provenance", "manifest store",
    "jumbf", "cbor", "provenance",
];

const C2PA_AI_ACTIONS = [
    "c2pa.created", "ai_generated", "compositeimage",
    "trainedalgorithmicmedia", "generativeai",
];

export function analyzeC2paVerification(metadata: FileMetadata, exifData: Record<string, string>): AnalysisMethod {
    let score = 50;
    let details = "";

    const allKeys = Object.keys(exifData).map(k => k.toLowerCase());
    const allValues = Object.values(exifData).join(" ").toLowerCase();
    const allKeyStr = allKeys.join(" ");

    // Check for C2PA manifest presence
    const hasC2paMarker = C2PA_MARKERS.some(m => allKeyStr.includes(m) || allValues.includes(m));

    if (hasC2paMarker) {
        // C2PA present — check what it says
        const hasAiAction = C2PA_AI_ACTIONS.some(a => allValues.includes(a));

        if (hasAiAction) {
            score = 88;
            details += "C2PA content credentials indicate AI-generated content. ";
        } else {
            score = 15;
            details += "C2PA content credentials present with authentic provenance chain. ";
        }
    } else {
        // No C2PA data — neutral, as most images don't have it yet
        score = 50;
        details += "No C2PA content credentials found — standard for most images. ";

        // Check for related standards
        if (allValues.includes("digimarc") || allValues.includes("watermark")) {
            score = 35;
            details += "Digital watermark metadata detected. ";
        }
    }

    const descriptionKey = score >= 75 ? "signal.c2paVerification.ai"
        : score <= 25 ? "signal.c2paVerification.real"
            : "signal.c2paVerification.inconclusive";

    return {
        name: "C2PA Content Credentials", nameKey: "signal.c2paVerification",
        category: "metadata", score, weight: 0.3,
        description: score >= 75
            ? "C2PA credentials indicate AI-generated or synthetic content"
            : score <= 25
                ? "C2PA credentials verify authentic content provenance"
                : "No C2PA content credentials — inconclusive",
        descriptionKey, icon: "🛡️", details,
    };
}
