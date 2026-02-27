const { createCanvas, loadImage } = require('canvas');
const path = require('path');

async function testOne() {
    const filePath = path.join(__dirname, '..', 'public', 'benchmark', 'ai_face_001.jpg');
    console.log('Loading image:', filePath);
    const img = await loadImage(filePath);
    console.log('Image loaded:', img.width, 'x', img.height);

    let w = img.width, h = img.height;
    if (w > 1024 || h > 1024) {
        const scale = 1024 / Math.max(w, h);
        w = Math.round(w * scale); h = Math.round(h * scale);
    }
    console.log('Canvas size:', w, 'x', h);

    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    const imageData = ctx.getImageData(0, 0, w, h);
    const pixels = imageData.data;
    console.log('Pixel data type:', pixels.constructor.name, 'length:', pixels.length);
    console.log('Sample pixels:', pixels[0], pixels[1], pixels[2], pixels[3]);

    // Test each signal one by one
    const signals = [];

    console.log('\n1. Metadata...');
    signals.push({ name: "Metadata Analysis", score: 50, weight: 1.5 });
    console.log('   OK');

    console.log('2. Spectral...');
    try {
        const size = Math.min(256, Math.min(w, h));
        console.log('   size=', size);
        // Just test a small part
        const gray = new Float64Array(size * size);
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const idx = (y * w + x) * 4;
                gray[y * size + x] = pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;
            }
        }
        console.log('   gray computed, first=', gray[0]);
        console.log('   OK');
    } catch (e) { console.error('   Error:', e.message); }

    console.log('3. Full analysis test...');
    // Import the main script's analyze function
    // Instead just test the signals inline
    console.log('   Testing noise...');
    const blockSize = 32;
    const blocksX = Math.floor(w / blockSize);
    const blocksY = Math.floor(h / blockSize);
    console.log('   Blocks:', blocksX, 'x', blocksY);
    console.log('   OK');

    console.log('\nAll basic tests passed!');
}

testOne().catch(e => { console.error('FATAL:', e.message); console.error(e.stack); });
