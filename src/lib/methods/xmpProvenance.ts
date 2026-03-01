/**
 * XMP Provenance Analysis
 * Analyzes XMP edit history, software chain, and provenance metadata
 * to detect AI generation or extensive manipulation.
 */

import type { AnalysisMethod, FileMetadata } from "../types";

const AI_XMP_MARKERS = [
    "stable diffusion", "dall-e", "midjourney", "comfyui", "automatic1111",
    "invokeai", "novelai", "dreamstudio", "firefly", "imagen",
    "bing image creator", "copilot", "leonardo.ai",
];

const PHOTO_EDITORS = [
    "photoshop", "lightroom", "capture one", "darktable", "rawtherapee",
    "affinity photo", "gimp", "snapseed", "vsco",
];

export function analyzeXmpProvenance(metadata: FileMetadata, exifData: Record<string, string>): AnalysisMethod {
    let score = 50;
    let details = "";

    const allValues = Object.values(exifData).join(" ").toLowerCase();
    const allKeys = Object.keys(exifData).join(" ").toLowerCase();

    // Check for XMP History/CreatorTool
    const hasXmpHistory = allKeys.includes("history") || allKeys.includes("xmp:");
    const hasCreatorTool = allKeys.includes("creatortool") || allKeys.includes("creator tool");

    // Check for AI markers in XMP data
    let aiFound = false;
    for (const marker of AI_XMP_MARKERS) {
        if (allValues.includes(marker)) {
            score = 92;
            details += `AI tool detected in XMP provenance: "${marker}". `;
            aiFound = true;
            break;
        }
    }

    if (!aiFound) {
        // Check for photo editor signatures (indicates real photo processing)
        let editorFound = false;
        for (const editor of PHOTO_EDITORS) {
            if (allValues.includes(editor)) {
                score = 20;
                details += `Professional photo editor detected: "${editor}". `;
                editorFound = true;
                break;
            }
        }

        if (!editorFound) {
            if (hasXmpHistory) {
                score = 30;
                details += "XMP edit history present — indicates authentic editing workflow. ";
            } else if (hasCreatorTool) {
                score = 35;
                details += "Creator tool metadata present. ";
            } else {
                score = 50;
                details += "No XMP provenance data — inconclusive. ";
            }
        }
    }

    const descriptionKey = score >= 80 ? "signal.xmpProvenance.ai"
        : score <= 30 ? "signal.xmpProvenance.real"
            : "signal.xmpProvenance.inconclusive";

    return {
        name: "XMP Provenance Analysis", nameKey: "signal.xmpProvenance",
        category: "metadata", score, weight: 0.3,
        description: score >= 80
            ? "XMP provenance reveals AI generation tool signature"
            : score <= 30
                ? "XMP provenance consistent with authentic photo editing workflow"
                : "XMP provenance analysis inconclusive",
        descriptionKey, icon: "📋", details,
    };
}
