const fs = require('fs'), path = require('path');
const base = path.join('src','lib','methods');
const cats = {};
for (const mt of ['image','text','video']) {
  const dir = path.join(base, mt);
  for (const f of fs.readdirSync(dir).filter(x=>x.endsWith('.ts'))) {
    const c = fs.readFileSync(path.join(dir,f),'utf-8');
    const matches = c.match(/category\s*:\s*["']([^"']+)["']/g) || [];
    const uniqueCats = [...new Set(matches.map(m => m.match(/["']([^"']+)["']/)[1]))];
    for (const cat of uniqueCats) {
      if (!['pixel','frequency','statistical','metadata','sensor'].includes(cat)) {
        if (!cats[cat]) cats[cat]=[];
        cats[cat].push(mt+'/'+f);
      }
    }
  }
}
console.log('Invalid categories breakdown:');
for (const [c,files] of Object.entries(cats).sort((a,b)=>b[1].length-a[1].length)) {
  console.log(`  "${c}": ${files.length} files`);
  for (const f of files) console.log(`    - ${f}`);
}
const unique = new Set(Object.values(cats).flat()).size;
console.log(`\nTotal unique files with invalid categories: ${unique}`);

// Also list the 31 files missing details
console.log('\n--- Files missing "details" field ---');
for (const mt of ['image','text','video']) {
  const dir = path.join(base, mt);
  for (const f of fs.readdirSync(dir).filter(x=>x.endsWith('.ts'))) {
    const c = fs.readFileSync(path.join(dir,f),'utf-8');
    const returnBlocks = c.match(/return\s*\{[^}]*\}/gs) || [];
    const allReturn = returnBlocks.join(' ');
    const hasDetails = /\bdetails\s*[:=,]|\bdetails\b/.test(allReturn) || /["']details["']\s*:/.test(c);
    if (!hasDetails) console.log(`  ${mt}/${f}`);
  }
}

// Check noise.ts weight
console.log('\n--- Weight out of range ---');
for (const mt of ['image','text','video']) {
  const dir = path.join(base, mt);
  for (const f of fs.readdirSync(dir).filter(x=>x.endsWith('.ts'))) {
    const c = fs.readFileSync(path.join(dir,f),'utf-8');
    const wms = c.match(/weight\s*:\s*([\d.]+)/g) || [];
    for (const wm of wms) {
      const v = parseFloat(wm.match(/([\d.]+)/)[1]);
      if (v < 0.02 || v > 1.5) console.log(`  ${mt}/${f}: weight=${v}`);
    }
  }
}
