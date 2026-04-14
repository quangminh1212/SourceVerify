/**
 * Sync references: for methods where es/ja/ko/zh have more refs than en/vi,
 * add the missing refs to en.json and vi.json
 */
const fs = require('fs');
const path = require('path');

const METHODS_DIR = path.join(__dirname, '..', 'src', 'app', 'methods');
const CATEGORIES = ['image', 'text', 'video'];

let totalFixed = 0;
let methodsFixed = 0;

for (const cat of CATEGORIES) {
    const catDir = path.join(METHODS_DIR, cat);
    if (!fs.existsSync(catDir)) continue;
    const methods = fs.readdirSync(catDir).filter(f => {
        return fs.statSync(path.join(catDir, f)).isDirectory() && f !== 'i18n';
    }).sort();

    for (const method of methods) {
        const i18nDir = path.join(catDir, method, 'i18n');
        
        // Load all files
        const data = {};
        for (const lang of ['en', 'es', 'ja', 'ko', 'vi', 'zh']) {
            const fp = path.join(i18nDir, `${lang}.json`);
            if (fs.existsSync(fp)) {
                data[lang] = JSON.parse(fs.readFileSync(fp, 'utf8'));
            }
        }
        
        if (!data.en) continue;
        
        // Collect the maximum refs set from es (representative of batch-generated translations)
        const esRefs = data.es?.references || [];
        const enRefs = data.en.references || [];
        const viRefs = data.vi?.references || [];
        
        if (esRefs.length <= enRefs.length) continue; // en already has enough
        
        // Build URL set of existing en refs for dedup
        const enUrls = new Set(enRefs.map(r => r.url));
        const viUrls = new Set(viRefs.map(r => r.url));
        
        // Find refs in es that are not in en
        const missingInEn = esRefs.filter(r => !enUrls.has(r.url));
        const missingInVi = esRefs.filter(r => !viUrls.has(r.url));
        
        if (missingInEn.length > 0) {
            data.en.references = [...enRefs, ...missingInEn];
            const fp = path.join(i18nDir, 'en.json');
            fs.writeFileSync(fp, JSON.stringify(data.en, null, 4) + '\n', 'utf8');
            totalFixed++;
            console.log(`${cat}/${method} [en]: +${missingInEn.length} refs (${enRefs.length} → ${data.en.references.length})`);
        }
        
        if (missingInVi.length > 0 && data.vi) {
            data.vi.references = [...viRefs, ...missingInVi];
            const fp = path.join(i18nDir, 'vi.json');
            fs.writeFileSync(fp, JSON.stringify(data.vi, null, 4) + '\n', 'utf8');
            totalFixed++;
            console.log(`${cat}/${method} [vi]: +${missingInVi.length} refs (${viRefs.length} → ${data.vi.references.length})`);
        }
        
        methodsFixed++;
    }
}

console.log(`\nMethods synced: ${methodsFixed}, Files updated: ${totalFixed}`);
