const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'src', 'lib', 'methods');

const files = [
    'medianFilter.ts', 'resamplingDetect.ts', 'contrastEnhancement.ts', 'brisque.ts',
    'demosaicingDetect.ts', 'steganalysisDetect.ts', 'thumbnailAnalysis.ts', 'perceptualHash.ts',
    'illuminantMap.ts', 'radonTransform.ts', 'zernikeMoments.ts', 'cameraModel.ts',
    'imagePhylogeny.ts', 'blockingArtifact.ts', 'efficientnetDetect.ts', 'attentionConsistency.ts',
    'styleTransfer.ts', 'colorTemperature.ts', 'siftForensics.ts', 'neuralCompression.ts'
];

let totalFixed = 0;
for (const f of files) {
    const fp = path.join(dir, f);
    let content = fs.readFileSync(fp, 'utf8');
    // The issue: "let score: number;" at function level, then "let score;" inside the logic block
    // Fix: remove the duplicate "let score;" declaration inside logic
    const lines = content.split('\n');
    const newLines = [];
    let foundOuterScore = false;
    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (trimmed === 'let score: number;') {
            foundOuterScore = true;
            newLines.push(lines[i]);
            continue;
        }
        if (foundOuterScore && trimmed === 'let score;') {
            // Skip this duplicate declaration
            totalFixed++;
            continue;
        }
        newLines.push(lines[i]);
    }
    fs.writeFileSync(fp, newLines.join('\n'), 'utf8');
}
console.log('Fixed', totalFixed, 'duplicate score declarations across', files.length, 'files');
