/**
 * SourceVerify Benchmark - All-in-one
 * 1. Tự động tải ảnh có nhãn (AI + Real)
 * 2. Test với logic phân tích của dự án
 * 3. Ghi log chi tiết từng ảnh để tối ưu
 *
 * Usage: node bench/benchmark.js [--count=100] [--skip-download]
 */

const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ===================== CONFIG =====================
const ARGS = process.argv.slice(2);
const IMAGE_COUNT = parseInt((ARGS.find(a => a.startsWith('--count=')) || '--count=200').split('=')[1], 10);
const SKIP_DOWNLOAD = ARGS.includes('--skip-download');
const AI_COUNT = Math.ceil(IMAGE_COUNT / 2);
const REAL_COUNT = IMAGE_COUNT - AI_COUNT;

const BENCH_DIR = path.join(__dirname, 'images');
const LOG_FILE = path.join(__dirname, 'bench.log');
const DETAIL_LOG = path.join(__dirname, 'signals_detail.log');
const RESULT_FILE = path.join(__dirname, 'results.json');
const CONCURRENT = 6;
const MAX_DIM = 1024;

// ===================== LOGGING =====================
function clearLog() {
    fs.writeFileSync(LOG_FILE, '');
    fs.writeFileSync(DETAIL_LOG, '');
}
function log(msg) {
    const line = `[${new Date().toLocaleTimeString()}] ${msg}`;
    fs.appendFileSync(LOG_FILE, line + '\n');
    console.log(line);
}
function detailLog(msg) {
    fs.appendFileSync(DETAIL_LOG, msg + '\n');
}

// ===================== DOWNLOAD =====================
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function downloadFile(url, dest, retries = 0) {
    return new Promise((resolve, reject) => {
        const proto = url.startsWith('https') ? https : http;
        const req = proto.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', Accept: 'image/*,*/*' },
            timeout: 30000
        }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                let rUrl = res.headers.location;
                if (rUrl.startsWith('/')) { const u = new URL(url); rUrl = `${u.protocol}//${u.hostname}${rUrl}`; }
                downloadFile(rUrl, dest, retries).then(resolve).catch(reject);
                return;
            }
            if (res.statusCode !== 200) {
                if (retries < 4) setTimeout(() => downloadFile(url, dest, retries + 1).then(resolve).catch(reject), 1000 * (retries + 1));
                else reject(new Error(`HTTP ${res.statusCode}`));
                return;
            }
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => {
                const buf = Buffer.concat(chunks);
                if (buf.length < 3000) {
                    if (retries < 4) setTimeout(() => downloadFile(url, dest, retries + 1).then(resolve).catch(reject), 1000);
                    else reject(new Error(`Too small: ${buf.length}B`));
                    return;
                }
                fs.writeFileSync(dest, buf);
                resolve();
            });
            res.on('error', e => { if (retries < 4) setTimeout(() => downloadFile(url, dest, retries + 1).then(resolve).catch(reject), 1000); else reject(e); });
        });
        req.on('error', e => { if (retries < 4) setTimeout(() => downloadFile(url, dest, retries + 1).then(resolve).catch(reject), 1000 * (retries + 1)); else reject(e); });
        req.on('timeout', () => { req.destroy(); if (retries < 4) setTimeout(() => downloadFile(url, dest, retries + 1).then(resolve).catch(reject), 2000); else reject(new Error('Timeout')); });
    });
}

async function downloadImages() {
    if (!fs.existsSync(BENCH_DIR)) fs.mkdirSync(BENCH_DIR, { recursive: true });

    const existing = (d) => { try { return fs.readdirSync(BENCH_DIR).filter(f => f.startsWith(d) && f.endsWith('.jpg')).length; } catch { return 0; } };
    const aiExist = existing('ai_');
    const realExist = existing('real_');

    log(`📦 Images: ${aiExist} AI, ${realExist} Real exist. Target: ${AI_COUNT} AI + ${REAL_COUNT} Real`);

    // Download AI images (thispersondoesnotexist.com - StyleGAN)
    const aiNeeded = [];
    for (let i = 1; i <= AI_COUNT; i++) {
        const fname = `ai_${String(i).padStart(4, '0')}.jpg`;
        if (!fs.existsSync(path.join(BENCH_DIR, fname))) {
            aiNeeded.push({ url: `https://thispersondoesnotexist.com/?${Date.now()}_${i}`, dest: path.join(BENCH_DIR, fname) });
        }
    }

    if (aiNeeded.length > 0) {
        log(`⬇️  Downloading ${aiNeeded.length} AI images...`);
        let ok = 0, fail = 0;
        for (let i = 0; i < aiNeeded.length; i += CONCURRENT) {
            const batch = aiNeeded.slice(i, i + CONCURRENT);
            await Promise.allSettled(batch.map(async item => {
                try { await downloadFile(item.url, item.dest); ok++; } catch { fail++; }
            }));
            if ((ok + fail) % 20 === 0 || i + CONCURRENT >= aiNeeded.length) {
                process.stdout.write(`\r  AI: ${ok}/${aiNeeded.length} ok, ${fail} fail`);
            }
            await sleep(200);
        }
        console.log('');
        log(`  AI download done: ${ok} ok, ${fail} fail`);
    }

    // Download Real images (picsum.photos - real Unsplash photos)
    const realNeeded = [];
    for (let i = 1; i <= REAL_COUNT; i++) {
        const fname = `real_${String(i).padStart(4, '0')}.jpg`;
        if (!fs.existsSync(path.join(BENCH_DIR, fname))) {
            const w = 800 + (i % 5) * 100, h = 600 + (i % 4) * 100;
            realNeeded.push({ url: `https://picsum.photos/${w}/${h}?random=${i}&t=${Date.now()}`, dest: path.join(BENCH_DIR, fname) });
        }
    }

    if (realNeeded.length > 0) {
        log(`⬇️  Downloading ${realNeeded.length} Real images...`);
        let ok = 0, fail = 0;
        for (let i = 0; i < realNeeded.length; i += CONCURRENT) {
            const batch = realNeeded.slice(i, i + CONCURRENT);
            await Promise.allSettled(batch.map(async item => {
                try { await downloadFile(item.url, item.dest); ok++; } catch { fail++; }
            }));
            if ((ok + fail) % 20 === 0 || i + CONCURRENT >= realNeeded.length) {
                process.stdout.write(`\r  Real: ${ok}/${realNeeded.length} ok, ${fail} fail`);
            }
            await sleep(200);
        }
        console.log('');
        log(`  Real download done: ${ok} ok, ${fail} fail`);
    }

    const finalAI = existing('ai_');
    const finalReal = existing('real_');
    log(`📦 Final: ${finalAI} AI + ${finalReal} Real = ${finalAI + finalReal} images`);
    return { ai: finalAI, real: finalReal };
}

// ===================== SIGNAL FUNCTIONS =====================
const AI_SIGS = ["midjourney", "dall-e", "dalle", "stable diffusion", "comfyui", "automatic1111", "a1111", "novelai", "civitai", "invoke ai", "adobe firefly", "firefly", "bing image creator", "leonardo ai", "playground ai", "deep dream", "artbreeder", "nightcafe", "craiyon", "dreamstudio", "flux", "sora", "runway", "pika", "kling", "hailuo", "luma dream", "minimax", "genmo", "ideogram", "recraft", "grok", "gemini", "imagen", "copilot designer", "meta ai", "stability ai", "sdxl", "sd3", "kandinsky", "wuerstchen", "pixart", "deepfloyd", "kolors", "hunyuan", "cogview", "glide", "veo", "lumiere", "dream machine", "emu"];
const CAM_SIGS = ["canon", "nikon", "sony", "fujifilm", "olympus", "panasonic", "leica", "hasselblad", "pentax", "samsung", "apple", "google pixel", "huawei", "xiaomi", "oppo", "oneplus", "vivo", "realme", "motorola", "nokia", "dji", "gopro", "ricoh", "sigma", "phase one", "red", "blackmagic", "arri"];

function analyzeMetadata(fileName, fileSize) {
    let score = 50;
    const fn = fileName.toLowerCase();
    for (const sig of AI_SIGS) { if (fn.includes(sig)) { score = 95; break; } }
    if (score === 50) { for (const cam of CAM_SIGS) { if (fn.includes(cam)) { score = 10; break; } } }
    const ext = path.extname(fn).toLowerCase();
    if (ext === '.png' && fileSize > 2 * 1024 * 1024) score = Math.min(score + 10, 95);
    return { name: "Metadata", score, weight: 1.5 };
}

function analyzeSpectralNyquist(pixels, w, h) {
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
    for (let k = 0; k <= hs; k++) fp[k] /= rc;
    const lp = new Float64Array(hs + 1); for (let k = 0; k <= hs; k++) lp[k] = Math.log10(fp[k] + 1);
    const nyq = lp[hs], n1 = hs > 1 ? lp[hs - 1] : nyq, n2 = hs > 2 ? lp[hs - 2] : n1, n3 = hs > 3 ? lp[hs - 3] : n2;
    const nAvg = (n1 + n2 + n3) / 3, pr = nAvg > 0 ? nyq / nAvg : 1;
    const lf = (lp[1] + lp[2] + lp[3]) / 3, hf = (lp[hs - 3] + lp[hs - 2] + lp[hs - 1]) / 3;
    const rr = lf > 0 ? hf / lf : 0;
    let score = 50;
    if (pr > 1.5) score += 20; else if (pr > 1.2) score += 10; else if (pr < 0.9) score -= 15;
    if (rr > 0.5) score += 15; else if (rr > 0.3) score += 5; else if (rr < 0.15) score -= 15; else if (rr < 0.2) score -= 5;
    const isPow2 = (d) => d > 0 && (d & (d - 1)) === 0;
    const stdRes = [256, 384, 512, 640, 768, 896, 1024, 1080, 1152, 1280, 1344, 1408, 1472, 1536, 1920, 2048, 2560, 3072, 4096];
    if ((isPow2(w) && isPow2(h)) || (stdRes.includes(w) && stdRes.includes(h))) score += 5;
    return { name: "Spectral", score: Math.max(10, Math.min(90, score)), weight: 3.0, debug: { pr: pr.toFixed(3), rr: rr.toFixed(3) } };
}

function analyzeNoiseResidual(pixels, w, h) {
    const bs = 32, bx = Math.floor(w / bs), by = Math.floor(h / bs);
    const devs = [], brights = [];
    const step = Math.max(1, Math.floor(bx * by / 300));
    for (let iy = 0; iy < by; iy += step) for (let ix = 0; ix < bx; ix += step) {
        let sr = 0, sr2 = 0, sb = 0, c = 0;
        for (let y = iy * bs + 1; y < (iy + 1) * bs - 1; y++) for (let x = ix * bs + 1; x < (ix + 1) * bs - 1; x++) {
            const g = (py, px) => { const i = (py * w + px) * 4; return pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114; };
            const center = g(y, x), lap = 4 * center - g(y, x - 1) - g(y, x + 1) - g(y - 1, x) - g(y + 1, x);
            sr += lap; sr2 += lap * lap; sb += center; c++;
        }
        if (c > 0) { const m = sr / c, v = sr2 / c - m * m; devs.push(Math.sqrt(Math.max(0, v))); brights.push(sb / c); }
    }
    if (devs.length < 4) return { name: "Noise", score: 50, weight: 3.5, debug: { blocks: devs.length } };
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
    return { name: "Noise", score: Math.max(5, Math.min(95, score)), weight: 3.5, debug: { cv: cv.toFixed(3), shotCorr: shotCorr.toFixed(3), mean: mean.toFixed(2) } };
}

function analyzeEdgeCoherence(pixels, w, h) {
    const mags = [];
    const step = Math.max(1, Math.floor(Math.min(w, h) / 300));
    for (let y = 1; y < h - 1; y += step) for (let x = 1; x < w - 1; x += step) {
        const g = (px, py) => { const i = (py * w + px) * 4; return pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114; };
        const gx = -g(x - 1, y - 1) - 2 * g(x - 1, y) - g(x - 1, y + 1) + g(x + 1, y - 1) + 2 * g(x + 1, y) + g(x + 1, y + 1);
        const gy = -g(x - 1, y - 1) - 2 * g(x, y - 1) - g(x + 1, y - 1) + g(x - 1, y + 1) + 2 * g(x, y + 1) + g(x + 1, y + 1);
        mags.push(Math.sqrt(gx * gx + gy * gy));
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
    return { name: "Edge", score: Math.max(5, Math.min(95, score)), weight: 1.5, debug: { p50: p50.toFixed(2), sharpR: sharpR.toFixed(2) } };
}

function analyzeGradientMicroTexture(pixels, w, h) {
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
    return { name: "Gradient", score: Math.max(5, Math.min(95, score)), weight: 1.5, debug: { sf: sf.toFixed(3), amr: amr.toFixed(3) } };
}

function analyzeColorCorrelation(pixels, w, h) {
    const tp = w * h, ss = Math.max(1, Math.floor(tp / 50000));
    let sR = 0, sG = 0, sB = 0, sRR = 0, sGG = 0, sBB = 0, sRG = 0, sGB = 0, sRB = 0, c = 0;
    for (let i = 0; i < tp * 4; i += ss * 4) {
        const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
        sR += r; sG += g; sB += b; sRR += r * r; sGG += g * g; sBB += b * b; sRG += r * g; sGB += g * b; sRB += r * b; c++;
    }
    if (c < 100) return { name: "Color", score: 50, weight: 2.0, debug: { c } };
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
    return { name: "Color", score: Math.max(10, Math.min(90, score)), weight: 2.0, debug: { avgC: avgC.toFixed(4), cSpread: cSpread.toFixed(4) } };
}

function analyzeBenfordsLaw(pixels, w, h) {
    const diffs = [];
    const step = Math.max(1, Math.floor(w * h / 100000));
    for (let i = 0; i < (w * h - 1) * 4; i += step * 4) {
        const g1 = pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
        const g2 = pixels[i + 4] * 0.299 + pixels[i + 5] * 0.587 + pixels[i + 6] * 0.114;
        const d = Math.abs(g1 - g2);
        if (d >= 1) diffs.push(Math.floor(d));
    }
    if (diffs.length < 100) return { name: "Benford", score: 50, weight: 1.0, debug: {} };
    const digits = new Array(10).fill(0);
    for (const d of diffs) { const fd = String(d)[0]; digits[parseInt(fd)]++; }
    const total = diffs.length;
    const benford = [0, 0.301, 0.176, 0.125, 0.097, 0.079, 0.067, 0.058, 0.051, 0.046];
    let chi2 = 0;
    for (let d = 1; d <= 9; d++) { const obs = digits[d] / total, exp = benford[d]; chi2 += (obs - exp) ** 2 / exp; }
    let score = 50;
    if (chi2 < 0.01) score -= 15; else if (chi2 < 0.05) score -= 8; else if (chi2 > 0.3) score += 20; else if (chi2 > 0.15) score += 10;
    return { name: "Benford", score: Math.max(10, Math.min(90, score)), weight: 1.0, debug: { chi2: chi2.toFixed(4) } };
}

function analyzeDCT(pixels, w, h) {
    if (w < 16 || h < 16) return { name: "DCT", score: 50, weight: 2.0, debug: { error: 'too small' } };
    const getGray = (px, py) => { const i = (py * w + px) * 4; return pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114; };
    const blockSize = 8, bx = Math.floor(w / blockSize) - 1, by = Math.floor(h / blockSize) - 1;
    const maxBlocks = 400, step = Math.max(1, Math.floor(bx * by / maxBlocks));
    let boundaryDiffs = 0, innerDiffs = 0, bc = 0, ic = 0;
    for (let iy = 0; iy < by; iy += step) for (let ix = 0; ix < bx; ix += step) {
        const x0 = ix * blockSize, y0 = iy * blockSize;
        for (let y = y0; y < y0 + blockSize; y++) {
            const bx1 = x0 + blockSize;
            if (bx1 < w - 1) { boundaryDiffs += Math.abs(getGray(bx1 - 1, y) - getGray(bx1, y)); bc++; }
            if (x0 + 3 < w) { innerDiffs += Math.abs(getGray(x0 + 3, y) - getGray(x0 + 4, y)); ic++; }
        }
    }
    const boundaryAvg = bc > 0 ? boundaryDiffs / bc : 0;
    const innerAvg = ic > 0 ? innerDiffs / ic : 0;
    const ratio = innerAvg > 0 ? boundaryAvg / innerAvg : 1;
    let score = 50;
    if (ratio > 1.8) score -= 25; else if (ratio > 1.4) score -= 15; else if (ratio > 1.15) score -= 8; else if (ratio < 0.95) score += 15; else if (ratio < 1.02) score += 8;
    return { name: "DCT", score: Math.max(10, Math.min(90, score)), weight: 2.0, debug: { ratio: ratio.toFixed(3), boundaryAvg: boundaryAvg.toFixed(2), innerAvg: innerAvg.toFixed(2) } };
}

function analyzePRNU(pixels, w, h) {
    const bs = 64, bx = Math.floor(w / bs), by = Math.floor(h / bs);
    if (bx < 2 || by < 2) return { name: "PRNU", score: 50, weight: 1.5, debug: { error: 'too small' } };
    const residuals = [];
    for (let iy = 0; iy < by; iy++) for (let ix = 0; ix < bx; ix++) {
        let sum = 0, sum2 = 0, c = 0;
        for (let y = iy * bs + 1; y < (iy + 1) * bs - 1; y++) for (let x = ix * bs + 1; x < (ix + 1) * bs - 1; x++) {
            const i = (y * w + x) * 4;
            const gray = pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
            const ip = (y * w + (x + 1)) * 4;
            const grayR = pixels[ip] * 0.299 + pixels[ip + 1] * 0.587 + pixels[ip + 2] * 0.114;
            const d = gray - grayR;
            sum += d; sum2 += d * d; c++;
        }
        if (c > 0) residuals.push(Math.sqrt(sum2 / c - (sum / c) ** 2));
    }
    if (residuals.length < 4) return { name: "PRNU", score: 50, weight: 1.5, debug: {} };
    const mean = residuals.reduce((a, b) => a + b, 0) / residuals.length;
    const cv = mean > 0 ? Math.sqrt(residuals.reduce((a, b) => a + (b - mean) ** 2, 0) / residuals.length) / mean : 0;
    let score = 50;
    if (cv < 0.15) score += 20; else if (cv < 0.3) score += 10; else if (cv > 0.6) score -= 15; else if (cv > 0.45) score -= 8;
    return { name: "PRNU", score: Math.max(10, Math.min(90, score)), weight: 1.5, debug: { cv: cv.toFixed(3), mean: mean.toFixed(2) } };
}

// ===================== VERDICT ENGINE =====================
function calculateVerdict(signals) {
    let tw = 0, ws = 0;
    for (const s of signals) { tw += s.weight; ws += s.score * s.weight; }
    let aiScore = Math.round(tw > 0 ? ws / tw : 50);

    let sai = 0, sr = 0, vsai = 0, vsr = 0, alw = 0, rlw = 0;
    for (const s of signals) {
        if (s.score > 50) alw += s.weight; if (s.score < 50) rlw += s.weight;
        if (s.score >= 65) sai++; if (s.score <= 35) sr++;
        if (s.score >= 78) vsai++; if (s.score <= 22) vsr++;
    }

    let adj = 0;
    if (vsai >= 3) adj += 14; else if (sai >= 5) adj += 12; else if (sai >= 3) adj += 8; else if (sai >= 2) adj += 5;
    if (vsr >= 3) adj -= 14; else if (sr >= 5) adj -= 12; else if (sr >= 3) adj -= 8; else if (sr >= 2) adj -= 5;

    const wr = tw > 0 ? (alw - rlw) / tw : 0;
    adj += Math.round(wr * 14);

    const dev = aiScore - 50;
    if (Math.abs(dev) > 1) adj += Math.round(dev * 1.1 + Math.sign(dev) * (dev * dev) * 0.025);

    const meta = signals.find(s => s.name === "Metadata");
    if (meta) { if (meta.score >= 90) adj += 25; else if (meta.score <= 15) adj -= 25; }

    let hR = 0, hA = 0;
    for (const s of signals) { if (s.weight >= 3) { if (s.score < 40) hR++; if (s.score > 60) hA++; } }
    if (hR >= 2 && hA === 0 && aiScore + adj > 50) adj -= 5;

    aiScore = Math.round(Math.max(3, Math.min(97, aiScore + adj)));

    let verdict, confidence;
    if (aiScore >= 55) { verdict = "ai"; confidence = Math.min(100, Math.round(50 + (aiScore - 55) * 1.1)); }
    else if (aiScore <= 40) { verdict = "real"; confidence = Math.min(100, Math.round(50 + (40 - aiScore) * 1.3)); }
    else { verdict = "uncertain"; confidence = Math.round(100 - Math.abs(aiScore - 47) * 6); }

    return { aiScore, verdict, confidence };
}

// ===================== ANALYZE IMAGE =====================
async function analyzeImage(filePath) {
    const img = await loadImage(filePath);
    let w = img.width, h = img.height;
    if (w > MAX_DIM || h > MAX_DIM) { const s = MAX_DIM / Math.max(w, h); w = Math.round(w * s); h = Math.round(h * s); }

    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    const { data: pixels } = ctx.getImageData(0, 0, w, h);

    const fileName = path.basename(filePath);
    const fileSize = fs.statSync(filePath).size;

    const signals = [
        analyzeMetadata(fileName, fileSize),
        analyzeSpectralNyquist(pixels, w, h),
        analyzeNoiseResidual(pixels, w, h),
        analyzeEdgeCoherence(pixels, w, h),
        analyzeGradientMicroTexture(pixels, w, h),
        analyzeColorCorrelation(pixels, w, h),
        analyzeBenfordsLaw(pixels, w, h),
        analyzeDCT(pixels, w, h),
        analyzePRNU(pixels, w, h),
    ];

    const { aiScore, verdict, confidence } = calculateVerdict(signals);
    return { fileName, verdict, aiScore, confidence, signals, dims: `${img.width}x${img.height}` };
}

// ===================== RUN BENCHMARK =====================
async function runBenchmark() {
    clearLog();
    log('══════════════════════════════════════════════════════════');
    log('  SourceVerify Benchmark');
    log('══════════════════════════════════════════════════════════');

    // Step 1: Download
    if (!SKIP_DOWNLOAD) {
        log('\n📥 PHASE 1: Download images...');
        await downloadImages();
    } else {
        log('\n⏭️  Skipping download (--skip-download)');
    }

    // Step 2: Collect files
    if (!fs.existsSync(BENCH_DIR)) { log('❌ No images directory!'); return; }
    const allFiles = fs.readdirSync(BENCH_DIR).filter(f => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp'));
    const aiFiles = allFiles.filter(f => f.startsWith('ai_')).sort();
    const realFiles = allFiles.filter(f => f.startsWith('real_')).sort();

    if (aiFiles.length === 0 && realFiles.length === 0) { log('❌ No benchmark images found!'); return; }

    log(`\n🔬 PHASE 2: Benchmark ${aiFiles.length} AI + ${realFiles.length} Real = ${aiFiles.length + realFiles.length} images`);

    // Detail log header
    detailLog('# SourceVerify Benchmark Detail Log');
    detailLog(`# Date: ${new Date().toISOString()}`);
    detailLog(`# Images: ${aiFiles.length} AI + ${realFiles.length} Real`);
    detailLog('#');
    detailLog('# Format: FILE | TRUTH | VERDICT | SCORE | CONF | SIGNAL_NAME:score(debug) ...');
    detailLog('# ════════════════════════════════════════════════════════');

    let tp = 0, fn = 0, fp = 0, tn = 0, aiUnc = 0, realUnc = 0;
    const errors = [];
    const startTime = Date.now();

    // Phase 2a: AI images
    log('\n🤖 Testing AI images...');
    for (let i = 0; i < aiFiles.length; i++) {
        try {
            const r = await analyzeImage(path.join(BENCH_DIR, aiFiles[i]));
            if (r.verdict === 'ai') tp++;
            else if (r.verdict === 'real') { fn++; errors.push({ file: r.fileName, truth: 'ai', verdict: r.verdict, score: r.aiScore, signals: r.signals }); }
            else aiUnc++;

            // Detail log every image
            const sigStr = r.signals.map(s => {
                const dbg = s.debug ? `(${Object.entries(s.debug).map(([k, v]) => `${k}=${v}`).join(',')})` : '';
                return `${s.name}:${s.score}${dbg}`;
            }).join(' | ');
            const mark = r.verdict === 'ai' ? '✓' : r.verdict === 'real' ? '✗FN' : '?';
            detailLog(`${mark} ${r.fileName} | AI | ${r.verdict} | ${r.aiScore} | ${r.confidence}% | ${sigStr}`);

            if ((i + 1) % 50 === 0) log(`  AI ${i + 1}/${aiFiles.length}: TP=${tp} FN=${fn} Unc=${aiUnc}`);
        } catch (e) { log(`  ERROR: ${aiFiles[i]} - ${e.message}`); }
    }
    log(`  ✅ AI done: TP=${tp} FN=${fn} Uncertain=${aiUnc}`);

    // Phase 2b: Real images
    log('\n📸 Testing Real images...');
    for (let i = 0; i < realFiles.length; i++) {
        try {
            const r = await analyzeImage(path.join(BENCH_DIR, realFiles[i]));
            if (r.verdict === 'real') tn++;
            else if (r.verdict === 'ai') { fp++; errors.push({ file: r.fileName, truth: 'real', verdict: r.verdict, score: r.aiScore, signals: r.signals }); }
            else realUnc++;

            const sigStr = r.signals.map(s => {
                const dbg = s.debug ? `(${Object.entries(s.debug).map(([k, v]) => `${k}=${v}`).join(',')})` : '';
                return `${s.name}:${s.score}${dbg}`;
            }).join(' | ');
            const mark = r.verdict === 'real' ? '✓' : r.verdict === 'ai' ? '✗FP' : '?';
            detailLog(`${mark} ${r.fileName} | REAL | ${r.verdict} | ${r.aiScore} | ${r.confidence}% | ${sigStr}`);

            if ((i + 1) % 50 === 0) log(`  Real ${i + 1}/${realFiles.length}: TN=${tn} FP=${fp} Unc=${realUnc}`);
        } catch (e) { log(`  ERROR: ${realFiles[i]} - ${e.message}`); }
    }
    log(`  ✅ Real done: TN=${tn} FP=${fp} Uncertain=${realUnc}`);

    // Step 3: Results
    const elapsed = Date.now() - startTime;
    const total = tp + fn + fp + tn + aiUnc + realUnc;
    const strictTotal = tp + fn + fp + tn;
    const strictAcc = strictTotal > 0 ? tp + tn : 0;
    const precision = (tp + fp) > 0 ? tp / (tp + fp) : 0;
    const recall = (tp + fn) > 0 ? tp / (tp + fn) : 0;
    const f1 = (precision + recall) > 0 ? 2 * precision * recall / (precision + recall) : 0;

    const report = `
══════════════════════════════════════════════════════════
  📊 BENCHMARK RESULTS
══════════════════════════════════════════════════════════
  Total: ${total} images in ${(elapsed / 1000).toFixed(1)}s (${total > 0 ? (elapsed / total).toFixed(0) : 0}ms/img)

  🤖 AI (${aiFiles.length}):  TP=${tp} (${aiFiles.length > 0 ? (tp / aiFiles.length * 100).toFixed(1) : 0}%)  FN=${fn}  Unc=${aiUnc}
  📸 Real (${realFiles.length}): TN=${tn} (${realFiles.length > 0 ? (tn / realFiles.length * 100).toFixed(1) : 0}%)  FP=${fp}  Unc=${realUnc}

  📐 Metrics:
     Strict Accuracy: ${strictTotal > 0 ? (strictAcc / strictTotal * 100).toFixed(1) : 0}% (${strictAcc}/${strictTotal})
     Precision:       ${(precision * 100).toFixed(1)}%
     Recall:          ${(recall * 100).toFixed(1)}%
     F1-Score:        ${(f1 * 100).toFixed(1)}%
══════════════════════════════════════════════════════════`;

    log(report);

    if (errors.length > 0) {
        log(`\n❌ MISCLASSIFIED (${errors.length}):`);
        detailLog('\n# ════════════════════════════════════════════════════════');
        detailLog('# MISCLASSIFIED IMAGES:');
        for (const e of errors) {
            log(`  ${e.file}: truth=${e.truth} verdict=${e.verdict} score=${e.score}`);
            const sigStr = e.signals.map(s => `${s.name}:${s.score}`).join(', ');
            detailLog(`  ${e.file} | truth=${e.truth} | verdict=${e.verdict} | score=${e.score} | ${sigStr}`);
        }
    }

    // Save JSON
    const resultData = {
        timestamp: new Date().toISOString(),
        elapsed_ms: elapsed,
        counts: { ai: aiFiles.length, real: realFiles.length, total },
        results: { tp, fn, fp, tn, aiUncertain: aiUnc, realUncertain: realUnc },
        metrics: {
            strictAccuracy: strictTotal > 0 ? strictAcc / strictTotal : 0,
            precision, recall, f1,
            avgMs: total > 0 ? elapsed / total : 0
        },
        errors: errors.map(e => ({ file: e.file, truth: e.truth, verdict: e.verdict, score: e.score, signals: e.signals.map(s => ({ name: s.name, score: s.score })) }))
    };
    fs.writeFileSync(RESULT_FILE, JSON.stringify(resultData, null, 2));
    log(`\n💾 Results: ${RESULT_FILE}`);
    log(`📋 Detail log: ${DETAIL_LOG}`);
    log(`📝 Summary log: ${LOG_FILE}`);
}

runBenchmark().catch(e => { log(`FATAL: ${e.message}`); console.error(e); process.exit(1); });
