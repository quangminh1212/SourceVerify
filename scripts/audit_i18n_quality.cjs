/**
 * Audit i18n files for quality issues:
 * 1. Wrong language (e.g., English text in ko.json)
 * 2. Missing or empty keys
 * 3. Placeholder/untranslated content
 * 4. Keys mismatch between en.json and other language files
 */
const fs = require('fs');
const path = require('path');

const METHODS_DIR = path.join(__dirname, '..', 'src', 'app', 'methods');
const LANGS = ['en', 'es', 'ja', 'ko', 'vi', 'zh'];
const NON_EN_LANGS = ['es', 'ja', 'ko', 'vi', 'zh'];

// Common English words/phrases that should NOT appear in non-English translations
const ENGLISH_INDICATORS = {
  ko: [
    /^This method /i,
    /^The /i,
    /^It (is|was|can|has|does|will|should|may|might) /i,
    /\bdetects?\b.*\b(manipulat|tamper|forg|edit|alter)/i,
    /^Analyzes? /i,
    /^Identifies? /i,
    /^Measures? /i,
    /^Examines? /i,
    /\bStrengths?\b.*:/i,
    /\bLimitations?\b.*:/i,
    /\bAccuracy\b/i,
    /\bThis (technique|algorithm|approach|analysis|tool|method)/i,
  ],
  ja: [
    /^This method /i,
    /^The /i,
    /^It (is|was|can|has|does|will|should|may|might) /i,
    /\bdetects?\b.*\b(manipulat|tamper|forg|edit|alter)/i,
    /^Analyzes? /i,
    /^Identifies? /i,
    /\bThis (technique|algorithm|approach|analysis|tool|method)/i,
  ],
  zh: [
    /^This method /i,
    /^The /i,
    /^It (is|was|can|has|does|will|should|may|might) /i,
    /\bdetects?\b.*\b(manipulat|tamper|forg|edit|alter)/i,
    /^Analyzes? /i,
    /\bThis (technique|algorithm|approach|analysis|tool|method)/i,
  ],
  vi: [
    /^This method /i,
    /^The /i,
    /^It (is|was|can|has|does|will|should|may|might) /i,
    /\bdetects?\b.*\b(manipulat|tamper|forg|edit|alter)/i,
    /^Analyzes? /i,
    /\bThis (technique|algorithm|approach|analysis|tool|method)/i,
  ],
  es: [
    /^This method /i,
    /^The /i,
    /^It (is|was|can|has|does|will|should|may|might) /i,
    /\bdetects?\b.*\b(manipulat|tamper|forg|edit|alter)/i,
    /^Analyzes? /i,
    /\bThis (technique|algorithm|approach|analysis|tool|method)/i,
  ],
};

// Characters that indicate correct language
const LANG_CHAR_PATTERNS = {
  ko: /[\uAC00-\uD7AF\u1100-\u11FF]/,  // Korean characters
  ja: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/,  // Japanese hiragana/katakana/kanji
  zh: /[\u4E00-\u9FFF\u3400-\u4DBF]/,  // Chinese characters
  vi: /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i,  // Vietnamese diacritics
  es: /[áéíóúñ¿¡ü]/i,  // Spanish special characters
};

const issues = [];

function checkFile(filePath, lang, category, method) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      issues.push({
        file: filePath,
        lang,
        category,
        method,
        type: 'PARSE_ERROR',
        detail: `Invalid JSON: ${e.message}`
      });
      return;
    }

    const expectedKeys = ['name', 'description', 'algorithm', 'mechanism', 'useCase', 'strengths', 'limitations', 'parameters', 'accuracy', 'source', 'references'];
    
    // Check missing keys
    for (const key of expectedKeys) {
      if (!(key in data)) {
        issues.push({
          file: path.relative(METHODS_DIR, filePath),
          lang, category, method,
          type: 'MISSING_KEY',
          detail: `Missing key: "${key}"`
        });
      }
    }

    // Check empty values
    for (const [key, value] of Object.entries(data)) {
      if (key === 'references') continue;
      if (typeof value === 'string' && value.trim() === '') {
        issues.push({
          file: path.relative(METHODS_DIR, filePath),
          lang, category, method,
          type: 'EMPTY_VALUE',
          detail: `Empty value for key: "${key}"`
        });
      }
    }

    // Check wrong language (for non-English files)
    if (lang !== 'en') {
      const textFields = ['description', 'mechanism', 'useCase', 'strengths', 'limitations'];
      for (const field of textFields) {
        if (!data[field] || typeof data[field] !== 'string') continue;
        const text = data[field].trim();
        if (text.length < 10) continue;

        // Check if text starts with English patterns
        const indicators = ENGLISH_INDICATORS[lang] || [];
        for (const pattern of indicators) {
          if (pattern.test(text)) {
            // Double check: does the text contain ANY characters from the target language?
            const langPattern = LANG_CHAR_PATTERNS[lang];
            if (langPattern && !langPattern.test(text)) {
              issues.push({
                file: path.relative(METHODS_DIR, filePath),
                lang, category, method,
                type: 'WRONG_LANGUAGE',
                detail: `Field "${field}" appears to be in English, not ${lang}. Starts with: "${text.substring(0, 80)}..."`
              });
              break; // one error per field is enough
            }
          }
        }
      }

      // Additional check: if 'name' field is identical to English, might be untranslated
      // (skip this for technical terms that legitimately stay in English)
    }

    // Check references array
    if (data.references) {
      if (!Array.isArray(data.references)) {
        issues.push({
          file: path.relative(METHODS_DIR, filePath),
          lang, category, method,
          type: 'INVALID_REFERENCES',
          detail: `"references" is not an array`
        });
      } else {
        for (let i = 0; i < data.references.length; i++) {
          const ref = data.references[i];
          if (!ref.title || !ref.url) {
            issues.push({
              file: path.relative(METHODS_DIR, filePath),
              lang, category, method,
              type: 'INCOMPLETE_REFERENCE',
              detail: `Reference [${i}] missing title or url`
            });
          }
        }
      }
    }

  } catch (e) {
    issues.push({
      file: filePath,
      lang,
      category,
      method,
      type: 'READ_ERROR',
      detail: e.message
    });
  }
}

function scanMethods() {
  const categories = ['image', 'video', 'text'];
  let totalFiles = 0;

  for (const cat of categories) {
    const catDir = path.join(METHODS_DIR, cat);
    if (!fs.existsSync(catDir)) continue;

    const methods = fs.readdirSync(catDir).filter(d =>
      fs.statSync(path.join(catDir, d)).isDirectory()
    );

    for (const method of methods) {
      const i18nDir = path.join(catDir, method, 'i18n');
      if (!fs.existsSync(i18nDir)) {
        issues.push({
          file: path.relative(METHODS_DIR, i18nDir),
          lang: '-', category: cat, method,
          type: 'MISSING_I18N_DIR',
          detail: 'No i18n directory found'
        });
        continue;
      }

      // Check which language files exist
      const existingFiles = fs.readdirSync(i18nDir).filter(f => f.endsWith('.json'));
      const existingLangs = existingFiles.map(f => f.replace('.json', ''));

      for (const lang of LANGS) {
        if (!existingLangs.includes(lang)) {
          issues.push({
            file: path.relative(METHODS_DIR, path.join(i18nDir, `${lang}.json`)),
            lang, category: cat, method,
            type: 'MISSING_LANG_FILE',
            detail: `Missing ${lang}.json`
          });
        }
      }

      // Check each file
      for (const lang of LANGS) {
        const filePath = path.join(i18nDir, `${lang}.json`);
        if (fs.existsSync(filePath)) {
          totalFiles++;
          checkFile(filePath, lang, cat, method);
        }
      }
    }
  }

  return totalFiles;
}

// Also check key consistency: non-en files should have same keys as en.json
function checkKeyConsistency() {
  const categories = ['image', 'video', 'text'];

  for (const cat of categories) {
    const catDir = path.join(METHODS_DIR, cat);
    if (!fs.existsSync(catDir)) continue;

    const methods = fs.readdirSync(catDir).filter(d =>
      fs.statSync(path.join(catDir, d)).isDirectory()
    );

    for (const method of methods) {
      const enFile = path.join(catDir, method, 'i18n', 'en.json');
      if (!fs.existsSync(enFile)) continue;

      let enData;
      try {
        enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));
      } catch { continue; }

      const enKeys = Object.keys(enData).sort();

      for (const lang of NON_EN_LANGS) {
        const langFile = path.join(catDir, method, 'i18n', `${lang}.json`);
        if (!fs.existsSync(langFile)) continue;

        let langData;
        try {
          langData = JSON.parse(fs.readFileSync(langFile, 'utf8'));
        } catch { continue; }

        const langKeys = Object.keys(langData).sort();

        // Keys in en but not in lang
        const missingInLang = enKeys.filter(k => !langKeys.includes(k));
        // Keys in lang but not in en
        const extraInLang = langKeys.filter(k => !enKeys.includes(k));

        if (missingInLang.length > 0) {
          issues.push({
            file: path.relative(METHODS_DIR, langFile),
            lang, category: cat, method,
            type: 'KEYS_MISSING_VS_EN',
            detail: `Keys in en.json but missing here: ${missingInLang.join(', ')}`
          });
        }
        if (extraInLang.length > 0) {
          issues.push({
            file: path.relative(METHODS_DIR, langFile),
            lang, category: cat, method,
            type: 'EXTRA_KEYS_VS_EN',
            detail: `Extra keys not in en.json: ${extraInLang.join(', ')}`
          });
        }
      }
    }
  }
}

// Deep check: sample random files for language authenticity
function deepLanguageCheck() {
  const categories = ['image', 'video', 'text'];
  
  for (const cat of categories) {
    const catDir = path.join(METHODS_DIR, cat);
    if (!fs.existsSync(catDir)) continue;

    const methods = fs.readdirSync(catDir).filter(d =>
      fs.statSync(path.join(catDir, d)).isDirectory()
    );

    for (const method of methods) {
      for (const lang of NON_EN_LANGS) {
        const filePath = path.join(catDir, method, 'i18n', `${lang}.json`);
        if (!fs.existsSync(filePath)) continue;

        let data;
        try {
          data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch { continue; }

        // Check if description/mechanism contain NO target language chars at all
        const checkFields = ['description', 'mechanism', 'useCase', 'strengths', 'limitations'];
        const langPattern = LANG_CHAR_PATTERNS[lang];
        if (!langPattern) continue;

        for (const field of checkFields) {
          if (!data[field] || typeof data[field] !== 'string') continue;
          const text = data[field].trim();
          if (text.length < 20) continue;

          // If text is long enough and has NO target language characters, flag it
          if (!langPattern.test(text)) {
            // Could be English or another wrong language
            // Check if it's mostly ASCII (English)
            const asciiCount = (text.match(/[a-zA-Z]/g) || []).length;
            const ratio = asciiCount / text.length;
            if (ratio > 0.7) {
              issues.push({
                file: path.relative(METHODS_DIR, filePath),
                lang, category: cat, method,
                type: 'LIKELY_UNTRANSLATED',
                detail: `Field "${field}" is ${Math.round(ratio * 100)}% ASCII with no ${lang} characters. Text: "${text.substring(0, 100)}..."`
              });
            }
          }
        }
      }
    }
  }
}

console.log('=== i18n Quality Audit ===\n');
console.log('Scanning methods...');
const totalFiles = scanMethods();
console.log(`Scanned ${totalFiles} files.\n`);

console.log('Checking key consistency...');
checkKeyConsistency();

console.log('Deep language check...');
deepLanguageCheck();

console.log(`\n=== RESULTS: ${issues.length} issues found ===\n`);

// Group by type
const byType = {};
for (const issue of issues) {
  if (!byType[issue.type]) byType[issue.type] = [];
  byType[issue.type].push(issue);
}

for (const [type, typeIssues] of Object.entries(byType)) {
  console.log(`\n--- ${type} (${typeIssues.length} issues) ---`);
  for (const issue of typeIssues) {
    console.log(`  [${issue.category}/${issue.method}] ${issue.lang}: ${issue.detail}`);
    console.log(`    File: ${issue.file}`);
  }
}

// Summary
console.log('\n=== SUMMARY ===');
for (const [type, typeIssues] of Object.entries(byType)) {
  console.log(`  ${type}: ${typeIssues.length}`);
}
console.log(`  TOTAL: ${issues.length}`);
