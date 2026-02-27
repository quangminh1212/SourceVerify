/**
 * Download benchmark images for SourceVerify testing
 * - AI images: from thispersondoesnotexist.com (StyleGAN faces)
 * - Real images: from picsum.photos (random real photos from Unsplash)
 * 
 * Usage: node scripts/download_benchmark_images.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BENCHMARK_DIR = path.join(__dirname, '..', 'public', 'benchmark');
const AI_TARGET = 1000;
const REAL_TARGET = 1000;
const CONCURRENT_DOWNLOADS = 8;
const RETRY_MAX = 5;
const DELAY_BETWEEN_REQUESTS = 150;

function countExisting(prefix) {
    const files = fs.readdirSync(BENCHMARK_DIR);
    return files.filter(f => f.startsWith(prefix) && f.endsWith('.jpg')).length;
}

function getExistingIndices(prefix) {
    const files = fs.readdirSync(BENCHMARK_DIR);
    const indices = new Set();
    const pattern = new RegExp(`^${prefix}(\\d+)\\.jpg$`);
    for (const f of files) {
        const m = f.match(pattern);
        if (m) indices.add(parseInt(m[1], 10));
    }
    return indices;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadFile(url, destPath, retries = 0) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;

        const request = protocol.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'image/jpeg,image/png,image/*,*/*'
            },
            timeout: 30000
        }, (response) => {
            // Handle redirects (up to 5)
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                let redirectUrl = response.headers.location;
                if (redirectUrl.startsWith('/')) {
                    const u = new URL(url);
                    redirectUrl = `${u.protocol}//${u.hostname}${redirectUrl}`;
                }
                downloadFile(redirectUrl, destPath, retries)
                    .then(resolve)
                    .catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                if (retries < RETRY_MAX) {
                    setTimeout(() => {
                        downloadFile(url, destPath, retries + 1).then(resolve).catch(reject);
                    }, 1000 * (retries + 1));
                } else {
                    reject(new Error(`HTTP ${response.statusCode} for ${url}`));
                }
                return;
            }

            const chunks = [];
            response.on('data', chunk => chunks.push(chunk));
            response.on('end', () => {
                const buffer = Buffer.concat(chunks);
                if (buffer.length < 5000) {
                    if (retries < RETRY_MAX) {
                        setTimeout(() => {
                            downloadFile(url, destPath, retries + 1).then(resolve).catch(reject);
                        }, 1000);
                    } else {
                        reject(new Error(`File too small: ${buffer.length} bytes`));
                    }
                    return;
                }
                fs.writeFileSync(destPath, buffer);
                resolve(destPath);
            });
            response.on('error', (err) => {
                if (retries < RETRY_MAX) {
                    setTimeout(() => {
                        downloadFile(url, destPath, retries + 1).then(resolve).catch(reject);
                    }, 1000);
                } else { reject(err); }
            });
        });

        request.on('error', (err) => {
            if (retries < RETRY_MAX) {
                setTimeout(() => {
                    downloadFile(url, destPath, retries + 1).then(resolve).catch(reject);
                }, 1000 * (retries + 1));
            } else { reject(err); }
        });

        request.on('timeout', () => {
            request.destroy();
            if (retries < RETRY_MAX) {
                setTimeout(() => {
                    downloadFile(url, destPath, retries + 1).then(resolve).catch(reject);
                }, 2000);
            } else { reject(new Error('Timeout')); }
        });
    });
}

async function downloadBatch(items, type) {
    let completed = 0;
    let failed = 0;
    const total = items.length;

    for (let i = 0; i < items.length; i += CONCURRENT_DOWNLOADS) {
        const chunk = items.slice(i, i + CONCURRENT_DOWNLOADS);
        const promises = chunk.map(async (item) => {
            try {
                await downloadFile(item.url, item.dest);
                completed++;
                if (completed % 10 === 0 || completed === total) {
                    const pct = ((completed / total) * 100).toFixed(1);
                    process.stdout.write(`\r  [${type}] ${completed}/${total} (${pct}%) downloaded, ${failed} failed`);
                }
            } catch (err) {
                failed++;
            }
        });
        await Promise.all(promises);
        await sleep(DELAY_BETWEEN_REQUESTS);
    }
    console.log(`\n  Done ${type}: ${completed} ok, ${failed} failed`);
    return { completed, failed };
}

async function main() {
    console.log('SourceVerify Benchmark Image Downloader');
    console.log('========================================');

    if (!fs.existsSync(BENCHMARK_DIR)) {
        fs.mkdirSync(BENCHMARK_DIR, { recursive: true });
    }

    const existingAI = getExistingIndices('ai_face_');
    const existingReal = getExistingIndices('real_photo_');

    console.log(`Existing: ${existingAI.size} AI, ${existingReal.size} real`);

    // ============ AI Images ============
    const aiItems = [];
    for (let i = 1; i <= AI_TARGET; i++) {
        if (existingAI.has(i)) continue;
        const fileName = `ai_face_${String(i).padStart(3, '0')}.jpg`;
        aiItems.push({
            url: `https://thispersondoesnotexist.com/?${Date.now()}_${i}`,
            dest: path.join(BENCHMARK_DIR, fileName)
        });
    }

    if (aiItems.length > 0) {
        console.log(`Downloading ${aiItems.length} AI images...`);
        await downloadBatch(aiItems, 'AI');
    } else {
        console.log('All AI images already exist.');
    }

    // ============ Real Images ============
    // Use random picsum URLs (no specific ID to avoid 404s)
    const realItems = [];
    for (let i = 1; i <= REAL_TARGET; i++) {
        if (existingReal.has(i)) continue;
        const fileName = `real_photo_${String(i).padStart(3, '0')}.jpg`;
        // Use random URL with cache buster
        const w = 800 + (i % 5) * 100;
        const h = 600 + (i % 4) * 100;
        realItems.push({
            url: `https://picsum.photos/${w}/${h}?random=${i}&t=${Date.now()}`,
            dest: path.join(BENCHMARK_DIR, fileName)
        });
    }

    if (realItems.length > 0) {
        console.log(`Downloading ${realItems.length} real images...`);
        await downloadBatch(realItems, 'Real');
    } else {
        console.log('All real images already exist.');
    }

    // ============ Final ============
    const finalAI = getExistingIndices('ai_face_').size;
    const finalReal = getExistingIndices('real_photo_').size;
    console.log(`\nFinal: ${finalAI} AI + ${finalReal} real = ${finalAI + finalReal}`);

    if (finalAI < AI_TARGET || finalReal < REAL_TARGET) {
        console.log('Some failed. Run again to retry.');
    } else {
        console.log('All images ready!');
    }
}

main().catch(console.error);
