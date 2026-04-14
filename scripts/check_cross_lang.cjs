const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'src', 'app', 'methods');
const cats = ['image', 'text', 'video'];
const TK = ['name', 'description', 'mechanism', 'useCase', 'strengths', 'limitations', 'parameters', 'accuracy'];

function hasVietnamese(t) { return /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i.test(t); }
function hasJapaneseKana(t) { return /[\u3040-\u309f\u30a0-\u30ff]/.test(t); }
function hasKorean(t) { return /[\uac00-\ud7af]/.test(t); }

let viInJaKoZh = [];
let jaInKo = [];
let koInJa = [];

for (const cat of cats) {
    const d = path.join(dir, cat);
    if (!fs.existsSync(d)) continue;
    for (const m of fs.readdirSync(d)) {
        for (const lang of ['ja', 'ko', 'zh']) {
            const fp = path.join(d, m, 'i18n', `${lang}.json`);
            if (!fs.existsSync(fp)) continue;
            const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
            for (const key of TK) {
                if (!data[key] || typeof data[key] !== 'string') continue;
                if (hasVietnamese(data[key])) {
                    viInJaKoZh.push(`${cat}/${m} [${lang}].${key}: VI chars found`);
                }
                if (lang === 'ko' && hasJapaneseKana(data[key])) {
                    jaInKo.push(`${cat}/${m} [ko].${key}: JA kana found`);
                }
                if (lang === 'ja' && hasKorean(data[key])) {
                    koInJa.push(`${cat}/${m} [ja].${key}: KO hangul found`);
                }
            }
        }
    }
}

console.log('=== CROSS-LANGUAGE CONTAMINATION REPORT ===\n');
console.log(`Vietnamese in JA/KO/ZH (${viInJaKoZh.length}):`);
viInJaKoZh.forEach(i => console.log(`  ${i}`));
console.log(`\nJapanese kana in KO (${jaInKo.length}):`);
jaInKo.forEach(i => console.log(`  ${i}`));
console.log(`\nKorean hangul in JA (${koInJa.length}):`);
koInJa.forEach(i => console.log(`  ${i}`));
