/**
 * Split multi-method files into individual files
 * and create stubs for missing UI methods
 */
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'src', 'lib', 'methods');

// Read the analyzer.ts to know METHOD_MAP
const analyzerPath = path.join(__dirname, '..', 'src', 'lib', 'analyzer.ts');

// ============================================================
// Step 1: Split multi-method files into individual files
// ============================================================

const splitConfigs = [
    {
        source: 'spatial.ts',
        helper: `import type { AnalysisMethod } from "../types";\n\nfunction gray(pixels: Uint8ClampedArray, idx: number): number {\n    return pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;\n}\n\n`,
        functions: [
            { name: 'analyzeLocalBinaryPattern', file: 'localBinaryPattern.ts' },
            { name: 'analyzeHOGAnomaly', file: 'hogAnomaly.ts' },
            { name: 'analyzeGLCM', file: 'glcm.ts' },
            { name: 'analyzeLocalVarianceMap', file: 'localVarianceMap.ts' },
            { name: 'analyzeMorphologicalGradient', file: 'morphologicalGradient.ts' },
            { name: 'analyzeWeberDescriptor', file: 'weberDescriptor.ts' },
        ]
    },
    {
        source: 'frequencyAdvanced.ts',
        helper: `import type { AnalysisMethod } from "../types";\n\nfunction gray(pixels: Uint8ClampedArray, idx: number): number {\n    return pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;\n}\n\n`,
        functions: [
            { name: 'analyzeWaveletStatistics', file: 'waveletStatistics.ts' },
            { name: 'analyzeGaborResponse', file: 'gaborResponse.ts' },
            { name: 'analyzePowerSpectralDensity', file: 'powerSpectralDensity.ts' },
            { name: 'analyzePhaseCongruency', file: 'phaseCongruency.ts' },
            { name: 'analyzeRadialSpectrum', file: 'radialSpectrum.ts' },
            { name: 'analyzeFrequencyBandRatio', file: 'frequencyBandRatio.ts' },
        ]
    },
    {
        source: 'statisticalAdvanced.ts',
        helper: `import type { AnalysisMethod } from "../types";\n\nfunction gray(pixels: Uint8ClampedArray, idx: number): number {\n    return pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;\n}\n\n`,
        functions: [
            { name: 'analyzeEntropyMap', file: 'entropyMap.ts' },
            { name: 'analyzeHigherOrderStatistics', file: 'higherOrderStatistics.ts' },
            { name: 'analyzeZipfLaw', file: 'zipfLaw.ts' },
            { name: 'analyzeChiSquareUniformity', file: 'chiSquareUniformity.ts' },
            { name: 'analyzeMarkovTransition', file: 'markovTransition.ts' },
            { name: 'analyzeSaturationDistribution', file: 'saturationDistribution.ts' },
        ]
    },
    {
        source: 'compression.ts',
        helper: `import type { AnalysisMethod } from "../types";\n\nfunction gray(pixels: Uint8ClampedArray, idx: number): number {\n    return pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;\n}\n\n`,
        functions: [
            { name: 'analyzeJPEGGhost', file: 'jpegGhost.ts' },
            { name: 'analyzeQuantizationFingerprint', file: 'quantizationFingerprint.ts' },
            { name: 'analyzeErrorLevel', file: 'errorLevel.ts' },
            { name: 'analyzeColorBanding', file: 'colorBanding.ts' },
        ]
    },
    {
        source: 'generative.ts',
        helper: `import type { AnalysisMethod } from "../types";\n\nfunction gray(pixels: Uint8ClampedArray, idx: number): number {\n    return pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;\n}\n\n`,
        functions: [
            { name: 'analyzeGANFingerprint', file: 'ganFingerprint.ts' },
            { name: 'analyzeUpsamplingArtifact', file: 'upsamplingArtifact.ts' },
            { name: 'analyzeDiffusionArtifact', file: 'diffusionArtifact.ts' },
        ]
    },
    {
        source: 'geometric.ts',
        helper: `import type { AnalysisMethod } from "../types";\n\nfunction gray(pixels: Uint8ClampedArray, idx: number): number {\n    return pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;\n}\n\n`,
        functions: [
            { name: 'analyzePerspectiveConsistency', file: 'perspectiveConsistency.ts' },
            { name: 'analyzeLightingConsistency', file: 'lightingConsistency.ts' },
            { name: 'analyzeShadowConsistency', file: 'shadowConsistency.ts' },
        ]
    },
    {
        source: 'colorAdvanced.ts',
        helper: `import type { AnalysisMethod } from "../types";\n\n`,
        functions: [
            { name: 'analyzeColorGamut', file: 'colorGamut.ts' },
            { name: 'analyzeWhiteBalance', file: 'whiteBalance.ts' },
        ]
    },
];

let totalCreated = 0;

for (const config of splitConfigs) {
    const sourceFile = path.join(dir, config.source);
    const sourceContent = fs.readFileSync(sourceFile, 'utf8');

    for (const fn of config.functions) {
        const targetFile = path.join(dir, fn.file);
        if (fs.existsSync(targetFile)) {
            console.log(`SKIP (exists): ${fn.file}`);
            continue;
        }

        // Extract function using regex
        // Match from the JSDoc comment before the function to the next export function or end of file
        const fnRegex = new RegExp(
            `(/\\*\\*[\\s\\S]*?\\*/\\s*)?export\\s+function\\s+${fn.name}\\b[\\s\\S]*?^\\}`,
            'm'
        );
        const match = sourceContent.match(fnRegex);

        if (!match) {
            console.log(`WARNING: Could not extract ${fn.name} from ${config.source}`);
            continue;
        }

        const fnBody = match[0];
        const fileContent = config.helper + fnBody + '\n';
        fs.writeFileSync(targetFile, fileContent, 'utf8');
        console.log(`Created: ${fn.file} (from ${config.source})`);
        totalCreated++;
    }
}

// ============================================================
// Step 2: Create stubs for app/methods pages that have NO lib implementation
// ============================================================

// Get all app method folders
const appMethodsDir = path.join(__dirname, '..', 'src', 'app', 'methods');
const appMethodFolders = fs.readdirSync(appMethodsDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name !== '_components')
    .map(d => d.name);

// Get all lib method files (extract exported function names)
const libFiles = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'i18n.ts' && f !== 'video.ts');

// Build a set of all method nameKeys from existing lib files
const existingNameKeys = new Set();
for (const f of libFiles) {
    const content = fs.readFileSync(path.join(dir, f), 'utf8');
    const matches = content.matchAll(/nameKey:\s*["']([^"']+)["']/g);
    for (const m of matches) {
        existingNameKeys.add(m[1]);
    }
}

// Also check data.ts to know the METHOD id → app folder mapping
const dataFile = path.join(appMethodsDir, 'data.ts');
const dataContent = fs.readFileSync(dataFile, 'utf8');
const methodEntries = [...dataContent.matchAll(/id:\s*"([^"]+)"/g)].map(m => m[1]);

// Map data.ts IDs to app method folder names
// They should match since IDs in data.ts = folder names in app/methods

// Check which app method folders don't have corresponding nameKeys in lib
const analyzerContent = fs.readFileSync(analyzerPath, 'utf8');
const methodMapEntries = [...analyzerContent.matchAll(/(\w+):\s*"(signal\.\w+)"/g)];
const idToNameKey = {};
for (const m of methodMapEntries) {
    idToNameKey[m[1]] = m[2];
}

// App method folders that need stubs (not in data.ts METHOD_MAP)
const appFoldersNeedingLib = [];
for (const folder of appMethodFolders) {
    // Check if this folder's ID is in METHOD_MAP  
    const found = methodEntries.includes(folder);
    if (!found) {
        // This UI page exists but method is not in data.ts — it's a display-only page
        continue;
    }
    // Check if the corresponding nameKey exists in lib
    // Find the METHOD_MAP key for this data.ts id
    let hasLib = false;
    for (const [key, nameKey] of Object.entries(idToNameKey)) {
        // The mapping between data.ts IDs and METHOD_MAP keys is not 1:1 by name
        // We need to check if any lib file has a function that handles this
        if (existingNameKeys.has(nameKey)) {
            hasLib = true;
        }
    }
}

console.log(`\nTotal new files created from splits: ${totalCreated}`);
console.log(`\nExisting nameKeys in lib: ${existingNameKeys.size}`);
console.log(`Method entries in data.ts: ${methodEntries.length}`);
console.log(`METHOD_MAP entries in analyzer: ${methodMapEntries.length}`);
console.log(`App method folders: ${appMethodFolders.length}`);

// List app method folders NOT covered by METHOD_MAP
const methodMapIds = Object.keys(idToNameKey);
const uncoveredFolders = appMethodFolders.filter(f => !methodMapIds.some(id => {
    // Try to match camelCase ID to snake_case folder
    const snakeId = id.replace(/([A-Z])/g, '_$1').toLowerCase();
    return snakeId === f || id === f || id.toLowerCase() === f.replace(/_/g, '');
}));

// Also check by matching data.ts IDs
const dataIds = new Set(methodEntries);
const inDataButNotEngine = methodEntries.filter(id => {
    return !methodMapIds.some(mapKey => {
        const snakeKey = mapKey.replace(/([A-Z])/g, '_$1').toLowerCase();
        return snakeKey === id || mapKey === id || mapKey.toLowerCase() === id.replace(/_/g, '');
    });
});

console.log(`\nMethods in data.ts but NOT in analyzer METHOD_MAP (${inDataButNotEngine.length}):`);
inDataButNotEngine.forEach(id => console.log(`  - ${id}`));

console.log(`\nApp method folders NOT matching any METHOD_MAP entry (${uncoveredFolders.length}):`);
uncoveredFolders.forEach(f => console.log(`  - ${f}`));
