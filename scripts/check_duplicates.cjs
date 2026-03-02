const fs = require('fs');
const path = require('path');

const videoDir = path.join(__dirname, '..', 'src', 'lib', 'methods', 'video');
const textDir = path.join(__dirname, '..', 'src', 'lib', 'methods', 'text');
const imageDir = path.join(__dirname, '..', 'src', 'lib', 'methods', 'image');

function stripComments(code) {
    return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '').replace(/\s+/g, ' ').trim();
}

function extractLogic(code) {
    // Extract just the computational logic (after error checks, before return)
    const funcBody = code.match(/export function \w+\([^)]*\)[^{]*\{([\s\S]*)\}/);
    if (!funcBody) return '';
    let body = funcBody[1];
    // Remove early return blocks
    body = body.replace(/if\s*\([^)]*\)\s*\{[^}]*return[^}]*\}/g, '');
    // Remove string literals (names, descriptions)
    body = body.replace(/"[^"]*"/g, '""');
    body = body.replace(/'[^']*'/g, "''");
    // Remove template literals
    body = body.replace(/`[^`]*`/g, '``');
    return stripComments(body);
}

function getMethodInfo(dir, filename) {
    const content = fs.readFileSync(path.join(dir, filename), 'utf8');
    const funcMatch = content.match(/export function (\w+)/);
    const nameMatch = content.match(/name:\s*"([^"]+)"/);
    const refMatch = content.match(/Reference:.*$/m);
    const logic = extractLogic(content);
    
    // Extract key formulas/patterns
    const hasMean = /reduce\(\(a,\s*b\)\s*=>\s*a\s*\+\s*b/.test(content);
    const hasVariance = /\(b\s*-\s*mean\)\s*\*\*\s*2/.test(content) || /\(b\s*-\s*mean\)\s*\*\s*\(b\s*-\s*mean\)/.test(content);
    const hasCV = /Math\.sqrt\(variance\)\s*\/\s*mean/.test(content) || /stdDev\s*\/.*mean/.test(content);
    const hasSentenceSplit = /split\(\/\[\.!\?]/.test(content);
    const hasWordSplit = /split\(\/\\s\+\/\)/.test(content);
    const hasBlockAnalysis = /blockSize|blocksX|blocksY|bs\s*=/.test(content);
    const hasPixelLoop = /pixels\[idx\]|pixels\[i\]|pixels\[idx\s*\+/.test(content);
    const hasSobelLike = /gx.*gy|Sobel|sobel/.test(content);
    const hasLaplacian = /lap|Laplacian|laplacian/.test(content);
    const hasDiff = /Math\.abs\(.*pixels/.test(content);
    const hasGrayscale = /0\.299.*0\.587.*0\.114/.test(content);
    const hasFFT = /Math\.cos|Math\.sin.*Math\.PI/.test(content);
    
    return {
        file: filename,
        func: funcMatch?.[1] || '',
        name: nameMatch?.[1] || '',
        ref: refMatch?.[0] || '',
        logic: logic,
        logicHash: logic.length, // rough similarity metric
        patterns: {
            hasMean, hasVariance, hasCV, hasSentenceSplit, hasWordSplit,
            hasBlockAnalysis, hasPixelLoop, hasSobelLike, hasLaplacian,
            hasDiff, hasGrayscale, hasFFT,
        }
    };
}

console.log('=== PHÂN TÍCH TRÙNG LẶP LOGIC PHƯƠNG PHÁP ===\n');

// Analyze all methods
const allMethods = [];

for (const f of fs.readdirSync(videoDir).filter(f => f.endsWith('.ts'))) {
    allMethods.push({ ...getMethodInfo(videoDir, f), type: 'video' });
}
for (const f of fs.readdirSync(textDir).filter(f => f.endsWith('.ts'))) {
    allMethods.push({ ...getMethodInfo(textDir, f), type: 'text' });
}
for (const f of fs.readdirSync(imageDir).filter(f => f.endsWith('.ts'))) {
    allMethods.push({ ...getMethodInfo(imageDir, f), type: 'image' });
}

// Find methods with IDENTICAL logic (same stripped code)
console.log('--- 1. Methods với LOGIC GIỐNG HỆT (stripped code identical) ---');
const logicGroups = new Map();
for (const m of allMethods) {
    const key = m.logic.substring(0, 500); // first 500 chars of logic
    if (!logicGroups.has(key)) logicGroups.set(key, []);
    logicGroups.get(key).push(m);
}

let identicalCount = 0;
for (const [key, group] of logicGroups) {
    if (group.length > 1 && key.length > 50) {
        identicalCount++;
        console.log(`\n  GROUP ${identicalCount}: Logic giống nhau (${group.length} methods):`);
        for (const m of group) {
            console.log(`    - ${m.type}/${m.file} → "${m.name}" (${m.func})`);
        }
    }
}
if (identicalCount === 0) console.log('  ✅ Không có methods nào có logic giống hệt nhau');

// Find NEW video methods that share template (generated methods)
console.log('\n--- 2. Video methods mới (v3) dùng CÙNG TEMPLATE ---');
const newVideoMethods = allMethods.filter(m => m.type === 'video' && m.logic.includes('blockSize'));
if (newVideoMethods.length > 1) {
    // Check if they all have the same core formula
    const templates = new Map();
    for (const m of newVideoMethods) {
        // Extract the scoring formula
        const scoreLogic = m.logic.match(/score.*smoothRatio.*avgDiff/s);
        const templateKey = scoreLogic ? 'block-diff-smooth' : 'other';
        if (!templates.has(templateKey)) templates.set(templateKey, []);
        templates.get(templateKey).push(m);
    }
    for (const [tpl, group] of templates) {
        if (group.length > 3) {
            console.log(`  ⚠️ ${group.length} video methods dùng cùng template "${tpl}":`);
            for (const m of group) {
                console.log(`    - ${m.file} → "${m.name}"`);
            }
        }
    }
}

// Find NEW text methods that share template
console.log('\n--- 3. Text methods mới (v3) dùng CÙNG TEMPLATE ---');
const newTextMethods = allMethods.filter(m => m.type === 'text' && m.patterns.hasCV && m.patterns.hasSentenceSplit);
if (newTextMethods.length > 1) {
    console.log(`  ⚠️ ${newTextMethods.length} text methods dùng cùng công thức CV (sentence split → word count → mean → variance → CV → score):`);
    for (const m of newTextMethods) {
        console.log(`    - ${m.file} → "${m.name}"`);
    }
}

// Find EXISTING methods with similar patterns
console.log('\n--- 4. Kiểm tra phương pháp EXISTING có overlap về mặt ý nghĩa ---');
const semanticGroups = {
    'Noise analysis': allMethods.filter(m => /noise/i.test(m.name) || /noise/i.test(m.file)),
    'Edge/gradient': allMethods.filter(m => /edge|gradient|sobel|laplacian/i.test(m.name) || /edge|gradient/i.test(m.file)),
    'Texture': allMethods.filter(m => /texture|grain|pattern/i.test(m.name) && !/sentence|word|punct/i.test(m.name)),
    'Frequency': allMethods.filter(m => /spectral|frequency|fourier|fft|dct|wavelet/i.test(m.name)),
    'Compression': allMethods.filter(m => /compress|jpeg|blocking|quantiz/i.test(m.name)),
    'Color': allMethods.filter(m => /color|chrom|saturat/i.test(m.name)),
    'Face': allMethods.filter(m => /face|facial|jaw|ear|eye|nose|teeth|forehead|eyebrow|pupil|blink|wrinkle|expression/i.test(m.name)),
    'Shadow/light': allMethods.filter(m => /shadow|illumin|light|reflect/i.test(m.name)),
    'Sentence analysis': allMethods.filter(m => /sentence|clause|paragraph/i.test(m.name)),
    'Word analysis': allMethods.filter(m => /word|vocab|lexic|hapax/i.test(m.name)),
    'Repetition': allMethods.filter(m => /repeti|redundan|burst/i.test(m.name)),
};

for (const [groupName, methods] of Object.entries(semanticGroups)) {
    if (methods.length >= 2) {
        console.log(`\n  "${groupName}" (${methods.length} methods):`);
        for (const m of methods) {
            console.log(`    - ${m.type}/${m.file} → "${m.name}"`);
        }
    }
}

console.log('\n=== KẾT QUẢ ===');
