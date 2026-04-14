const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'src', 'app', 'methods');
const cats = ['image', 'text', 'video'];
const TEXT_KEYS = ['name', 'description', 'mechanism', 'useCase', 'strengths', 'limitations'];

function hasCJK(text) { return /[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(text); }
function hasEnglishWords(text) { return /\b(the|and|for|with|from|that|this|which|between|through|using|based|analysis|algorithm|image|text|model|detection|pattern)\b/i.test(text); }

let mixedCount = 0;
let fullEnCount = { ja: {}, ko: {}, zh: {} };

for (const cat of cats) {
    const d = path.join(dir, cat);
    if (!fs.existsSync(d)) continue;
    for (const m of fs.readdirSync(d)) {
        for (const lang of ['ja', 'ko', 'zh']) {
            const fp = path.join(d, m, 'i18n', `${lang}.json`);
            if (!fs.existsSync(fp)) continue;
            const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
            
            for (const key of TEXT_KEYS) {
                if (!data[key] || typeof data[key] !== 'string' || data[key].length < 30) continue;
                const cjk = hasCJK(data[key]);
                const eng = hasEnglishWords(data[key]);
                
                if (cjk && eng) {
                    // Mixed content - potential partial translation
                    const cjkChars = (data[key].match(/[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g) || []).length;
                    const totalChars = data[key].replace(/[\s\d.,;:!?()\[\]{}"'\-\/\\•\n\r$=+*#@%&|<>~`^_]/g, '').length;
                    const cjkRatio = cjkChars / totalChars;
                    // Only flag if CJK is less than 50% (truly mixed, not just some English terms)
                    if (cjkRatio < 0.4) {
                        console.log(`MIXED [${lang}] ${cat}/${m}.${key} (CJK: ${Math.round(cjkRatio*100)}%): ${data[key].substring(0, 80)}...`);
                        mixedCount++;
                    }
                }
            }
        }
    }
}
console.log(`\nTotal mixed-language fields: ${mixedCount}`);
