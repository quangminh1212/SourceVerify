const fs = require('fs');
const path = require('path');

const FIELDS = ['name', 'description', 'mechanism', 'parameters', 'accuracy', 'useCase', 'strengths', 'limitations'];
const baseDir = path.join(__dirname, '..', 'src', 'app', 'methods');
const categories = ['image', 'text', 'video'];

const results = [];

for (const cat of categories) {
  const catDir = path.join(baseDir, cat);
  if (!fs.existsSync(catDir)) continue;
  
  const methods = fs.readdirSync(catDir).filter(d => {
    const full = path.join(catDir, d);
    return fs.statSync(full).isDirectory() && d !== '_components';
  });

  for (const method of methods) {
    const i18nDir = path.join(catDir, method, 'i18n');
    const enFile = path.join(i18nDir, 'en.json');
    const esFile = path.join(i18nDir, 'es.json');

    if (!fs.existsSync(enFile) || !fs.existsSync(esFile)) continue;

    let en, es;
    try {
      en = JSON.parse(fs.readFileSync(enFile, 'utf8'));
      es = JSON.parse(fs.readFileSync(esFile, 'utf8'));
    } catch (e) {
      console.error(`Error parsing ${method}: ${e.message}`);
      continue;
    }

    const identical = [];
    for (const field of FIELDS) {
      if (en[field] !== undefined && es[field] !== undefined) {
        const enVal = JSON.stringify(en[field]);
        const esVal = JSON.stringify(es[field]);
        if (enVal === esVal && enVal !== '""' && enVal !== 'null') {
          identical.push(field);
        }
      }
    }

    if (identical.length > 0) {
      results.push({
        path: `${cat}/${method}`,
        fields: identical,
        details: identical.map(f => ({
          field: f,
          value: typeof en[f] === 'string' ? en[f].substring(0, 80) + (en[f].length > 80 ? '...' : '') : JSON.stringify(en[f]).substring(0, 80)
        }))
      });
    }
  }
}

console.log(`\n=== Untranslated Spanish (es.json) Fields Report ===\n`);
console.log(`Total files with untranslated fields: ${results.length}\n`);

for (const r of results) {
  console.log(`--- ${r.path}/i18n/es.json ---`);
  console.log(`  Untranslated fields (${r.fields.length}): ${r.fields.join(', ')}`);
  for (const d of r.details) {
    console.log(`    ${d.field}: "${d.value}"`);
  }
  console.log('');
}

if (results.length === 0) {
  console.log('No untranslated fields found!');
}
