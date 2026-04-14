// Fix corrupted UTF-8 encoding in i18n files
// â€¢ -> • (bullet), â€" -> — (em dash), â€™ -> ' (smart quote), etc.
const fs = require('fs');
const path = require('path');

const METHODS_DIR = path.join(__dirname, '..', 'src', 'app', 'methods');

const REPLACEMENTS = [
  ['â€¢', '•'],
  ['â€"', '—'],
  ['â€"', '–'],
  ['â€™', '\u2019'], // right single quote
  ['â€œ', '\u201c'], // left double quote
  ['â€\u009d', '\u201d'], // right double quote
  ['Ã¡', 'á'],
  ['Ã©', 'é'],
  ['Ã³', 'ó'],
  ['Ã±', 'ñ'],
  ['Ã­', 'í'],
  ['Ãº', 'ú'],
  ['Ã¼', 'ü'],
];

let fixedFiles = 0;
let totalReplacements = 0;

function scan(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const p = path.join(dir, item);
    if (fs.statSync(p).isDirectory()) {
      scan(p);
    } else if (item.endsWith('.json')) {
      let content = fs.readFileSync(p, 'utf8');
      let changed = false;
      
      for (const [from, to] of REPLACEMENTS) {
        if (content.includes(from)) {
          const count = (content.match(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
          content = content.split(from).join(to);
          totalReplacements += count;
          changed = true;
        }
      }
      
      if (changed) {
        // Verify still valid JSON
        try {
          JSON.parse(content);
          fs.writeFileSync(p, content, 'utf8');
          fixedFiles++;
          console.log(`Fixed: ${path.relative(METHODS_DIR, p)}`);
        } catch (e) {
          console.log(`ERROR (skipped): ${path.relative(METHODS_DIR, p)} - ${e.message}`);
        }
      }
    }
  }
}

scan(METHODS_DIR);
console.log(`\nFixed ${fixedFiles} files, ${totalReplacements} replacements`);
