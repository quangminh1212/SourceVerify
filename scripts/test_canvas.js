/**
 * Quick signal diagnostic - compare AI vs Real image signal scores
 */
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

const AI_SOFTWARE_SIGNATURES = ["midjourney", "dall-e", "dalle", "stable diffusion", "comfyui"];
const REAL_CAMERA_SIGNATURES = ["canon", "nikon", "sony", "fujifilm", "apple", "google pixel"];

function analyzeMetadata(fn) { let s = 50; const f = fn.toLowerCase(); for (const sig of AI_SOFTWARE_SIGNATURES) if (f.includes(sig)) { s = 95; break; } if (s === 50) for (const c of REAL_CAMERA_SIGNATURES) if (f.includes(c)) { s = 10; break; } return { name: "Metadata", score: s, weight: 1.5 }; }

// Simplified signal analysis for quick diagnostic
function quickSignals(pixels, w, h) {
    // Noise CV
    const bs = 32, bX = Math.floor(w / bs), bY = Math.floor(h / bs);
    const stds = []; const step = Math.max(1, Math.floor(bX * bY / 200));
    for (let by = 0; by < bY; by += step) for (let bx = 0; bx < bX; bx += step) {
        let sr = 0, sr2 = 0, cnt = 0;
        for (let y = by * bs + 1; y < (by + 1) * bs - 1; y++) for (let x = bx * bs + 1; x < (bx + 1) * bs - 1; x++) {
            const g = (py, px) => { const i = (py * w + px) * 4; return pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114; };
            const lap = 4 * g(y, x) - g(y, x - 1) - g(y, x + 1) - g(y - 1, x) - g(y + 1, x);
            sr += lap; sr2 += lap * lap; cnt++;
        }
        if (cnt > 0) { const m = sr / cnt, v = sr2 / cnt - m * m; stds.push(Math.sqrt(Math.max(0, v))); }
    }
    const noiseM = stds.reduce((a, b) => a + b, 0) / stds.length;
    const noiseV = stds.reduce((a, b) => a + (b - noiseM) ** 2, 0) / stds.length;
    const noiseCV = noiseM > 0 ? Math.sqrt(noiseV) / noiseM : 0;

    // Edge p50
    const edgeMags = [];
    const eStep = Math.max(1, Math.floor(Math.min(w, h) / 300));
    for (let y = 1; y < h - 1; y += eStep) for (let x = 1; x < w - 1; x += eStep) {
        const g = (py, px) => { const i = (py * w + px) * 4; return pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114; };
        const gx = -g(y - 1, x - 1) - 2 * g(y, x - 1) - g(y + 1, x - 1) + g(y - 1, x + 1) + 2 * g(y, x + 1) + g(y + 1, x + 1);
        const gy = -g(y - 1, x - 1) - 2 * g(y - 1, x) - g(y - 1, x + 1) + g(y + 1, x - 1) + 2 * g(y + 1, x) + g(y + 1, x + 1);
        edgeMags.push(Math.sqrt(gx * gx + gy * gy));
    }
    edgeMags.sort((a, b) => a - b);
    const p50 = edgeMags[Math.floor(edgeMags.length * 0.5)];
    const p90 = edgeMags[Math.floor(edgeMags.length * 0.9)];

    // Color correlation
    const totalPx = w * h, ss = Math.max(1, Math.floor(totalPx / 50000));
    let sR = 0, sG = 0, sB = 0, sRR = 0, sGG = 0, sBB = 0, sRG = 0, cnt = 0;
    for (let i = 0; i < totalPx * 4; i += ss * 4) { const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2]; sR += r; sG += g; sB += b; sRR += r * r; sGG += g * g; sBB += b * b; sRG += r * g; cnt++; }
    const mR = sR / cnt, mG = sG / cnt, vR = sRR / cnt - mR * mR, vG = sGG / cnt - mG * mG;
    const corrRG = (vR > 0 && vG > 0) ? (sRG / cnt - mR * mG) / Math.sqrt(vR * vG) : 0;

    return { noiseCV: noiseCV.toFixed(3), noiseLevel: noiseM.toFixed(2), edgeP50: p50.toFixed(1), edgeP90: p90.toFixed(1), colorCorrRG: corrRG.toFixed(4) };
}

async function analyze(filePath) {
    const img = await loadImage(filePath);
    let w = img.width, h = img.height;
    if (w > 1024 || h > 1024) { const s = 1024 / Math.max(w, h); w = Math.round(w * s); h = Math.round(h * s); }
    const c = createCanvas(w, h), ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    const px = ctx.getImageData(0, 0, w, h).data;
    return { dims: `${w}x${h}`, ...quickSignals(px, w, h) };
}

async function main() {
    const dir = path.join(__dirname, '..', 'public', 'benchmark');

    console.log('\n=== AI IMAGES ===');
    for (let i = 1; i <= 10; i++) {
        const f = `ai_face_${String(i).padStart(3, '0')}.jpg`;
        try { const r = await analyze(path.join(dir, f)); console.log(f, r); } catch (e) { console.log(f, 'ERROR'); }
    }

    console.log('\n=== REAL IMAGES ===');
    for (let i = 1; i <= 10; i++) {
        const f = `real_photo_${String(i).padStart(3, '0')}.jpg`;
        try { const r = await analyze(path.join(dir, f)); console.log(f, r); } catch (e) { console.log(f, 'ERROR'); }
    }
}
main().catch(console.error);
