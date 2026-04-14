// Batch translate untranslated fields in i18n files
// This script identifies English-only fields in non-English files and generates translations
const fs = require('fs');
const path = require('path');

const METHODS_DIR = path.join(__dirname, '..', 'src', 'app', 'methods');
const NON_EN_LANGS = ['es', 'ja', 'ko', 'zh'];

const LANG_CHAR_PATTERNS = {
  ko: /[\uAC00-\uD7AF\u1100-\u11FF]/,
  ja: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/,
  zh: /[\u4E00-\u9FFF\u3400-\u4DBF]/,
  vi: /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i,
  es: /[áéíóúñ¿¡ü]/i,
};

// Collect all untranslated entries
const untranslated = {};
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
      const untranslatedFields = [];
      
      for (const field of checkFields) {
        if (!langData[field] || typeof langData[field] !== 'string') continue;
        const text = langData[field].trim();
        if (text.length < 15) continue;

        if (!langPattern.test(text)) {
          const asciiCount = (text.match(/[a-zA-Z]/g) || []).length;
          const ratio = asciiCount / text.length;
          if (ratio > 0.65) {
            untranslatedFields.push(field);
          }
        }
      }

      if (untranslatedFields.length > 0) {
        const key = `${cat}/${method}`;
        if (!untranslated[lang]) untranslated[lang] = {};
        untranslated[lang][key] = {
          filePath: langFile,
          fields: untranslatedFields,
          enValues: {},
          currentValues: {}
        };
        for (const f of untranslatedFields) {
          untranslated[lang][key].enValues[f] = enData[f];
          untranslated[lang][key].currentValues[f] = langData[f];
        }
      }
    }
  }
}

// Output summary and save for external processing
let totalCount = 0;
for (const [lang, methods] of Object.entries(untranslated)) {
  const methodCount = Object.keys(methods).length;
  let fieldCount = 0;
  for (const m of Object.values(methods)) {
    fieldCount += m.fields.length;
  }
  totalCount += fieldCount;
  console.log(`${lang}: ${methodCount} methods, ${fieldCount} untranslated fields`);
}
console.log(`\nTotal: ${totalCount} fields need translation`);

// Save for processing
fs.writeFileSync(
  path.join(__dirname, 'untranslated_full.json'),
  JSON.stringify(untranslated, null, 2),
  'utf8'
);
console.log('Saved to scripts/untranslated_full.json');
