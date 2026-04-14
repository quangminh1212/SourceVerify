/**
 * Fix invalid categories in lib method files
 * Maps non-standard categories to the 5 valid ones:
 * pixel | frequency | statistical | metadata | sensor
 */
const fs = require('fs');
const path = require('path');

const methodsRoot = path.join(__dirname, '..', 'src/lib/methods');
const mediaTypes = ['image', 'text', 'video'];

// Mapping from invalid categories to valid ones
const categoryMap = {
    'forensic': 'statistical',     // forensic analysis is closest to statistical
    'spatial': 'pixel',            // spatial analysis = pixel-level
    'perceptual': 'pixel',         // perceptual quality = pixel-based
    'compression': 'frequency',    // compression artifacts = frequency domain
    'color': 'pixel',              // color analysis = pixel-level
    'generative': 'statistical',   // generative model detection = statistical
    'geometric': 'pixel',          // geometric analysis = pixel-level
    'optics': 'sensor',            // optical analysis = sensor-related
    'texture': 'pixel',            // texture analysis = pixel-level
    'structure': 'pixel',          // structural analysis = pixel-level
    'spectral': 'frequency',       // spectral = frequency domain
};

let fixedCount = 0;

for (const mediaType of mediaTypes) {
    const mediaDir = path.join(methodsRoot, mediaType);
    if (!fs.existsSync(mediaDir)) continue;
    
    const files = fs.readdirSync(mediaDir).filter(f => f.endsWith('.ts'));
    
    for (const file of files) {
        const filePath = path.join(mediaDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Find category value using regex
        const catMatch = content.match(/category:\s*["']([^"']+)["']/);
        if (!catMatch) continue;
        
        const currentCat = catMatch[1];
        const validCats = ['pixel', 'frequency', 'statistical', 'metadata', 'sensor'];
        
        if (!validCats.includes(currentCat) && categoryMap[currentCat]) {
            const newCat = categoryMap[currentCat];
            content = content.replace(
                /category:\s*["'][^"']+["']/,
                `category: "${newCat}"`
            );
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed category: ${mediaType}/${file}: "${currentCat}" → "${newCat}"`);
            fixedCount++;
        }
    }
}

console.log(`\nTotal category fixes: ${fixedCount}`);
