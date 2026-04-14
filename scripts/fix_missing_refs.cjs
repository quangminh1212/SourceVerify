// Fix missing "references" key in non-English files by copying from en.json
const fs = require('fs');
const path = require('path');

const METHODS_DIR = path.join(__dirname, '..', 'src', 'app', 'methods');
const NON_EN_LANGS = ['es', 'ja', 'ko', 'vi', 'zh'];
let fixed = 0;
let errors = 0;

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
    if (!enData.references) continue;

    for (const lang of NON_EN_LANGS) {
      const langFile = path.join(i18nDir, `${lang}.json`);
      if (!fs.existsSync(langFile)) continue;

      let langData;
      try { langData = JSON.parse(fs.readFileSync(langFile, 'utf8')); } catch { errors++; continue; }

      if (!langData.references) {
        langData.references = enData.references;
        try {
          fs.writeFileSync(langFile, JSON.stringify(langData, null, 4), 'utf8');
          fixed++;
        } catch (e) {
          console.log(`Error writing ${cat}/${method}/${lang}: ${e.message}`);
          errors++;
        }
      }
    }
  }
}

console.log(`Fixed ${fixed} files, ${errors} errors`);
