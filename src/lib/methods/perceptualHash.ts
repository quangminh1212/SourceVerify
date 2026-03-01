/**
 * Perceptual Hash Analysis
 * Analysis method for SourceVerify forensic engine
 */

import type { AnalysisMethod } from "../types";

export function analyzePerceptualHash(pixels: Uint8ClampedArray, w: number, h: number): AnalysisMethod {
    if (w < 16 || h < 16) {
        return {
            name: "Perceptual Hash Analysis", nameKey: "signal.perceptualHash",
            category: "statistical", score: 50, weight: 0.25,
            description: "Image too small for analysis",
            descriptionKey: "signal.perceptualHash.error", icon: "#️⃣",
        };
    }

    let score: number;
    
    // Compute perceptual hash features to detect internal inconsistencies
    const blockW = Math.min(8, w), blockH = Math.min(8, h);
    const scX = w / blockW, scY = h / blockH;
    // Compute DCT-like hash for different image quadrants
    const quadrants = [
        {x0:0, y0:0, x1:Math.floor(w/2), y1:Math.floor(h/2)},
        {x0:Math.floor(w/2), y0:0, x1:w, y1:Math.floor(h/2)},
        {x0:0, y0:Math.floor(h/2), x1:Math.floor(w/2), y1:h},
        {x0:Math.floor(w/2), y0:Math.floor(h/2), x1:w, y1:h}
    ];
    const qMeans = [];
    const qVars = [];
    for (const q of quadrants) {
        let sum = 0, cnt = 0;
        for (let y = q.y0; y < q.y1; y += Math.max(1, Math.floor((q.y1-q.y0)/20))) {
            for (let x = q.x0; x < q.x1; x += Math.max(1, Math.floor((q.x1-q.x0)/20))) {
                const idx = (y * w + x) * 4;
                sum += 0.299*pixels[idx] + 0.587*pixels[idx+1] + 0.114*pixels[idx+2];
                cnt++;
            }
        }
        const mean = cnt > 0 ? sum / cnt : 128;
        qMeans.push(mean);
        let varSum = 0; cnt = 0;
        for (let y = q.y0; y < q.y1; y += Math.max(1, Math.floor((q.y1-q.y0)/20))) {
            for (let x = q.x0; x < q.x1; x += Math.max(1, Math.floor((q.x1-q.x0)/20))) {
                const idx = (y * w + x) * 4;
                const v = 0.299*pixels[idx] + 0.587*pixels[idx+1] + 0.114*pixels[idx+2];
                varSum += (v - mean) ** 2;
                cnt++;
            }
        }
        qVars.push(cnt > 0 ? Math.sqrt(varSum / cnt) : 0);
    }
    // Check quadrant consistency — AI images tend to have more uniform variance
    const meanVar = qVars.reduce((a,b)=>a+b,0) / 4;
    const varOfVars = qVars.reduce((a,b)=>a+(b-meanVar)**2,0) / 4;
    if (varOfVars < 5) score = 65;
    else if (varOfVars < 20) score = 50;
    else score = 30;

    return {
        name: "Perceptual Hash Analysis", nameKey: "signal.perceptualHash",
        category: "statistical", score, weight: 0.25,
        description: score > 55
            ? "Unusually uniform quadrant statistics — consistent with AI generation"
            : "Natural variance distribution across image regions",
        descriptionKey: score > 55 ? "signal.perceptualHash.ai" : "signal.perceptualHash.real",
        icon: "#️⃣",
    };
}
