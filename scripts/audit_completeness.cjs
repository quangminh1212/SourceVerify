/**
 * Comprehensive completeness audit for all methods across all languages.
 * Checks:
 * 1. Missing i18n files (should have en, es, ja, ko, vi, zh)
 * 2. Missing required fields in each JSON
 * 3. Empty or placeholder fields
 * 4. Field value consistency (e.g. references should be arrays)
 * 5. JSON parse errors
 * 6. Compares field presence across languages within same method
 */
const fs = require('fs');
const path = require('path');

const METHODS_DIR = path.join(__dirname, '..', 'src', 'app', 'methods');
const LANGS = ['en', 'es', 'ja', 'ko', 'vi', 'zh'];
const REQUIRED_FIELDS = ['name', 'description', 'algorithm', 'mechanism', 'parameters', 'accuracy', 'source', 'useCase', 'references', 'strengths', 'limitations'];
const CATEGORIES = ['image', 'text', 'video'];

const issues = [];

for (const cat of CATEGORIES) {
    const catDir = path.join(METHODS_DIR, cat);
    if (!fs.existsSync(catDir)) continue;
    const methods = fs.readdirSync(catDir).filter(f => {
        const fp = path.join(catDir, f);
        return fs.statSync(fp).isDirectory() && f !== 'i18n';
    }).sort();

    for (const method of methods) {
        const i18nDir = path.join(catDir, method, 'i18n');
        
        // Check if i18n dir exists
        if (!fs.existsSync(i18nDir)) {
            issues.push({ cat, method, type: 'MISSING_I18N_DIR', detail: 'No i18n directory' });
            continue;
        }

        const existingFiles = fs.readdirSync(i18nDir).filter(f => f.endsWith('.json'));
        const existingLangs = existingFiles.map(f => f.replace('.json', ''));

        // Check missing language files
        for (const lang of LANGS) {
            if (!existingLangs.includes(lang)) {
                issues.push({ cat, method, type: 'MISSING_LANG_FILE', detail: `Missing ${lang}.json` });
            }
        }

        // Load all lang files
        const data = {};
        for (const lang of existingLangs) {
            const fp = path.join(i18nDir, `${lang}.json`);
            try {
                data[lang] = JSON.parse(fs.readFileSync(fp, 'utf8'));
            } catch (e) {
                issues.push({ cat, method, type: 'JSON_PARSE_ERROR', detail: `${lang}.json: ${e.message}` });
            }
        }

        // Check each language file for missing/empty fields
        for (const [lang, obj] of Object.entries(data)) {
            for (const field of REQUIRED_FIELDS) {
                if (!(field in obj)) {
                    issues.push({ cat, method, type: 'MISSING_FIELD', detail: `${lang}.json missing "${field}"` });
                } else if (field === 'references') {
                    if (!Array.isArray(obj[field])) {
                        issues.push({ cat, method, type: 'WRONG_TYPE', detail: `${lang}.json "references" is not an array (type: ${typeof obj[field]})` });
                    } else if (obj[field].length === 0) {
                        issues.push({ cat, method, type: 'EMPTY_REFS', detail: `${lang}.json "references" is empty array` });
                    } else {
                        // Check each reference has url and title
                        for (let i = 0; i < obj[field].length; i++) {
                            const ref = obj[field][i];
                            if (!ref.url && !ref.title) {
                                issues.push({ cat, method, type: 'BAD_REF', detail: `${lang}.json references[${i}] missing url and title` });
                            }
                        }
                    }
                } else {
                    const val = obj[field];
                    if (typeof val !== 'string') {
                        issues.push({ cat, method, type: 'WRONG_TYPE', detail: `${lang}.json "${field}" is ${typeof val}, expected string` });
                    } else if (val.trim() === '') {
                        issues.push({ cat, method, type: 'EMPTY_FIELD', detail: `${lang}.json "${field}" is empty` });
                    }
                }
            }

            // Check for extra unexpected fields
            const knownFields = [...REQUIRED_FIELDS];
            for (const key of Object.keys(obj)) {
                if (!knownFields.includes(key)) {
                    issues.push({ cat, method, type: 'EXTRA_FIELD', detail: `${lang}.json has unexpected field "${key}"` });
                }
            }
        }

        // Cross-language consistency: check references count matches
        const enRefs = data['en']?.references;
        if (Array.isArray(enRefs)) {
            for (const lang of ['es', 'ja', 'ko', 'vi', 'zh']) {
                const langRefs = data[lang]?.references;
                if (Array.isArray(langRefs) && langRefs.length !== enRefs.length) {
                    issues.push({ cat, method, type: 'REF_COUNT_MISMATCH', detail: `${lang}.json has ${langRefs.length} refs vs en.json has ${enRefs.length}` });
                }
            }
        }
    }
}

// Summary
const typeCounts = {};
for (const i of issues) {
    typeCounts[i.type] = (typeCounts[i.type] || 0) + 1;
}

console.log('=== COMPLETENESS AUDIT SUMMARY ===');
console.log(`Total issues: ${issues.length}`);
console.log('');
for (const [type, count] of Object.entries(typeCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type}: ${count}`);
}

// Group by type for detail
console.log('\n=== DETAILS ===\n');

// Show critical issues first
const criticalTypes = ['MISSING_I18N_DIR', 'MISSING_LANG_FILE', 'JSON_PARSE_ERROR', 'MISSING_FIELD', 'EMPTY_FIELD', 'WRONG_TYPE'];
for (const type of criticalTypes) {
    const typeIssues = issues.filter(i => i.type === type);
    if (typeIssues.length === 0) continue;
    console.log(`--- ${type} (${typeIssues.length}) ---`);
    for (const i of typeIssues) {
        console.log(`  ${i.cat}/${i.method}: ${i.detail}`);
    }
    console.log('');
}

// Non-critical
const nonCritical = ['EMPTY_REFS', 'BAD_REF', 'EXTRA_FIELD', 'REF_COUNT_MISMATCH'];
for (const type of nonCritical) {
    const typeIssues = issues.filter(i => i.type === type);
    if (typeIssues.length === 0) continue;
    console.log(`--- ${type} (${typeIssues.length}) ---`);
    for (const i of typeIssues) {
        console.log(`  ${i.cat}/${i.method}: ${i.detail}`);
    }
    console.log('');
}
