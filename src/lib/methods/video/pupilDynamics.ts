/**
 * Pupil Dynamics Analysis
 * Detects unnatural pupil behavior in video frames
 */
import type { AnalysisMethod } from "../../types";

export function analyzePupilDynamics(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Pupil Dynamics", nameKey: "signal.pupilDynamics", category: "sensor", score: 50, weight: 0.3, description: "Frame too small", descriptionKey: "signal.pupilDynamics.error", icon: "👁️" };
    }
    // Analyze eye region for pupil darkness and uniformity
    const eX = Math.floor(w * 0.25), eY = Math.floor(h * 0.2), eW = Math.floor(w * 0.5), eH = Math.floor(h * 0.15);
    let darkCount = 0, cnt = 0, darkSum = 0; const darkVals: number[] = [];
    for (let y = eY; y < eY + eH && y < h; y += 2)for (let x = eX; x < eX + eW && x < w; x += 2) {
        const i = (y * w + x) * 4; const g = pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
        cnt++; if (g < 40) { darkCount++; darkSum += g; darkVals.push(g); }
    }
    const darkRatio = cnt > 0 ? darkCount / cnt : 0; const darkMean = darkVals.length > 0 ? darkSum / darkVals.length : 0;
    let darkVar = 0; if (darkVals.length > 1) darkVar = darkVals.reduce((a, b) => a + (b - darkMean) ** 2, 0) / darkVals.length;
    let score: number;
    if (darkRatio > 0.02 && darkVar < 8) score = 64; else if (darkRatio < 0.005) score = 45; else score = 47;
    return {
        name: "Pupil Dynamics", nameKey: "signal.pupilDynamics", category: "sensor", score, weight: 0.3,
        description: score > 55 ? "Pupil dynamics anomaly — possible AI generation" : "Natural pupil dynamics — authentic",
        descriptionKey: score > 55 ? "signal.pupilDynamics.ai" : "signal.pupilDynamics.real", icon: "👁️",
        details: `Dark ratio: ${darkRatio.toFixed(4)}, Dark var: ${darkVar.toFixed(2)}`,
    };
}
