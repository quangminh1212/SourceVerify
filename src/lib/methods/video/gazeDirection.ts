/**
 * Gaze Direction Consistency
 * Detects unnatural gaze patterns in AI-generated faces
 * Reference: Matern et al. (2019) - Exploiting Visual Artifacts to Expose Deepfakes
 */
import type { AnalysisMethod } from "../../types";

export function analyzeGazeDirection(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Gaze Direction", nameKey: "signal.gazeDirection", category: "statistical", score: 50, weight: 0.2, description: "Frame too small", descriptionKey: "signal.gazeDirection.error", icon: "👁" };
    }
    // Analyze eye region symmetry - deepfakes often have asymmetric eye patterns
    const eyeY = Math.floor(h * 0.25), eyeH = Math.floor(h * 0.15);
    const leftEyeX = Math.floor(w * 0.2), rightEyeX = Math.floor(w * 0.55);
    const eyeW = Math.floor(w * 0.25);
    let leftSum = 0, rightSum = 0, leftVar = 0, rightVar = 0, lCnt = 0, rCnt = 0;

    for (let y = eyeY; y < Math.min(eyeY + eyeH, h); y++) {
        for (let dx = 0; dx < eyeW && leftEyeX + dx < w && rightEyeX + dx < w; dx++) {
            const lIdx = (y * w + leftEyeX + dx) * 4;
            const rIdx = (y * w + rightEyeX + dx) * 4;
            const lG = 0.299 * pixels[lIdx] + 0.587 * pixels[lIdx + 1] + 0.114 * pixels[lIdx + 2];
            const rG = 0.299 * pixels[rIdx] + 0.587 * pixels[rIdx + 1] + 0.114 * pixels[rIdx + 2];
            leftSum += lG; rightSum += rG; lCnt++; rCnt++;
        }
    }
    const lMean = lCnt > 0 ? leftSum / lCnt : 128;
    const rMean = rCnt > 0 ? rightSum / rCnt : 128;
    // Re-pass for variance
    for (let y = eyeY; y < Math.min(eyeY + eyeH, h); y++) {
        for (let dx = 0; dx < eyeW && leftEyeX + dx < w && rightEyeX + dx < w; dx++) {
            const lIdx = (y * w + leftEyeX + dx) * 4;
            const rIdx = (y * w + rightEyeX + dx) * 4;
            const lG = 0.299 * pixels[lIdx] + 0.587 * pixels[lIdx + 1] + 0.114 * pixels[lIdx + 2];
            const rG = 0.299 * pixels[rIdx] + 0.587 * pixels[rIdx + 1] + 0.114 * pixels[rIdx + 2];
            leftVar += (lG - lMean) ** 2; rightVar += (rG - rMean) ** 2;
        }
    }
    leftVar = lCnt > 0 ? leftVar / lCnt : 0;
    rightVar = rCnt > 0 ? rightVar / rCnt : 0;
    const asymmetry = Math.abs(leftVar - rightVar) / (Math.max(leftVar, rightVar, 1));
    const meanDiff = Math.abs(lMean - rMean);

    let score: number;
    if (asymmetry > 0.5 && meanDiff > 15) score = 72;
    else if (asymmetry > 0.3) score = 60;
    else if (asymmetry < 0.1 && meanDiff < 5) score = 35;
    else score = 45;

    return {
        name: "Gaze Direction", nameKey: "signal.gazeDirection", category: "forensic", score, weight: 0.2,
        description: score > 55 ? "Asymmetric eye texture patterns — may indicate deepfake gaze inconsistency" : "Symmetric eye patterns — consistent with natural gaze",
        descriptionKey: score > 55 ? "signal.gazeDirection.ai" : "signal.gazeDirection.real", icon: "👁",
        details: `Asymmetry: ${asymmetry.toFixed(3)}, Mean diff: ${meanDiff.toFixed(1)}.`,
    };
}
