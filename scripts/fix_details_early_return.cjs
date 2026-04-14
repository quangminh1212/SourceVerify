/**
 * Fix script: Remove `details,` from early-return blocks where no `details` variable is in scope.
 * These 31 files had `details,` incorrectly inserted into guard clause returns.
 */
const fs = require('fs');
const path = require('path');

const buggyFiles = [
    // 30 image methods
    'image/attentionConsistency.ts',
    'image/blockingArtifact.ts',
    'image/brisque.ts',
    'image/cameraModel.ts',
    'image/clipDetection.ts',
    'image/colorTemperature.ts',
    'image/contrastEnhancement.ts',
    'image/demosaicingDetect.ts',
    'image/efficientnetDetect.ts',
    'image/gramMatrix.ts',
    'image/illuminantMap.ts',
    'image/imagePhylogeny.ts',
    'image/medianFilter.ts',
    'image/neuralCompression.ts',
    'image/noiseprintExtraction.ts',
    'image/patchForensics.ts',
    'image/perceptualHash.ts',
    'image/radonTransform.ts',
    'image/reflectionConsistency.ts',
    'image/resamplingDetect.ts',
    'image/resnetClassifier.ts',
    'image/siftForensics.ts',
    'image/splicingDetection.ts',
    'image/srmFilter.ts',
    'image/steganalysisDetect.ts',
    'image/styleTransfer.ts',
    'image/thumbnailAnalysis.ts',
    'image/upscalingDetection.ts',
    'image/vitDetection.ts',
    'image/zernikeMoments.ts',
    // 1 video method
    'video/faceLandmarkConsistency.ts',
];

const libDir = path.join(__dirname, '..', 'src', 'lib', 'methods');
let fixed = 0;
let errors = 0;

for (const relPath of buggyFiles) {
    const filePath = path.join(libDir, relPath);
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        // Remove the line containing only `details,` (with any whitespace)
        // Only remove from the FIRST return block (early return), not from subsequent ones
        const lines = content.split('\n');
        let inEarlyReturn = false;
        let removed = false;
        const newLines = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Detect the start of the early return (first return statement)
            if (!removed && line.trim().startsWith('return {')) {
                inEarlyReturn = true;
            }
            
            // If we're in the early return and find `details,`, skip the line
            if (inEarlyReturn && !removed && line.trim() === 'details,') {
                removed = true;
                console.log(`  Fixed: ${relPath} (removed line ${i + 1}: "${line.trim()}")`);
                continue; // skip this line
            }
            
            // Detect end of early return block
            if (inEarlyReturn && (line.trim() === '};' || line.trim() === '}')) {
                inEarlyReturn = false;
            }
            
            newLines.push(line);
        }
        
        if (removed) {
            fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
            fixed++;
        } else {
            console.log(`  Warning: No 'details,' found in early return of ${relPath}`);
        }
    } catch (err) {
        console.error(`  Error processing ${relPath}: ${err.message}`);
        errors++;
    }
}

console.log(`\nDone: Fixed ${fixed} files, ${errors} errors.`);
