/**
 * Detailed audit report - grouped by issue type, category, language
 * Outputs to a JSON file for easier processing
 */
const fs = require('fs');
const path = require('path');

const METHODS_DIR = path.join(__dirname, '..', 'src', 'app', 'methods');
const LANGS = ['en', 'es', 'ja', 'ko', 'vi', 'zh'];
const NON_EN_LANGS = ['es', 'ja', 'ko', 'vi', 'zh'];

const LANG_CHAR_PATTERNS = {
  ko: /[\uAC00-\uD7AF\u1100-\u11FF]/,
  ja: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/,
  zh: /[\u4E00-\u9FFF\u3400-\u4DBF]/,
  vi: /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i,
  es: /[áéíóúñ¿¡ü]/i,
};

const results = {
  parseErrors: [],
  missingKeys: {},     // { "category/method": { lang: [keys] } }
  wrongLang: {},       // { lang: { "category/method": [fields] } }
  untranslated: {},    // { lang: { "category/method": [fields] } }
  incompleteRefs: [],
};

function scan() {
  const categories = ['image', 'video', 'text'];

  for (const cat of categories) {
    const catDir = path.join(METHODS_DIR, cat);
    if (!fs.existsSync(catDir)) continue;
    const methods = fs.readdirSync(catDir).filter(d => fs.statSync(path.join(catDir, d)).isDirectory());

    for (const method of methods) {
      const i18nDir = path.join(catDir, method, 'i18n');
      if (!fs.existsSync(i18nDir)) continue;

      // Load English as reference
      let enData;
      const enFile = path.join(i18nDir, 'en.json');
      try {
        enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));
      } catch (e) {
        results.parseErrors.push({ file: `${cat}/${method}/i18n/en.json`, error: e.message });
        continue;
      }
      const enKeys = Object.keys(enData);

      for (const lang of NON_EN_LANGS) {
        const filePath = path.join(i18nDir, `${lang}.json`);
        if (!fs.existsSync(filePath)) continue;

        let data;
        try {
          data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (e) {
          results.parseErrors.push({ file: `${cat}/${method}/i18n/${lang}.json`, error: e.message });
          continue;
        }

        // Missing keys
        const langKeys = Object.keys(data);
        const missing = enKeys.filter(k => !langKeys.includes(k));
        if (missing.length > 0) {
          const key = `${cat}/${method}`;
          if (!results.missingKeys[key]) results.missingKeys[key] = {};
          results.missingKeys[key][lang] = missing;
        }

        // Check untranslated fields
        const langPattern = LANG_CHAR_PATTERNS[lang];
        if (!langPattern) continue;

        const checkFields = ['name', 'description', 'mechanism', 'useCase', 'strengths', 'limitations'];
        for (const field of checkFields) {
          if (!data[field] || typeof data[field] !== 'string') continue;
          const text = data[field].trim();
          if (text.length < 15) continue;

          if (!langPattern.test(text)) {
            const asciiCount = (text.match(/[a-zA-Z]/g) || []).length;
            const ratio = asciiCount / text.length;
            if (ratio > 0.65) {
              if (!results.untranslated[lang]) results.untranslated[lang] = {};
              const key = `${cat}/${method}`;
              if (!results.untranslated[lang][key]) results.untranslated[lang][key] = [];
              results.untranslated[lang][key].push(field);
            }
          }
        }
      }
    }
  }
}

scan();

// Print structured summary
console.log('=== PARSE ERRORS ===');
for (const e of results.parseErrors) {
  console.log(`  ${e.file}: ${e.error}`);
}

console.log('\n=== MISSING KEYS (keys in en.json but not in lang file) ===');
let missingCount = 0;
for (const [method, langs] of Object.entries(results.missingKeys)) {
  for (const [lang, keys] of Object.entries(langs)) {
    missingCount++;
    console.log(`  ${method} [${lang}]: ${keys.join(', ')}`);
  }
}
console.log(`  Total: ${missingCount} method-lang combinations with missing keys`);

console.log('\n=== UNTRANSLATED FIELDS BY LANGUAGE ===');
for (const lang of NON_EN_LANGS) {
  const langData = results.untranslated[lang] || {};
  const methods = Object.keys(langData);
  const totalFields = Object.values(langData).reduce((s, arr) => s + arr.length, 0);
  console.log(`\n  --- ${lang.toUpperCase()} (${methods.length} methods, ${totalFields} fields) ---`);
  
  // Group by field
  const byField = {};
  for (const [method, fields] of Object.entries(langData)) {
    for (const f of fields) {
      if (!byField[f]) byField[f] = [];
      byField[f].push(method);
    }
  }
  for (const [field, methodList] of Object.entries(byField)) {
    console.log(`    "${field}": ${methodList.length} methods`);
    // Print first 5 as examples
    for (const m of methodList.slice(0, 5)) {
      console.log(`      - ${m}`);
    }
    if (methodList.length > 5) console.log(`      ... and ${methodList.length - 5} more`);
  }
}

// Overall summary
console.log('\n\n=== OVERALL SUMMARY ===');
console.log(`Parse Errors: ${results.parseErrors.length}`);
console.log(`Methods with Missing Keys: ${missingCount}`);
for (const lang of NON_EN_LANGS) {
  const langData = results.untranslated[lang] || {};
  const totalFields = Object.values(langData).reduce((s, arr) => s + arr.length, 0);
  console.log(`Untranslated fields [${lang}]: ${totalFields}`);
}
