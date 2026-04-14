// Generate detailed list of all untranslated fields
// Output: JSON file with { lang: { "cat/method": { field: enValue } } }
const fs = require('fs');
const path = require('path');

const METHODS_DIR = path.join(__dirname, '..', 'src', 'app', 'methods');
const NON_EN_LANGS = ['es', 'ja', 'ko', 'vi', 'zh'];

const LANG_CHAR_PATTERNS = {
  ko: /[\uAC00-\uD7AF\u1100-\u11FF]/,
  ja: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/,
  zh: /[\u4E00-\u9FFF\u3400-\u4DBF]/,
  vi: /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i,
  es: /[áéíóúñ¿¡ü]/i,
};

const results = {};
const categories = ['image', 'video', 'text'];

for (const cat of categories) {
  const catDir = path.join(METHODS_DIR, cat);
  if (!fs.existsSync(catDir)) continue;
  const methods = fs.readdirSync(catDir).filter(d => fs.statSync(path.join(catDir, d)).isDirectory());

  for (const method of methods) {
    const i18nDir = path.join(catDir, method, 'i18n');
    const enFile = path.join(i18nDir, 'en.json');
    if (!fs.existsSync(enFile)) continue;
    let enData;
    try { enData = JSON.parse(fs.readFileSync(enFile, 'utf8')); } catch { continue; }

    for (const lang of NON_EN_LANGS) {
      const langFile = path.join(i18nDir, `${lang}.json`);
      if (!fs.existsSync(langFile)) continue;
      let langData;
      try { langData = JSON.parse(fs.readFileSync(langFile, 'utf8')); } catch { continue; }

      const langPattern = LANG_CHAR_PATTERNS[lang];
      if (!langPattern) continue;

      const checkFields = ['name', 'description', 'mechanism', 'useCase', 'strengths', 'limitations'];
      for (const field of checkFields) {
        if (!langData[field] || typeof langData[field] !== 'string') continue;
        const text = langData[field].trim();
        if (text.length < 15) continue;

        if (!langPattern.test(text)) {
          const asciiCount = (text.match(/[a-zA-Z]/g) || []).length;
          const ratio = asciiCount / text.length;
          if (ratio > 0.65) {
            if (!results[lang]) results[lang] = {};
            const key = `${cat}/${method}`;
            if (!results[lang][key]) results[lang][key] = {};
            results[lang][key][field] = langData[field].substring(0, 150);
          }
        }
      }
    }
  }
}

// Print summary by field type per language
console.log('=== UNTRANSLATED FIELDS DETAIL ===\n');

for (const lang of NON_EN_LANGS) {
  if (!results[lang]) { console.log(`${lang}: All translated!`); continue; }
  
  const methods = Object.keys(results[lang]);
  const byField = {};
  for (const [m, fields] of Object.entries(results[lang])) {
    for (const f of Object.keys(fields)) {
      if (!byField[f]) byField[f] = [];
      byField[f].push(m);
    }
  }
  
  console.log(`\n=== ${lang.toUpperCase()} - ${methods.length} methods with issues ===`);
  for (const [field, methodList] of Object.entries(byField)) {
    console.log(`  ${field}: ${methodList.length} methods`);
    methodList.forEach(m => console.log(`    ${m}`));
  }
}

// Save full data for fixing script
fs.writeFileSync(path.join(__dirname, 'untranslated_fields.json'), JSON.stringify(results, null, 2), 'utf8');
console.log('\nSaved detailed data to scripts/untranslated_fields.json');
