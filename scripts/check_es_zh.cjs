const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'src', 'app', 'methods');
const cats = ['image', 'text', 'video'];

function hasSpDia(t) { return /[áéíóúñ¿¡ü]/i.test(t); }
function hasSpWords(t) { return /\b(el|la|los|las|del|por|para|con|que|una|como|de|en|y)\b/i.test(t); }

// ES names without Spanish markers
let esNames = [];
for (const cat of cats) {
    const d = path.join(dir, cat);
    if (!fs.existsSync(d)) continue;
    for (const m of fs.readdirSync(d)) {
        const fp = path.join(d, m, 'i18n', 'es.json');
        if (!fs.existsSync(fp)) continue;
        const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
        if (data.name && !hasSpDia(data.name) && !hasSpWords(data.name)) {
            esNames.push(`${cat}/${m}: "${data.name}"`);
        }
    }
}
console.log(`ES names without Spanish markers (${esNames.length}):`);
esNames.forEach(n => console.log(`  ${n}`));

// ZH useCase still English
console.log('\nZH untranslated useCase:');
for (const cat of cats) {
    const d = path.join(dir, cat);
    if (!fs.existsSync(d)) continue;
    for (const m of fs.readdirSync(d)) {
        const fp = path.join(d, m, 'i18n', 'zh.json');
        if (!fs.existsSync(fp)) continue;
        const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
        if (data.useCase && typeof data.useCase === 'string' && data.useCase.length > 30 && !/[\u4e00-\u9fff]/.test(data.useCase)) {
            console.log(`  ${cat}/${m}: "${data.useCase.substring(0, 80)}..."`);
        }
    }
}
