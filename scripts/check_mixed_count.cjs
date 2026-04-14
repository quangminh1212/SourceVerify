const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'src', 'app', 'methods');
const cats = ['image', 'text', 'video'];
const TK = ['mechanism', 'useCase', 'strengths', 'limitations', 'description'];

function hasCJK(t) { return /[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(t); }
function hasEng(t) { return /\b(the|and|for|with|this|which|using|analysis|detection|method|algorithm|image)\b/i.test(t); }

let methods = new Set();
for (const c of cats) {
    const d = path.join(dir, c);
    if (!fs.existsSync(d)) continue;
    for (const m of fs.readdirSync(d)) {
        for (const l of ['ja', 'ko', 'zh']) {
            const fp = path.join(d, m, 'i18n', `${l}.json`);
            if (!fs.existsSync(fp)) continue;
            const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
            for (const k of TK) {
                if (!data[k] || typeof data[k] !== 'string' || data[k].length < 30) continue;
                if (hasCJK(data[k]) && hasEng(data[k])) {
                    const cjkLen = (data[k].match(/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/g) || []).length;
                    const ratio = cjkLen / data[k].length;
                    if (ratio < 0.25) {
                        methods.add(`${c}/${m}`);
                    }
                }
            }
        }
    }
}
const arr = [...methods].sort();
const byCat = { image: 0, text: 0, video: 0 };
arr.forEach(m => byCat[m.split('/')[0]]++);
console.log(`Mixed-language methods: ${arr.length}`);
console.log(`By category: ${JSON.stringify(byCat)}`);
arr.forEach(m => console.log(`  ${m}`));
