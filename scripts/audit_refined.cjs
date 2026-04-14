const fs = require('fs');
const path = require('path');

const methodsDir = path.join(__dirname, '..', 'src', 'app', 'methods');
const LANGS = ['es', 'ja', 'ko', 'vi', 'zh'];
const TEXT_KEYS = ['name', 'description', 'mechanism', 'useCase', 'strengths', 'limitations'];

// Detect CJK characters
function hasCJK(text) { return /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff\u3400-\u4dbf\uac00-\ud7af\u1100-\u11ff]/.test(text); }
function hasJapanese(text) { return /[\u3040-\u309f\u30a0-\u30ff]/.test(text); }
function hasKorean(text) { return /[\uac00-\ud7af]/.test(text); }
function hasVietnamese(text) { return /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i.test(text); }
function hasSpanishDiacritics(text) { return /[áéíóúñ¿¡ü]/i.test(text); }

// For CJK langs: check if text is still English (lacks target script)
function isEnglishForLang(text, lang) {
    if (!text || text.length < 30) return false;
    if (lang === 'ja') return !hasJapanese(text) && !(/[\u4e00-\u9fff]/.test(text));
    if (lang === 'ko') return !hasKorean(text);
    if (lang === 'zh') return !/[\u4e00-\u9fff\u3400-\u4dbf]/.test(text);
    if (lang === 'vi') return !hasVietnamese(text) && !/[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i.test(text);
    if (lang === 'es') return !hasSpanishDiacritics(text) && !/\b(el|la|los|las|del|por|para|con|que|una|como|más|también|este|esta|entre|sin|sobre|desde|donde|cuando|puede|tiene|cada|otro|toda|muy|pero|bien|así|según|hacia|hasta|mediante|durante)\b/i.test(text);
    return false;
}

const categories = ['image', 'text', 'video'];
const issues = { wrongLang: [], encoding: [], untranslated: {}, missingFile: [], parseError: [] };

for (const lang of LANGS) {
    issues.untranslated[lang] = {};
    for (const key of TEXT_KEYS) issues.untranslated[lang][key] = [];
}

let total = 0;
for (const cat of categories) {
    const catDir = path.join(methodsDir, cat);
    if (!fs.existsSync(catDir)) continue;
    const methods = fs.readdirSync(catDir).filter(d => {
        return fs.statSync(path.join(catDir, d)).isDirectory() && fs.existsSync(path.join(catDir, d, 'i18n'));
    });
    for (const method of methods) {
        total++;
        const methodId = `${cat}/${method}`;
        for (const lang of LANGS) {
            const fp = path.join(catDir, method, 'i18n', `${lang}.json`);
            if (!fs.existsSync(fp)) { issues.missingFile.push(`${methodId}/${lang}`); continue; }
            let data;
            try { data = JSON.parse(fs.readFileSync(fp, 'utf8')); }
            catch(e) { issues.parseError.push(`${methodId}/${lang}: ${e.message}`); continue; }

            for (const key of TEXT_KEYS) {
                if (!data[key] || typeof data[key] !== 'string' || data[key].length < 20) continue;
                if (isEnglishForLang(data[key], lang)) {
                    issues.untranslated[lang][key].push(methodId);
                }
            }

            // Wrong language check
            if (data.mechanism && lang === 'ko' && hasJapanese(data.mechanism)) {
                issues.wrongLang.push(`${methodId} [ko]: mechanism has Japanese hiragana/katakana`);
            }
            if (data.mechanism && lang === 'ja' && hasKorean(data.mechanism)) {
                issues.wrongLang.push(`${methodId} [ja]: mechanism has Korean hangul`);
            }
            if (data.mechanism && lang === 'es' && hasCJK(data.mechanism)) {
                issues.wrongLang.push(`${methodId} [es]: mechanism has CJK characters`);
            }
        }
    }
}

console.log(`=== REFINED AUDIT (${total} methods) ===\n`);

if (issues.missingFile.length) console.log(`MISSING FILES: ${issues.missingFile.length}\n  ${issues.missingFile.join('\n  ')}\n`);
if (issues.parseError.length) console.log(`PARSE ERRORS: ${issues.parseError.length}\n  ${issues.parseError.join('\n  ')}\n`);
if (issues.wrongLang.length) console.log(`WRONG LANGUAGE:\n  ${issues.wrongLang.join('\n  ')}\n`);

console.log('UNTRANSLATED FIELDS (still English):');
console.log('Lang  | name | description | mechanism | useCase | strengths | limitations');
console.log('------|------|-------------|-----------|---------|-----------|------------');
for (const lang of LANGS) {
    const u = issues.untranslated[lang];
    console.log(`${lang}    | ${u.name.length.toString().padStart(4)} | ${u.description.length.toString().padStart(11)} | ${u.mechanism.length.toString().padStart(9)} | ${u.useCase.length.toString().padStart(7)} | ${u.strengths.length.toString().padStart(9)} | ${u.limitations.length.toString().padStart(11)}`);
}

// Show specific untranslated methods for mechanism (our focus)
console.log('\n--- UNTRANSLATED MECHANISM DETAILS ---');
for (const lang of LANGS) {
    const methods = issues.untranslated[lang].mechanism;
    if (methods.length > 0) {
        // Group by category
        const img = methods.filter(m => m.startsWith('image/')).length;
        const txt = methods.filter(m => m.startsWith('text/')).length;
        const vid = methods.filter(m => m.startsWith('video/')).length;
        console.log(`\n${lang}: ${methods.length} total (image:${img} text:${txt} video:${vid})`);
        if (methods.length <= 15) {
            for (const m of methods) console.log(`  ${m}`);
        }
    }
}
