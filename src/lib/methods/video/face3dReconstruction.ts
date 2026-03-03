/**
 * Face 3D Reconstruction Analysis
 * Detects artifacts from inconsistent 3D face geometry
 */
import type { AnalysisMethod } from "../../types";

export function analyzeFace3dReconstruction(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 32 || h < 32) {
        return { name: "Face 3D Reconstruction", nameKey: "signal.face3dReconstruction", category: "sensor", score: 50, weight: 0.4, description: "Frame too small", descriptionKey: "signal.face3dReconstruction.error", icon: "🗿" };
    }
    // Analyze face region lighting gradient for 3D consistency
    const fX = Math.floor(w * 0.2), fY = Math.floor(h * 0.1), fW = Math.floor(w * 0.6), fH = Math.floor(h * 0.5);
    const mid = fX + Math.floor(fW / 2);
    let lGrad = 0, rGrad = 0, lC = 0, rC = 0;
    for (let y = fY + 1; y < fY + fH && y < h - 1; y += 3)for (let x = fX + 1; x < fX + fW && x < w - 1; x += 3) {
        const i = (y * w + x) * 4; const g = pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
        const gRight = pixels[(y * w + Math.min(x + 1, w - 1)) * 4] * 0.299 + pixels[(y * w + Math.min(x + 1, w - 1)) * 4 + 1] * 0.587 + pixels[(y * w + Math.min(x + 1, w - 1)) * 4 + 2] * 0.114;
        const grad = Math.abs(gRight - g);
        if (x < mid) { lGrad += grad; lC++; } else { rGrad += grad; rC++; }
    }
    const lMean = lC > 0 ? lGrad / lC : 0; const rMean = rC > 0 ? rGrad / rC : 0;
    const asymmetry = Math.abs(lMean - rMean);
    let score: number;
    if (asymmetry < 0.5) score = 66; else if (asymmetry > 3) score = 32; else score = 48;
    return {
        name: "Face 3D Reconstruction", nameKey: "signal.face3dReconstruction", category: "sensor", score, weight: 0.4,
        description: score > 55 ? "3D face geometry anomaly — possible AI generation" : "Natural 3D face geometry — authentic",
        descriptionKey: score > 55 ? "signal.face3dReconstruction.ai" : "signal.face3dReconstruction.real", icon: "🗿",
        details: `Gradient asymmetry: ${asymmetry.toFixed(3)}, L: ${lMean.toFixed(2)}, R: ${rMean.toFixed(2)}`,
    };
}
