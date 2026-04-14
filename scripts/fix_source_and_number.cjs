/**
 * Script: Bổ sung trường "source" cho tất cả method thiếu + đánh số method
 * Chạy: node scripts/fix_source_and_number.cjs
 */
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "src", "app", "methods", "data.ts");
const METHODS_DIR = path.join(__dirname, "..", "src", "app", "methods");
const LOCALES = ["en", "vi", "zh", "ja", "ko", "es"];
const REQUIRED_FIELDS = ["name", "description", "algorithm", "mechanism", "parameters", "accuracy", "source", "useCase", "strengths", "limitations", "references"];

// ── Step 1: Parse all methods from data.ts ──
const dataContent = fs.readFileSync(DATA_FILE, "utf8");
const methodRegex = /\{\s*id:\s*["']([^"']+)["'].*?category:\s*["']([^"']+)["'].*?mediaType:\s*["']([^"']+)["'].*?weight:\s*([\d.]+)(?:.*?year:\s*(\d+))?\s*\}/g;
let match;
const allMethods = [];
while ((match = methodRegex.exec(dataContent)) !== null) {
    allMethods.push({
        id: match[1],
        category: match[2],
        mediaType: match[3],
        weight: parseFloat(match[4]),
        year: match[5] ? parseInt(match[5]) : null,
    });
}
console.log(`Found ${allMethods.length} methods in data.ts`);

// ── Step 2: Fix missing source field ──
let fixedCount = 0;

function generateSourceFromReferences(refs) {
    if (!refs || !Array.isArray(refs) || refs.length === 0) return null;
    // Take first 2-3 references and create a source string
    const titles = refs.slice(0, 3).map(r => {
        if (typeof r === "string") return r;
        return r.title || "";
    }).filter(t => t.length > 0);
    if (titles.length === 0) return null;
    return titles.join("; ");
}

function generateLocalizedSource(enSource, locale) {
    // For technical references, keep same in all languages (academic citations are universal)
    return enSource;
}

for (const m of allMethods) {
    const dir = path.join(METHODS_DIR, m.mediaType, m.id, "i18n");
    if (!fs.existsSync(dir)) continue;

    const enPath = path.join(dir, "en.json");
    if (!fs.existsSync(enPath)) continue;

    let en;
    try {
        en = JSON.parse(fs.readFileSync(enPath, "utf8"));
    } catch {
        continue;
    }

    // Skip if source already exists and is meaningful
    if (en.source && typeof en.source === "string" && en.source.length >= 10) continue;

    // Generate source from references
    const source = generateSourceFromReferences(en.references);
    if (!source) {
        console.warn(`  SKIP ${m.mediaType}/${m.id}: no references to derive source from`);
        continue;
    }

    // Update all locales
    for (const loc of LOCALES) {
        const locPath = path.join(dir, loc + ".json");
        if (!fs.existsSync(locPath)) continue;
        try {
            const data = JSON.parse(fs.readFileSync(locPath, "utf8"));
            data.source = generateLocalizedSource(source, loc);
            fs.writeFileSync(locPath, JSON.stringify(data, null, 4) + "\n", "utf8");
        } catch (e) {
            console.warn(`  Error updating ${loc}.json for ${m.id}: ${e.message}`);
        }
    }
    fixedCount++;
}
console.log(`Fixed source field for ${fixedCount} methods`);

// ── Step 3: Verify completeness ──
let incomplete = 0;
for (const m of allMethods) {
    const enPath = path.join(METHODS_DIR, m.mediaType, m.id, "i18n", "en.json");
    if (!fs.existsSync(enPath)) {
        incomplete++;
        console.warn(`MISSING en.json: ${m.mediaType}/${m.id}`);
        continue;
    }
    try {
        const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
        const missing = REQUIRED_FIELDS.filter(f => !en[f] || (typeof en[f] === "string" && en[f].length < 5));
        if (missing.length > 0) {
            incomplete++;
            console.warn(`INCOMPLETE: ${m.mediaType}/${m.id} - missing: ${missing.join(", ")}`);
        }
    } catch { incomplete++; }
}
console.log(`\nAfter fix: ${incomplete} methods still incomplete out of ${allMethods.length}`);
console.log("Done!");
