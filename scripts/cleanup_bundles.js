const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'src', 'lib', 'methods');

// Old bundle files that have been split into individual files
const oldBundles = [
    'spatial.ts',
    'frequencyAdvanced.ts',
    'statisticalAdvanced.ts',
    'compression.ts',
    'generative.ts',
    'geometric.ts',
    'colorAdvanced.ts',
];

for (const f of oldBundles) {
    const fp = path.join(dir, f);
    if (fs.existsSync(fp)) {
        fs.unlinkSync(fp);
        console.log(`Deleted: ${f}`);
    } else {
        console.log(`Not found: ${f}`);
    }
}
console.log('Done!');
