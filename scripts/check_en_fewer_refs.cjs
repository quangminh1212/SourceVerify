/**
 * Check methods where en.json has FEWER refs than translations
 * to see if en.json should be updated
 */
const fs = require('fs');
const path = require('path');

const METHODS_DIR = path.join(__dirname, '..', 'src', 'app', 'methods');
const LANGS = ['en', 'es', 'ja', 'ko', 'vi', 'zh'];
const CATEGORIES = ['image', 'text', 'video'];

let count = 0;
for (const cat of CATEGORIES) {
    const catDir = path.join(METHODS_DIR, cat);
    if (!fs.existsSync(catDir)) continue;
    const methods = fs.readdirSync(catDir).filter(f => {
        return fs.statSync(path.join(catDir, f)).isDirectory() && f !== 'i18n';
    }).sort();

    for (const method of methods) {
        const i18nDir = path.join(catDir, method, 'i18n');
        const enData = JSON.parse(fs.readFileSync(path.join(i18nDir, 'en.json'), 'utf8'));
        const enCount = Array.isArray(enData.references) ? enData.references.length : 0;
        
        // Compare with vi.json (most complete alongside en)
        const viFp = path.join(i18nDir, 'vi.json');
        if (!fs.existsSync(viFp)) continue;
        const viData = JSON.parse(fs.readFileSync(viFp, 'utf8'));
        const viCount = Array.isArray(viData.references) ? viData.references.length : 0;
        
        // Check a sample translation
        const esFp = path.join(i18nDir, 'es.json');
        if (!fs.existsSync(esFp)) continue;
        const esData = JSON.parse(fs.readFileSync(esFp, 'utf8'));
        const esCount = Array.isArray(esData.references) ? esData.references.length : 0;
        
        // Only interested if translations have MORE than en
        if (esCount > enCount || viCount > enCount) {
            count++;
            if (count <= 10) { // Show first 10 examples
                console.log(`\n--- ${cat}/${method} ---`);
                console.log(`  en: ${enCount} refs`);
                console.log(`  vi: ${viCount} refs`);
                console.log(`  es: ${esCount} refs`);
                
                // Show which refs are in translations but not en
                const enTitles = new Set((enData.references || []).map(r => r.title.substring(0, 40)));
                for (const ref of (esData.references || [])) {
                    const short = ref.title.substring(0, 40);
                    if (!enTitles.has(short)) {
                        console.log(`  EXTRA in es: ${ref.title.substring(0, 80)}`);
                    }
                }
            }
        }
    }
}

console.log(`\nTotal methods where translations have more refs than en: ${count}`);
