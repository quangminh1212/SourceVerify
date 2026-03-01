const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'src', 'lib', 'methods');

const files = fs.readdirSync(dir).filter(f =>
    f.endsWith('.ts') && !['index.ts', 'i18n.ts', 'video.ts', 'pixelUtils.ts'].includes(f)
);

let fixed = 0;
for (const f of files) {
    const fp = path.join(dir, f);
    let content = fs.readFileSync(fp, 'utf8');

    // Check if file has inline gray() function
    if (!content.includes('function gray(pixels')) continue;

    // Remove the inline gray function (with optional comment lines before it)
    // Pattern 1: function gray(...) { ... } with possible comment
    content = content.replace(/\n?\/\/ Helper: convert pixel to grayscale\n?/g, '');
    content = content.replace(/\nfunction gray\(pixels: Uint8ClampedArray, idx: number\): number \{\n\s+return pixels\[idx\] \* 0\.299 \+ pixels\[idx \+ 1\] \* 0\.587 \+ pixels\[idx \+ 2\] \* 0\.114;\n\}\n?/g, '\n');

    // Also remove standalone function gray without comment
    content = content.replace(/function gray\(pixels: Uint8ClampedArray, idx: number\): number \{\n\s+return pixels\[idx\] \* 0\.299 \+ pixels\[idx \+ 1\] \* 0\.587 \+ pixels\[idx \+ 2\] \* 0\.114;\n\}\n?/g, '');

    // Check if already imports gray from pixelUtils
    if (!content.includes('from "./pixelUtils"')) {
        // Add import for gray after existing type import
        if (content.includes('import type { AnalysisMethod }')) {
            content = content.replace(
                'import type { AnalysisMethod } from "../types";',
                'import type { AnalysisMethod } from "../types";\nimport { gray } from "./pixelUtils";'
            );
        } else {
            // Add at top
            content = 'import { gray } from "./pixelUtils";\n' + content;
        }
    }

    fs.writeFileSync(fp, content, 'utf8');
    console.log(`Fixed: ${f}`);
    fixed++;
}
console.log(`\nTotal fixed: ${fixed} files`);
