/**
 * Software Fingerprint Analysis
 * Deep analysis of software signatures, version patterns, encoding fingerprints,
 * and processing tool chains to identify AI generation tools.
 */

import type { AnalysisMethod, FileMetadata } from "../types";

const AI_SOFTWARE_DEEP = [
    // Stable Diffusion ecosystem
    { pattern: "stable diffusion", confidence: 95 },
    { pattern: "automatic1111", confidence: 95 },
    { pattern: "comfyui", confidence: 95 },
    { pattern: "invokeai", confidence: 92 },
    { pattern: "a1111", confidence: 90 },
    { pattern: "sd.next", confidence: 90 },
    { pattern: "fooocus", confidence: 92 },
    // DALL-E / OpenAI
    { pattern: "dall-e", confidence: 95 },
    { pattern: "dall·e", confidence: 95 },
    { pattern: "openai", confidence: 85 },
    { pattern: "chatgpt", confidence: 85 },
    // Midjourney
    { pattern: "midjourney", confidence: 95 },
    // Adobe
    { pattern: "adobe firefly", confidence: 90 },
    { pattern: "generative fill", confidence: 88 },
    { pattern: "generative expand", confidence: 88 },
    // Google
    { pattern: "imagen", confidence: 90 },
    { pattern: "gemini", confidence: 80 },
    // Others
    { pattern: "leonardo.ai", confidence: 92 },
    { pattern: "dreamstudio", confidence: 92 },
    { pattern: "novelai", confidence: 92 },
    { pattern: "bing image creator", confidence: 90 },
    { pattern: "flux", confidence: 85 },
    { pattern: "playground ai", confidence: 90 },
    { pattern: "ideogram", confidence: 90 },
    { pattern: "nightcafe", confidence: 88 },
    { pattern: "canva ai", confidence: 85 },
];

const CAMERA_SOFTWARE = [
    { pattern: "canon", confidence: 10 },
    { pattern: "nikon", confidence: 10 },
    { pattern: "sony", confidence: 10 },
    { pattern: "fujifilm", confidence: 10 },
    { pattern: "panasonic", confidence: 12 },
    { pattern: "olympus", confidence: 12 },
    { pattern: "leica", confidence: 8 },
    { pattern: "hasselblad", confidence: 8 },
    { pattern: "phase one", confidence: 8 },
    { pattern: "samsung", confidence: 15 },
    { pattern: "apple", confidence: 15 },
    { pattern: "google pixel", confidence: 15 },
    { pattern: "huawei", confidence: 15 },
    { pattern: "xiaomi", confidence: 15 },
];

export function analyzeSoftwareFingerprint(metadata: FileMetadata, exifData: Record<string, string>): AnalysisMethod {
    let score = 50;
    let details = "";

    const allValues = Object.values(exifData).join(" ").toLowerCase();
    const fileName = metadata.fileName.toLowerCase();
    const combined = allValues + " " + fileName;

    // Deep AI software detection
    let bestAiMatch: { pattern: string; confidence: number } | null = null;
    for (const sw of AI_SOFTWARE_DEEP) {
        if (combined.includes(sw.pattern)) {
            if (!bestAiMatch || sw.confidence > bestAiMatch.confidence) {
                bestAiMatch = sw;
            }
        }
    }

    if (bestAiMatch) {
        score = bestAiMatch.confidence;
        details += `AI software fingerprint: "${bestAiMatch.pattern}" (confidence: ${bestAiMatch.confidence}%). `;
    }

    // Camera/phone software detection
    if (!bestAiMatch) {
        let bestCameraMatch: { pattern: string; confidence: number } | null = null;
        for (const cam of CAMERA_SOFTWARE) {
            if (combined.includes(cam.pattern)) {
                if (!bestCameraMatch || cam.confidence < bestCameraMatch.confidence) {
                    bestCameraMatch = cam;
                }
            }
        }

        if (bestCameraMatch) {
            score = bestCameraMatch.confidence;
            details += `Camera/device software: "${bestCameraMatch.pattern}". `;
        }
    }

    // Check encoding software (JPEG encoders)
    if (score === 50) {
        if (combined.includes("libjpeg") || combined.includes("ijg")) {
            score = 45;
            details += "Standard JPEG encoder (libjpeg) — neutral. ";
        } else if (combined.includes("mozjpeg")) {
            score = 42;
            details += "MozJPEG encoder — typically web optimization. ";
        } else if (combined.includes("pillow") || combined.includes("pil")) {
            score = 58;
            details += "Python Pillow library — common in AI pipelines. ";
        } else if (combined.includes("opencv")) {
            score = 55;
            details += "OpenCV — common in image processing pipelines. ";
        }
    }

    score = Math.max(5, Math.min(95, score));

    const descriptionKey = score >= 75 ? "signal.softwareFingerprint.ai"
        : score <= 20 ? "signal.softwareFingerprint.real"
            : "signal.softwareFingerprint.inconclusive";

    return {
        name: "Software Fingerprint Analysis", nameKey: "signal.softwareFingerprint",
        category: "metadata", score, weight: 0.35,
        description: score >= 75
            ? "Software fingerprint identifies specific AI generation tool"
            : score <= 20
                ? "Software fingerprint matches authentic camera/device"
                : "Software fingerprint analysis inconclusive",
        descriptionKey, icon: "🔬", details,
    };
}
