/**
 * Color Profile Metadata Analysis
 * Analyzes ICC color profile metadata, color space declarations,
 * and rendering intent to detect AI generation patterns.
 */

import type { AnalysisMethod, FileMetadata } from "../types";

const CAMERA_COLOR_PROFILES = [
    "adobe rgb", "prophoto rgb", "display p3", "rec. 2020",
    "dci-p3", "camera rgb", "wide gamut rgb",
];

const AI_TYPICAL_PROFILES = ["srgb", "srgb iec61966-2.1"];

export function analyzeColorProfileMeta(metadata: FileMetadata, exifData: Record<string, string>): AnalysisMethod {
    let score = 50;
    let details = "";

    const allValues = Object.entries(exifData);

    // Find color profile related fields
    let colorSpace = "";
    let iccProfile = "";
    let profileDescription = "";
    let bitsPerSample = "";

    for (const [key, val] of allValues) {
        const lk = key.toLowerCase();
        if (lk.includes("colorspace") || lk.includes("color space")) colorSpace = val.toLowerCase();
        if (lk.includes("icc") || lk.includes("profile")) iccProfile = val.toLowerCase();
        if (lk.includes("profiledescription") || lk.includes("profile description")) profileDescription = val.toLowerCase();
        if (lk.includes("bitspersample") || lk.includes("bits per sample") || lk.includes("bitdepth")) bitsPerSample = val;
    }

    // Analyze color profile
    const hasAdvancedProfile = CAMERA_COLOR_PROFILES.some(p =>
        colorSpace.includes(p) || iccProfile.includes(p) || profileDescription.includes(p));

    const hasBasicProfile = AI_TYPICAL_PROFILES.some(p =>
        colorSpace.includes(p) || iccProfile.includes(p) || profileDescription.includes(p));

    if (hasAdvancedProfile) {
        score = 18;
        details += "Advanced color profile (Adobe RGB/ProPhoto/Display P3) — typical of professional cameras. ";
    } else if (hasBasicProfile && colorSpace) {
        score = 45;
        details += "Standard sRGB profile — used by both cameras and AI tools. ";
    } else if (!colorSpace && !iccProfile && !profileDescription) {
        score = 55;
        details += "No color profile metadata — common with AI-generated images. ";
    }

    // Check bit depth
    const bits = parseInt(bitsPerSample);
    if (bits > 8) {
        score = Math.min(score, 20);
        details += `High bit depth (${bits}-bit) — indicates raw/professional capture. `;
    } else if (bits === 8 && !hasAdvancedProfile) {
        score = Math.max(score, 48);
        details += "Standard 8-bit depth. ";
    }

    // Check for color profile consistency
    if (colorSpace && iccProfile && !iccProfile.includes(colorSpace.split(" ")[0])) {
        score = Math.max(score, 60);
        details += "Color space and ICC profile mismatch detected. ";
    }

    score = Math.max(5, Math.min(95, score));

    const descriptionKey = score >= 50 ? "signal.colorProfileMeta.ai"
        : score <= 25 ? "signal.colorProfileMeta.real"
            : "signal.colorProfileMeta.inconclusive";

    return {
        name: "Color Profile Metadata", nameKey: "signal.colorProfileMeta",
        category: "metadata", score, weight: 0.2,
        description: score >= 50
            ? "Color profile metadata patterns suggest non-camera origin"
            : "Color profile consistent with professional camera workflow",
        descriptionKey, icon: "🎨", details,
    };
}
