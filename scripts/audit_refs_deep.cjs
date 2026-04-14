/**
 * Deep comparison audit: check ref mismatches where translations have FEWER refs than en,
 * plus scan vi.json for same issues, and check for any other structural anomalies.
 */
const fs = require('fs');
const path = require('path');

const METHODS_DIR = path.join(__dirname, '..', 'src', 'app', 'methods');
const LANGS = ['en', 'es', 'ja', 'ko', 'vi', 'zh'];
const CATEGORIES = ['image', 'text', 'video'];

// Methods where translations have FEWER refs than en
const fewerRefMethods = [
    ['image', 'iptc_verification'],
    ['image', 'resolution_consistency'],
    ['image', 'software_fingerprint'],
    ['image', 'timestamp_forensics'],
    ['text', 'abstractness'],
];

console.log('=== METHODS WITH TRANSLATIONS HAVING FEWER REFS THAN EN ===\n');

for (const [cat, method] of fewerRefMethods) {
    const i18nDir = path.join(METHODS_DIR, cat, method, 'i18n');
    console.log(`--- ${cat}/${method} ---`);
    
    for (const lang of LANGS) {
        const fp = path.join(i18nDir, `${lang}.json`);
        const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
        const refs = data.references || [];
        console.log(`  ${lang}: ${refs.length} refs`);
        for (const r of refs) {
            console.log(`    - ${(r.title || '').substring(0, 80)}`);
        }
    }
    console.log('');
}

// Also check: methods where en has MORE refs than ALL translations 
// (the other direction: translations have MORE refs is usually fine)
console.log('\n=== CHECKING ALL METHODS FOR REF IMBALANCE ===\n');

let totalMethods = 0;
let methodsWithMoreEnRefs = 0;
let methodsWithMoreTransRefs = 0;

for (const cat of CATEGORIES) {
    const catDir = path.join(METHODS_DIR, cat);
    if (!fs.existsSync(catDir)) continue;
    const methods = fs.readdirSync(catDir).filter(f => {
        return fs.statSync(path.join(catDir, f)).isDirectory() && f !== 'i18n';
    });

    for (const method of methods) {
        totalMethods++;
        const i18nDir = path.join(catDir, method, 'i18n');
        const en = JSON.parse(fs.readFileSync(path.join(i18nDir, 'en.json'), 'utf8'));
        const enCount = Array.isArray(en.references) ? en.references.length : 0;
        
        for (const lang of ['es', 'ja', 'ko', 'vi', 'zh']) {
            const fp = path.join(i18nDir, `${lang}.json`);
            if (!fs.existsSync(fp)) continue;
            const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
            const langCount = Array.isArray(data.references) ? data.references.length : 0;
            
            if (langCount < enCount) {
                methodsWithMoreEnRefs++;
                break; // count method once
            } else if (langCount > enCount) {
                methodsWithMoreTransRefs++;
                break;
            }
        }
    }
}

console.log(`Total methods: ${totalMethods}`);
console.log(`Methods where en has MORE refs: ${methodsWithMoreEnRefs}`);
console.log(`Methods where translations have MORE refs: ${methodsWithMoreTransRefs}`);
console.log(`Methods with matching refs: ${totalMethods - methodsWithMoreEnRefs - methodsWithMoreTransRefs}`);

// Check content length anomalies (very short fields that might be placeholders)
console.log('\n=== SHORT FIELD CHECK (fields < 20 chars, excluding algorithm/accuracy) ===\n');
const shortFields = [];
for (const cat of CATEGORIES) {
    const catDir = path.join(METHODS_DIR, cat);
    if (!fs.existsSync(catDir)) continue;
    const methods = fs.readdirSync(catDir).filter(f => {
        return fs.statSync(path.join(catDir, f)).isDirectory() && f !== 'i18n';
    });
    
    for (const method of methods) {
        for (const lang of LANGS) {
            const fp = path.join(catDir, method, 'i18n', `${lang}.json`);
            if (!fs.existsSync(fp)) continue;
            const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
            for (const field of ['mechanism', 'description', 'useCase', 'strengths', 'limitations']) {
                const val = data[field];
                if (typeof val === 'string' && val.length < 20 && val.length > 0) {
                    shortFields.push({ cat, method, lang, field, val, len: val.length });
                }
            }
        }
    }
}

if (shortFields.length > 0) {
    for (const s of shortFields) {
        console.log(`  ${s.cat}/${s.method} [${s.lang}].${s.field} (${s.len} chars): "${s.val}"`);
    }
} else {
    console.log('  None found.');
}
