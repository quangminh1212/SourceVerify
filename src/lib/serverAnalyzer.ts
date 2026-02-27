/**
 * Server-side image analyzer using node-canvas
 * Ports browser-based signals to Node.js environment
 */

export interface ServerAnalysisResult {
    verdict: "ai" | "real" | "uncertain";
    confidence: number;
    aiScore: number;
    signals: { name: string; score: number; weight: number }[];
    processingTimeMs: number;
    imageInfo: { width: number; height: number; format: string };
}

const MAX_DIM = 1024;
const AI_SIGS = ["midjourney", "dall-e", "dalle", "stable diffusion", "comfyui", "automatic1111", "novelai", "civitai", "adobe firefly", "firefly", "bing image creator", "leonardo ai", "flux", "sora", "runway", "pika", "ideogram", "recraft", "grok", "gemini", "imagen", "copilot designer", "meta ai", "stability ai", "sdxl", "sd3"];
const CAM_SIGS = ["canon", "nikon", "sony", "fujifilm", "olympus", "panasonic", "leica", "hasselblad", "pentax", "samsung", "apple", "google pixel", "huawei", "xiaomi"];

function analyzeMetadata(fileName: string) {
    let score = 50;
    const fn = fileName.toLowerCase();
    for (const sig of AI_SIGS) { if (fn.includes(sig)) { score = 95; break; } }
    if (score === 50) { for (const cam of CAM_SIGS) { if (fn.includes(cam)) { score = 10; break; } } }
    return { name: "Metadata Analysis", score, weight: 1.5 };
}

function analyzeNoiseResidual(pixels: Uint8ClampedArray, w: number, h: number) {
    const bs = 32, bx = Math.floor(w / bs), by = Math.floor(h / bs);
    const devs: number[] = [], brights: number[] = [];
    const step = Math.max(1, Math.floor(bx * by / 300));
    for (let iy = 0; iy < by; iy += step) for (let ix = 0; ix < bx; ix += step) {
        let sr = 0, sr2 = 0, sb = 0, c = 0;
        for (let y = iy * bs + 1; y < (iy + 1) * bs - 1; y++) for (let x = ix * bs + 1; x < (ix + 1) * bs - 1; x++) {
            const g = (py: number, px: number) => { const i = (py * w + px) * 4; return pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114; };
            const center = g(y, x), lap = 4 * center - g(y, x - 1) - g(y, x + 1) - g(y - 1, x) - g(y + 1, x);
            sr += lap; sr2 += lap * lap; sb += center; c++;
        }
        if (c > 0) { const m = sr / c, v = sr2 / c - m * m; devs.push(Math.sqrt(Math.max(0, v))); brights.push(sb / c); }
    }
    if (devs.length < 4) return { name: "Noise Residual", score: 50, weight: 3.5 };
    const mean = devs.reduce((a, b) => a + b, 0) / devs.length;
    const variance = devs.reduce((a, b) => a + (b - mean) ** 2, 0) / devs.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;
    const mb = brights.reduce((a, b) => a + b, 0) / brights.length;
    let covBN = 0, varB = 0, varN = 0;
    for (let i = 0; i < devs.length; i++) { const db = brights[i] - mb, dn = devs[i] - mean; covBN += db * dn; varB += db * db; varN += dn * dn; }
    const shotCorr = (varB > 0 && varN > 0) ? covBN / Math.sqrt(varB * varN) : 0;
    let score = 50;
    if (shotCorr > 0.45) score -= 18; else if (shotCorr > 0.3) score -= 12; else if (shotCorr > 0.15) score -= 6; else if (shotCorr < -0.15) score += 15; else if (shotCorr < 0) score += 8; else score += 5;
    if (cv < 0.2) score += 22; else if (cv < 0.4) score += 12; else if (cv < 0.6) score += 4; else if (cv > 1.0) score -= 18; else if (cv > 0.8) score -= 10;
    if (mean < 3) score += 12; else if (mean < 6) score += 5; else if (mean > 15) score -= 18; else if (mean > 10) score -= 10; else if (mean > 8) score -= 3;
    return { name: "Noise Residual", score: Math.max(5, Math.min(95, score)), weight: 3.5 };
}

function analyzeEdgeCoherence(pixels: Uint8ClampedArray, w: number, h: number) {
    const mags: number[] = [], dirs: number[] = [];
    const step = Math.max(1, Math.floor(Math.min(w, h) / 300));
    for (let y = 1; y < h - 1; y += step) for (let x = 1; x < w - 1; x += step) {
        const g = (px: number, py: number) => { const i = (py * w + px) * 4; return pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114; };
        const gx = -g(x - 1, y - 1) - 2 * g(x - 1, y) - g(x - 1, y + 1) + g(x + 1, y - 1) + 2 * g(x + 1, y) + g(x + 1, y + 1);
        const gy = -g(x - 1, y - 1) - 2 * g(x, y - 1) - g(x + 1, y - 1) + g(x - 1, y + 1) + 2 * g(x, y + 1) + g(x + 1, y + 1);
        const mag = Math.sqrt(gx * gx + gy * gy); mags.push(mag); if (mag > 5) dirs.push(Math.atan2(gy, gx));
    }
    const sorted = [...mags].sort((a, b) => a - b);
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p90 = sorted[Math.floor(sorted.length * 0.9)];
    const p10 = sorted[Math.floor(sorted.length * 0.1)];
    const edgeRange = p90 - p10;
    const sharpR = p50 > 0 ? p90 / p50 : 1;
    let score = 50;
    if (p50 < 4 && edgeRange < 25) score += 28; else if (p50 < 6) score += 18; else if (p50 < 10) score += 8; else if (p50 > 25) score -= 20; else if (p50 > 18) score -= 10;
    if (sharpR < 2.5) score += 12; else if (sharpR < 4) score += 5; else if (sharpR > 10) score -= 12; else if (sharpR > 7) score -= 5;
    return { name: "Edge Coherence", score: Math.max(5, Math.min(95, score)), weight: 1.5 };
}

function analyzeSpectralNyquist(pixels: Uint8ClampedArray, w: number, h: number) {
    const size = Math.min(64, Math.min(w, h));
    const ox = Math.floor((w - size) / 2), oy = Math.floor((h - size) / 2);
    const gray = new Float64Array(size * size);
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
        const i = ((oy + y) * w + (ox + x)) * 4;
        gray[y * size + x] = pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
    }
    const hs = Math.floor(size / 2), fp = new Float64Array(hs + 1);
    let rc = 0;
    for (let y = 0; y < size; y++) {
        for (let k = 0; k <= hs; k++) { let re = 0, im = 0; for (let n = 0; n < size; n++) { const a = -2 * Math.PI * k * n / size; re += gray[y * size + n] * Math.cos(a); im += gray[y * size + n] * Math.sin(a); } fp[k] += re * re + im * im; }
        rc++;
    }
    for (let k = 0; k <= hs; k++)fp[k] /= rc;
    const lp = new Float64Array(hs + 1); for (let k = 0; k <= hs; k++)lp[k] = Math.log10(fp[k] + 1);
    const nyq = lp[hs], n1 = hs > 1 ? lp[hs - 1] : nyq, n2 = hs > 2 ? lp[hs - 2] : n1, n3 = hs > 3 ? lp[hs - 3] : n2;
    const nAvg = (n1 + n2 + n3) / 3, pr = nAvg > 0 ? nyq / nAvg : 1;
    const lf = (lp[1] + lp[2] + lp[3]) / 3, hf = (lp[hs - 3] + lp[hs - 2] + lp[hs - 1]) / 3;
    const rr = lf > 0 ? hf / lf : 0;
    let score = 50;
    if (pr > 1.5) score += 20; else if (pr > 1.2) score += 10; else if (pr < 0.9) score -= 15;
    if (rr > 0.5) score += 15; else if (rr > 0.3) score += 5; else if (rr < 0.15) score -= 15; else if (rr < 0.2) score -= 5;
    return { name: "Spectral Nyquist", score: Math.max(10, Math.min(90, score)), weight: 3.0 };
}

function analyzeGradientMicroTexture(pixels: Uint8ClampedArray, w: number, h: number) {
    const bs = 32, bx = Math.floor(w / bs), by = Math.floor(h / bs);
    let smooth = 0, total = 0, microSum = 0;
    const step = Math.max(1, Math.floor(bx * by / 200));
    for (let iy = 0; iy < by; iy += step) for (let ix = 0; ix < bx; ix += step) {
        let gs = 0, mn = 0, c = 0;
        for (let y = iy * bs; y < (iy + 1) * bs - 1; y++) for (let x = ix * bs; x < (ix + 1) * bs - 2; x++) {
            const i = (y * w + x) * 4, ir = (y * w + x + 1) * 4, ir2 = (y * w + x + 2) * 4;
            const g0 = pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
            const g1 = pixels[ir] * 0.299 + pixels[ir + 1] * 0.587 + pixels[ir + 2] * 0.114;
            const g2 = pixels[ir2] * 0.299 + pixels[ir2 + 1] * 0.587 + pixels[ir2 + 2] * 0.114;
            gs += Math.abs(g1 - g0); mn += Math.abs(2 * g1 - g0 - g2); c++;
        }
        total++;
        const ag = c > 0 ? gs / c : 0, am = c > 0 ? mn / c : 0;
        if (ag < 5 && c > 0) { smooth++; microSum += ag > 0.5 ? am / ag : am; }
    }
    const sf = total > 0 ? smooth / total : 0, amr = smooth > 0 ? microSum / smooth : 0;
    let score = 50;
    if (sf > 0.6) score += 20; else if (sf > 0.45) score += 12; else if (sf > 0.3) score += 5; else if (sf < 0.08) score -= 15; else if (sf < 0.15) score -= 8;
    if (amr < 0.3) score += 20; else if (amr < 0.6) score += 12; else if (amr < 1) score += 3; else if (amr > 2.5) score -= 18; else if (amr > 1.8) score -= 10;
    return { name: "Gradient Micro-Texture", score: Math.max(5, Math.min(95, score)), weight: 1.5 };
}

function analyzeColorCorrelation(pixels: Uint8ClampedArray, w: number, h: number) {
    const tp = w * h, ss = Math.max(1, Math.floor(tp / 50000));
    let sR = 0, sG = 0, sB = 0, sRR = 0, sGG = 0, sBB = 0, sRG = 0, sGB = 0, sRB = 0, c = 0;
    for (let i = 0; i < tp * 4; i += ss * 4) {
        const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
        sR += r; sG += g; sB += b; sRR += r * r; sGG += g * g; sBB += b * b; sRG += r * g; sGB += g * b; sRB += r * b; c++;
    }
    if (c < 100) return { name: "Color Correlation", score: 50, weight: 2.0 };
    const mR = sR / c, mG = sG / c, mB = sB / c;
    const vR = sRR / c - mR * mR, vG = sGG / c - mG * mG, vB = sBB / c - mB * mB;
    const cRG = (vR > 0 && vG > 0) ? (sRG / c - mR * mG) / Math.sqrt(vR * vG) : 0;
    const cGB = (vG > 0 && vB > 0) ? (sGB / c - mG * mB) / Math.sqrt(vG * vB) : 0;
    const cRB = (vR > 0 && vB > 0) ? (sRB / c - mR * mB) / Math.sqrt(vR * vB) : 0;
    const avgC = (cRG + cGB + cRB) / 3;
    const cSpread = Math.max(cRG, cGB, cRB) - Math.min(cRG, cGB, cRB);
    let score = 50;
    if (avgC > 0.995) score += 10; else if (avgC > 0.92 && avgC < 0.99) score -= 12; else if (avgC < 0.75) score += 15; else if (avgC < 0.85) score += 8;
    if (cSpread > 0.15) score -= 5; else if (cSpread < 0.03) score += 8;
    return { name: "Color Correlation", score: Math.max(10, Math.min(90, score)), weight: 2.0 };
}

function calculateVerdict(signals: { name: string; score: number; weight: number }[]) {
    let tw = 0, ws = 0;
    for (const s of signals) { tw += s.weight; ws += s.score * s.weight; }
    let aiScore = Math.round(tw > 0 ? ws / tw : 50);
    let alw = 0, rlw = 0, sai = 0, sr = 0, vsai = 0, vsr = 0;
    for (const s of signals) {
        if (s.score > 50) alw += s.weight; if (s.score < 50) rlw += s.weight;
        if (s.score >= 65) sai++; if (s.score <= 35) sr++;
        if (s.score >= 78) vsai++; if (s.score <= 22) vsr++;
    }
    let adj = 0;
    if (vsai >= 3) adj += 14; else if (sai >= 5) adj += 12; else if (sai >= 3) adj += 8; else if (sai >= 2) adj += 5; else if (sai >= 1) adj += 2;
    if (vsr >= 3) adj -= 14; else if (sr >= 5) adj -= 12; else if (sr >= 3) adj -= 8; else if (sr >= 2) adj -= 5; else if (sr >= 1) adj -= 2;
    const wr = tw > 0 ? (alw - rlw) / tw : 0; adj += Math.round(wr * 14);
    const dev = aiScore - 50;
    if (Math.abs(dev) > 1) { adj += Math.round(dev * 1.1 + Math.sign(dev) * (dev * dev) * 0.025); }
    const meta = signals.find(s => s.name === "Metadata Analysis");
    if (meta) { if (meta.score >= 90) adj += 25; else if (meta.score <= 15) adj -= 25; }
    let hR = 0, hA = 0;
    for (const s of signals) { if (s.weight >= 3) { if (s.score < 40) hR++; if (s.score > 60) hA++; } }
    if (hR >= 2 && hA === 0 && aiScore + adj > 50) adj -= 5;
    aiScore = Math.round(Math.max(3, Math.min(97, aiScore + adj)));
    let verdict: "ai" | "real" | "uncertain", confidence: number;
    if (aiScore >= 55) { verdict = "ai"; confidence = Math.min(100, Math.round(50 + (aiScore - 55) * 1.1)); }
    else if (aiScore <= 40) { verdict = "real"; confidence = Math.min(100, Math.round(50 + (40 - aiScore) * 1.3)); }
    else { verdict = "uncertain"; confidence = Math.round(100 - Math.abs(aiScore - 47) * 6); }
    return { aiScore, verdict, confidence };
}

export async function analyzeImageBuffer(buffer: Buffer, fileName: string): Promise<ServerAnalysisResult> {
    // Dynamic import to avoid issues in client-side bundling
    const { createCanvas, loadImage } = await import("canvas");
    const start = Date.now();

    const img = await loadImage(buffer);
    let w = img.width, h = img.height;
    if (w > MAX_DIM || h > MAX_DIM) {
        const scale = MAX_DIM / Math.max(w, h);
        w = Math.round(w * scale); h = Math.round(h * scale);
    }
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);
    const imageData = ctx.getImageData(0, 0, w, h);
    const pixels = imageData.data as unknown as Uint8ClampedArray;

    const signals = [
        analyzeMetadata(fileName),
        analyzeSpectralNyquist(pixels, w, h),
        analyzeNoiseResidual(pixels, w, h),
        analyzeEdgeCoherence(pixels, w, h),
        analyzeGradientMicroTexture(pixels, w, h),
        analyzeColorCorrelation(pixels, w, h),
    ];

    const { aiScore, verdict, confidence } = calculateVerdict(signals);
    const format = fileName.toLowerCase().endsWith(".png") ? "PNG" : "JPEG";

    return {
        verdict, confidence, aiScore, signals,
        processingTimeMs: Date.now() - start,
        imageInfo: { width: img.width, height: img.height, format },
    };
}
