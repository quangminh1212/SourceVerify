/**
 * Facial Reenactment Detection
 * Detects face reenactment artifacts in video
 * Reference: Rossler et al. (2019) - FaceForensics++, ICCV
 */
import type { AnalysisMethod } from "../../types";

export function analyzeFacialReenactment(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Facial Reenactment", nameKey: "signal.facialReenactment", category: "statistical", score: 50, weight: 0.25, description: "Frame too small", descriptionKey: "signal.facialReenactment.error", icon: "🎪" };
    }
    // Reenactment creates blending artifacts between inner face and outer face
    const innerX = Math.floor(w * 0.3), innerY = Math.floor(h * 0.25);
    const innerW = Math.floor(w * 0.4), innerH = Math.floor(h * 0.4);
    let innerEnergy = 0, outerEnergy = 0, iCnt = 0, oCnt = 0;
    let transitionZone = 0, tCnt = 0;

    for (let y = 1; y < h - 1; y += 2) {
        for (let x = 1; x < w - 1; x += 2) {
            const idx = (y * w + x) * 4;
            const grad = Math.abs(pixels[idx] - pixels[idx + 4]) + Math.abs(pixels[idx] - pixels[idx + w * 4]);
            const isInner = x > innerX && x < innerX + innerW && y > innerY && y < innerY + innerH;
            const isTransition = !isInner && x > innerX - 10 && x < innerX + innerW + 10 && y > innerY - 10 && y < innerY + innerH + 10;
            if (isInner) { innerEnergy += grad; iCnt++; }
            else if (isTransition) { transitionZone += grad; tCnt++; }
            else { outerEnergy += grad; oCnt++; }
        }
    }
    const avgInner = iCnt > 0 ? innerEnergy / iCnt : 0;
    const avgTransition = tCnt > 0 ? transitionZone / tCnt : 0;
    const avgOuter = oCnt > 0 ? outerEnergy / oCnt : 0;
    const transitionSpike = avgTransition > 0 ? avgTransition / Math.max(avgInner, avgOuter, 1) : 1;

    let score: number;
    if (transitionSpike > 1.5 && avgInner < avgOuter * 0.7) score = 74;
    else if (transitionSpike > 1.2) score = 62;
    else if (transitionSpike < 0.8) score = 30;
    else score = 44;

    return {
        name: "Facial Reenactment", nameKey: "signal.facialReenactment", category: "forensic", score, weight: 0.25,
        description: score > 55 ? "Face boundary blending spike detected — characteristic of reenactment manipulation" : "No reenactment artifacts — face region appears authentic",
        descriptionKey: score > 55 ? "signal.facialReenactment.ai" : "signal.facialReenactment.real", icon: "🎪",
        details: `Transition spike: ${transitionSpike.toFixed(3)}, Inner: ${avgInner.toFixed(1)}, Outer: ${avgOuter.toFixed(1)}.`,
    };
}
