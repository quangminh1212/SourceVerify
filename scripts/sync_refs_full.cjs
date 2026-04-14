/**
 * Bidirectional sync: ensure all languages have the complete union of references.
 * Uses en.json as the source of truth (which now has the full union).
 */
const fs = require('fs');
const path = require('path');

const METHODS_DIR = path.join(__dirname, '..', 'src', 'app', 'methods');
const CATEGORIES = ['image', 'text', 'video'];
const ALL_LANGS = ['en', 'es', 'ja', 'ko', 'vi', 'zh'];

let totalFixed = 0;

for (const cat of CATEGORIES) {
    const catDir = path.join(METHODS_DIR, cat);
    if (!fs.existsSync(catDir)) continue;
    const methods = fs.readdirSync(catDir).filter(f => {
        return fs.statSync(path.join(catDir, f)).isDirectory() && f !== 'i18n';
    }).sort();

    for (const method of methods) {
        const i18nDir = path.join(catDir, method, 'i18n');
        
        // Load en.json as source of truth for references
        const enFp = path.join(i18nDir, 'en.json');
        if (!fs.existsSync(enFp)) continue;
        const enData = JSON.parse(fs.readFileSync(enFp, 'utf8'));
        const enRefs = enData.references || [];
        if (enRefs.length === 0) continue;
        
        // For each other language, check if they have fewer refs
        for (const lang of ['es', 'ja', 'ko', 'vi', 'zh']) {
            const fp = path.join(i18nDir, `${lang}.json`);
            if (!fs.existsSync(fp)) continue;
            const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
            const langRefs = data.references || [];
            
            if (langRefs.length < enRefs.length) {
                // Find missing refs by URL
                const langUrls = new Set(langRefs.map(r => r.url));
                const missing = enRefs.filter(r => !langUrls.has(r.url));
                
                if (missing.length > 0) {
                    data.references = [...langRefs, ...missing];
                    fs.writeFileSync(fp, JSON.stringify(data, null, 4) + '\n', 'utf8');
                    totalFixed++;
                    console.log(`${cat}/${method} [${lang}]: +${missing.length} refs (${langRefs.length} → ${data.references.length})`);
                }
            }
        }
    }
}

console.log(`\nFiles updated: ${totalFixed}`);
