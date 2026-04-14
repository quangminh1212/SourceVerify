/**
 * Deepfake Artifact Detection
 * Analyzes face region for synthetic generation artifacts
 * Reference: Li et al. (2020) - Face X-ray for More General Face Forgery Detection, CVPR
 */
import type { AnalysisMethod } from "../../types";

export function analyzeDeepfakeArtifact(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Deepfake Artifact", nameKey: "signal.deepfakeArtifact", category: "statistical", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.deepfakeArtifact.error", icon: "🎭" };
    }
    // Analyze face boundary blending artifacts - deepfakes show unnatural transitions at face edges
    const faceX = Math.floor(w * 0.25), faceY = Math.floor(h * 0.15);
    const faceW = Math.floor(w * 0.5), faceH = Math.floor(h * 0.6);
    let boundarySharpness = 0, interiorSmooth = 0, bCount = 0, iCount = 0;

    for (let y = faceY; y < faceY + faceH && y < h - 1; y += 2) {
        for (let x = faceX; x < faceX + faceW && x < w - 1; x += 2) {
            const idx = (y * w + x) * 4;
            const idxR = idx + 4, idxD = idx + w * 4;
            const diff = Math.abs(pixels[idx] - pixels[idxR]) + Math.abs(pixels[idx + 1] - pixels[idxR + 1]) + Math.abs(pixels[idx + 2] - pixels[idxR + 2]);
            const diffV = Math.abs(pixels[idx] - pixels[idxD]) + Math.abs(pixels[idx + 1] - pixels[idxD + 1]) + Math.abs(pixels[idx + 2] - pixels[idxD + 2]);
            const isBoundary = (x < faceX + 10 || x > faceX + faceW - 10 || y < faceY + 10 || y > faceY + faceH - 10);
            if (isBoundary) { boundarySharpness += diff + diffV; bCount++; }
            else { if (diff + diffV < 15) interiorSmooth++; iCount++; }
        }
    }
    const avgBoundary = bCount > 0 ? boundarySharpness / (bCount * 6) : 0;
    const smoothRatio = iCount > 0 ? interiorSmooth / iCount : 0;
    let score: number;
    if (smoothRatio > 0.8 && avgBoundary > 8) score = 75;
    else if (smoothRatio > 0.7 && avgBoundary > 5) score = 63;
    else if (smoothRatio < 0.4) score = 30;
    else score = 44;

    return {
        name: "Deepfake Artifact", nameKey: "signal.deepfakeArtifact", category: "forensic", score, weight: 0.3,
        description: score > 55 ? "Sharp face boundary with smooth interior — characteristic of face-swapping deepfake" : "Natural face texture gradient — consistent with authentic video",
        descriptionKey: score > 55 ? "signal.deepfakeArtifact.ai" : "signal.deepfakeArtifact.real", icon: "🎭",
        details: `Boundary avg: ${avgBoundary.toFixed(3)}, Interior smooth: ${smoothRatio.toFixed(3)}.`,
    };
}
