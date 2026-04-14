const fs = require('fs');
const path = require('path');

const methodsDir = path.join(__dirname, '..', 'src', 'app', 'methods');
const fixed = [];
const errors = [];
let skippedNoEnRef = 0;
let alreadyHasRefs = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.name === 'vi.json') {
      processViJson(full);
    }
  }
}

function processViJson(viPath) {
  try {
    const viRaw = fs.readFileSync(viPath, 'utf-8');
    const vi = JSON.parse(viRaw);

    // Check if references is missing, null, or empty array
    if (Array.isArray(vi.references) && vi.references.length > 0) {
      alreadyHasRefs++;
      return;
    }

    // Find corresponding en.json
    const enPath = path.join(path.dirname(viPath), 'en.json');
    if (!fs.existsSync(enPath)) {
      errors.push({ viPath: path.relative(methodsDir, viPath), error: 'No en.json found' });
      return;
    }

    const enRaw = fs.readFileSync(enPath, 'utf-8');
    const en = JSON.parse(enRaw);

    if (!Array.isArray(en.references) || en.references.length === 0) {
      skippedNoEnRef++;
      return;
    }

    // Copy references from en.json to vi.json
    vi.references = en.references;
    fs.writeFileSync(viPath, JSON.stringify(vi, null, 4) + '\n', 'utf-8');
    fixed.push({
      file: path.relative(methodsDir, viPath),
      refsAdded: en.references.length,
      firstRef: en.references[0].title || '(no title)',
    });
  } catch (err) {
    errors.push({ viPath: path.relative(methodsDir, viPath), error: err.message });
  }
}

walk(methodsDir);

console.log('=== Results ===');
console.log(`Total vi.json already with references: ${alreadyHasRefs}`);
console.log(`Total vi.json fixed: ${fixed.length}`);
console.log(`Skipped (en.json also has no references): ${skippedNoEnRef}`);
console.log(`Errors: ${errors.length}`);

if (fixed.length > 0) {
  console.log('\n--- Examples of fixed files ---');
  for (const f of fixed.slice(0, 10)) {
    console.log(`  ${f.file} -> added ${f.refsAdded} ref(s), first: "${f.firstRef}"`);
  }
}

if (errors.length > 0) {
  console.log('\n--- Errors ---');
  for (const e of errors) {
    console.log(`  ${e.viPath}: ${e.error}`);
  }
}
