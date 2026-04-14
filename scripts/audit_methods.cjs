/**
 * Method Quality Audit Script
 * Checks all .ts files in src/lib/methods/{image,text,video}/
 * against the METHOD_TEMPLATE.md requirements.
 */

const fs = require("fs");
const path = require("path");

const METHODS_BASE = path.join(__dirname, "..", "src", "lib", "methods");
const MEDIA_TYPES = ["image", "text", "video"];
const VALID_CATEGORIES = ["pixel", "frequency", "statistical", "metadata", "sensor"];
const REQUIRED_RETURN_FIELDS = ["name", "nameKey", "category", "score", "weight", "description", "descriptionKey", "icon"];
// "details" is also required per template but many methods embed it inline, so we track separately

const results = {
    totalFiles: 0,
    missingExport: [],
    missingReturnFields: {},    // field -> [files]
    invalidCategory: [],        // {file, category}
    hardcodedScore50: [],       // files with score always 50 (no analysis)
    noImportType: [],           // missing "import type" from ../../types
    noAnalysisMethod: [],       // doesn't reference AnalysisMethod
    otherIssues: [],
};

// Initialize missing field trackers
for (const f of [...REQUIRED_RETURN_FIELDS, "details"]) {
    results.missingReturnFields[f] = [];
}

function auditFile(filePath, mediaType) {
    const relPath = path.relative(path.join(__dirname, ".."), filePath).replace(/\\/g, "/");
    const content = fs.readFileSync(filePath, "utf-8");
    const issues = [];

    results.totalFiles++;

    // 1. Check export function starting with "analyze"
    const exportFnMatch = content.match(/export\s+function\s+(analyze\w+)/);
    if (!exportFnMatch) {
        results.missingExport.push(relPath);
        issues.push("No export function starting with 'analyze'");
    }

    // 2. Check import type from ../../types
    const hasImportType = /import\s+type\s+\{[^}]*AnalysisMethod[^}]*\}\s+from\s+["']\.\.\/\.\.\/types["']/.test(content);
    if (!hasImportType) {
        results.noImportType.push(relPath);
        issues.push("Missing 'import type { AnalysisMethod }' from '../../types'");
    }

    // 3. Check AnalysisMethod reference
    if (!content.includes("AnalysisMethod")) {
        results.noAnalysisMethod.push(relPath);
        issues.push("No reference to AnalysisMethod type");
    }

    // 4. Check required return fields
    // Look for object literals in return statements
    const returnBlocks = content.match(/return\s*\{[^}]*\}/gs) || [];
    const allReturnContent = returnBlocks.join(" ");

    for (const field of REQUIRED_RETURN_FIELDS) {
        // Check if field appears as a key in any return block OR as a property assignment
        const fieldRegex = new RegExp(`\\b${field}\\s*[:=,]|\\b${field}\\b`);
        if (!fieldRegex.test(allReturnContent) && !content.match(new RegExp(`["']${field}["']\\s*:`))) {
            results.missingReturnFields[field].push(relPath);
        }
    }

    // Check "details" field
    const hasDetails = /\bdetails\s*[:=,]|\bdetails\b/.test(allReturnContent) || /["']details["']\s*:/.test(content);
    if (!hasDetails) {
        results.missingReturnFields["details"].push(relPath);
    }

    // 5. Check category validity
    const categoryMatches = content.match(/category\s*:\s*["']([^"']+)["']/g) || [];
    for (const cm of categoryMatches) {
        const catValue = cm.match(/["']([^"']+)["']/);
        if (catValue && !VALID_CATEGORIES.includes(catValue[1])) {
            results.invalidCategory.push({ file: relPath, category: catValue[1] });
        }
    }

    // 6. Check for hardcoded score=50 (no real analysis logic)
    // A method is "hardcoded 50" if:
    //   - It sets score = 50 somewhere AND
    //   - Never reassigns score to anything other than 50 AND
    //   - Doesn't have conditional logic modifying score
    const scoreAssignments = content.match(/\bscore\s*=\s*(\d+)/g) || [];
    const scoreInReturn = content.match(/\bscore\s*:\s*(\d+)/g) || [];
    const allScoreValues = [...scoreAssignments, ...scoreInReturn]
        .map(s => {
            const m = s.match(/(\d+)/);
            return m ? parseInt(m[1]) : null;
        })
        .filter(v => v !== null);

    // Check if score is computed vs hardcoded
    const hasScoreComputation = /\bscore\s*[+\-*\/]?=\s*(?!50\b)/.test(content) ||
        /\bscore\s*=\s*Math\./.test(content) ||
        /\bscore\s*=\s*\d+\s*[+\-*\/]/.test(content) ||
        /\bscore\s*=\s*[a-zA-Z]/.test(content) ||  // score = someVariable
        /score\s*:\s*[a-zA-Z]/.test(content);        // score: someVariable in return

    const onlyHas50 = allScoreValues.length > 0 && allScoreValues.every(v => v === 50);
    const hasScoreVar = /\bscore\b/.test(allReturnContent) && /let\s+score\b/.test(content);

    if (onlyHas50 && !hasScoreComputation && !hasScoreVar) {
        results.hardcodedScore50.push(relPath);
    }

    // Also flag if ALL return statements have score: 50 literally
    if (returnBlocks.length > 0) {
        const allReturnsHave50 = returnBlocks.every(rb => {
            const scoreMatch = rb.match(/score\s*:\s*(\w+)/);
            return scoreMatch && scoreMatch[1] === "50";
        });
        if (allReturnsHave50 && !results.hardcodedScore50.includes(relPath)) {
            results.hardcodedScore50.push(relPath);
        }
    }

    // 7. Check nameKey field
    if (!/nameKey\s*:/.test(content)) {
        issues.push("Missing nameKey in return");
    }

    // 8. Check descriptionKey field
    if (!/descriptionKey\s*:/.test(content)) {
        issues.push("Missing descriptionKey in return");
    }

    // 9. Check icon field
    if (!/icon\s*:/.test(content)) {
        issues.push("Missing icon in return");
    }

    if (issues.length > 0) {
        results.otherIssues.push({ file: relPath, issues });
    }
}

// Sample content quality check: read 20 methods per media type and check score logic depth
function sampleContentQuality(mediaType, files) {
    const sampled = files.length <= 20 ? files : [];
    if (files.length > 20) {
        // Take evenly spaced samples
        const step = Math.floor(files.length / 20);
        for (let i = 0; i < files.length && sampled.length < 20; i += step) {
            sampled.push(files[i]);
        }
    }

    const qualityIssues = [];

    for (const file of sampled) {
        const content = fs.readFileSync(file, "utf-8");
        const relPath = path.relative(path.join(__dirname, ".."), file).replace(/\\/g, "/");
        const lines = content.split("\n").length;

        // Check if method is too short (likely stub)
        if (lines < 20) {
            qualityIssues.push({ file: relPath, issue: `Very short file (${lines} lines) — possible stub` });
        }

        // Check if there's any conditional logic at all
        const hasConditionals = /\bif\s*\(/.test(content) || /\bswitch\s*\(/.test(content) || /\?.*:/.test(content);
        if (!hasConditionals) {
            qualityIssues.push({ file: relPath, issue: "No conditional logic — score may not vary" });
        }

        // Check if score ever changes from initial value
        const scoreAssignments = (content.match(/\bscore\s*=\s*/g) || []).length;
        const scoreReturns = (content.match(/score\s*:\s*\d+/g) || []).length;
        if (scoreAssignments <= 1 && scoreReturns >= 1) {
            // Only one assignment and literal in return — likely hardcoded
            const returnScores = content.match(/score\s*:\s*(\d+)/g) || [];
            const allSame = returnScores.every(s => s === returnScores[0]);
            if (allSame && returnScores.length > 0) {
                const val = returnScores[0].match(/(\d+)/)[1];
                if (val === "50") {
                    qualityIssues.push({ file: relPath, issue: "All return paths have score: 50 — no real analysis" });
                }
            }
        }

        // Check weight range
        const weightMatches = content.match(/weight\s*:\s*([\d.]+)/g) || [];
        for (const wm of weightMatches) {
            const wVal = parseFloat(wm.match(/([\d.]+)/)[1]);
            if (wVal < 0.02 || wVal > 1.5) {
                qualityIssues.push({ file: relPath, issue: `Weight ${wVal} out of range [0.02, 1.5]` });
            }
        }
    }

    return qualityIssues;
}

// Main
console.log("=== SourceVerify Method Quality Audit ===\n");

const contentQuality = {};

for (const mediaType of MEDIA_TYPES) {
    const dir = path.join(METHODS_BASE, mediaType);
    if (!fs.existsSync(dir)) {
        console.log(`WARNING: Directory not found: ${dir}`);
        continue;
    }

    const files = fs.readdirSync(dir)
        .filter(f => f.endsWith(".ts"))
        .map(f => path.join(dir, f));

    console.log(`Scanning ${mediaType}/: ${files.length} files`);

    for (const file of files) {
        auditFile(file, mediaType);
    }

    contentQuality[mediaType] = sampleContentQuality(mediaType, files);
}

// Print results
console.log("\n" + "=".repeat(60));
console.log("AUDIT RESULTS");
console.log("=".repeat(60));

console.log(`\nTotal files scanned: ${results.totalFiles}`);

console.log(`\n--- Missing 'export function analyze...' (${results.missingExport.length}) ---`);
for (const f of results.missingExport) console.log(`  ❌ ${f}`);

console.log(`\n--- Missing 'import type { AnalysisMethod }' (${results.noImportType.length}) ---`);
for (const f of results.noImportType) console.log(`  ⚠️  ${f}`);

console.log(`\n--- No AnalysisMethod reference (${results.noAnalysisMethod.length}) ---`);
for (const f of results.noAnalysisMethod) console.log(`  ❌ ${f}`);

console.log(`\n--- Invalid Category (${results.invalidCategory.length}) ---`);
for (const { file, category } of results.invalidCategory) {
    console.log(`  ❌ ${file} → category: "${category}" (valid: ${VALID_CATEGORIES.join(", ")})`);
}

console.log(`\n--- Hardcoded score=50 / No Analysis Logic (${results.hardcodedScore50.length}) ---`);
for (const f of results.hardcodedScore50) console.log(`  ⚠️  ${f}`);

console.log(`\n--- Missing Required Return Fields ---`);
for (const [field, files] of Object.entries(results.missingReturnFields)) {
    if (files.length > 0) {
        console.log(`  ${field}: ${files.length} files missing`);
        for (const f of files.slice(0, 10)) console.log(`    → ${f}`);
        if (files.length > 10) console.log(`    ... and ${files.length - 10} more`);
    }
}

console.log(`\n--- Content Quality Samples (20 per media type) ---`);
for (const [mediaType, issues] of Object.entries(contentQuality)) {
    console.log(`\n  [${mediaType}] ${issues.length} quality issues:`);
    for (const { file, issue } of issues) {
        console.log(`    ⚠️  ${file}: ${issue}`);
    }
}

// Summary
console.log("\n" + "=".repeat(60));
console.log("SUMMARY");
console.log("=".repeat(60));
console.log(`Total files:                    ${results.totalFiles}`);
console.log(`Missing export analyze*:        ${results.missingExport.length}`);
console.log(`Missing import type:            ${results.noImportType.length}`);
console.log(`No AnalysisMethod ref:          ${results.noAnalysisMethod.length}`);
console.log(`Invalid category:               ${results.invalidCategory.length}`);
console.log(`Hardcoded score=50:             ${results.hardcodedScore50.length}`);
const totalMissingFields = Object.values(results.missingReturnFields).reduce((a, b) => a + b.length, 0);
console.log(`Total missing return fields:    ${totalMissingFields}`);
const totalContentIssues = Object.values(contentQuality).reduce((a, b) => a + b.length, 0);
console.log(`Content quality issues:         ${totalContentIssues}`);

// Files with any problem
const allProblemFiles = new Set([
    ...results.missingExport,
    ...results.noImportType,
    ...results.noAnalysisMethod,
    ...results.invalidCategory.map(i => i.file),
    ...results.hardcodedScore50,
    ...Object.values(results.missingReturnFields).flat(),
    ...Object.values(contentQuality).flatMap(issues => issues.map(i => i.file)),
]);
console.log(`Files with any problem:         ${allProblemFiles.size} / ${results.totalFiles}`);
