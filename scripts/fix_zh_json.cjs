// Fix unescaped double quotes inside JSON string values in zh.json files
const fs = require('fs');
const path = require('path');

const files = [
  'src/app/methods/image/copydays/i18n/zh.json',
  'src/app/methods/image/contrast_balance/i18n/zh.json'
];

for (const file of files) {
  const fullPath = path.join(__dirname, '..', file);
  const raw = fs.readFileSync(fullPath, 'utf8');
  
  // Try parsing first
  try {
    JSON.parse(raw);
    console.log(`${file}: OK (no fix needed)`);
    continue;
  } catch (e) {
    console.log(`${file}: ${e.message}`);
  }

  // Fix: replace unescaped ASCII double quotes inside Chinese text with Unicode fullwidth quotes
  // Strategy: process char by char, track if we're inside a JSON string value
  let result = '';
  let inString = false;
  let inKey = false;
  let afterColon = false;
  let depth = 0;
  
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    const prev = i > 0 ? raw[i-1] : '';
    
    if (ch === '"' && prev !== '\\') {
      if (!inString) {
        // Opening a string
        inString = true;
        result += ch;
      } else {
        // Check if this is really the end of the string
        // Look ahead: after closing quote we expect , or } or ] or : or whitespace+one of those
        let j = i + 1;
        while (j < raw.length && (raw[j] === ' ' || raw[j] === '\t' || raw[j] === '\n' || raw[j] === '\r')) j++;
        const next = raw[j];
        
        if (next === ',' || next === '}' || next === ']' || next === ':' || next === undefined) {
          // This is a legitimate closing quote
          inString = false;
          result += ch;
        } else {
          // This is an unescaped quote inside a string value - replace with Chinese quotes
          // Check if the matching close quote follows some Chinese text
          // Use left/right quotes based on context
          // Simple approach: just escape it
          result += '\u201c'; // Replace with Unicode left double quote
        }
      }
    } else {
      result += ch;
    }
  }
  
  // Now look for the matching right quotes - where we have "text" patterns in Chinese
  // Actually, let's try a simpler approach: just look for the second unescaped quote
  // that should also be replaced
  
  // Re-try with a fresh approach: find pairs of unescaped quotes within strings
  let fixed = raw;
  // Match pattern: Chinese char + " + Chinese text + " + Chinese char (unescaped inner quotes)
  // Replace inner " with \u201c and \u201d
  
  // Actually, let me just re-parse the result
  try {
    JSON.parse(result);
    fs.writeFileSync(fullPath, result, 'utf8');
    console.log(`  -> Fixed successfully (first pass)`);
    continue;
  } catch (e2) {
    console.log(`  -> First pass still has error: ${e2.message}`);
  }
  
  // Second attempt: more aggressive - find all " that are between CJK chars
  fixed = raw;
  // Replace " between CJK characters with fullwidth quotes
  fixed = fixed.replace(/([\u4e00-\u9fff\u3400-\u4dbf\uff00-\uffef])\u0022([\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff])/g, '$1\u201c$2');
  fixed = fixed.replace(/([\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff])\u0022([\u4e00-\u9fff\u3400-\u4dbf\uff00-\uffef,\.\}\]\n\r ])/g, '$1\u201d$2');
  
  try {
    JSON.parse(fixed);
    fs.writeFileSync(fullPath, fixed, 'utf8');
    console.log(`  -> Fixed successfully (second pass)`);
  } catch (e3) {
    console.log(`  -> Second pass error: ${e3.message}`);
    // Show problematic area
    const pos = parseInt(e3.message.match(/position (\d+)/)?.[1] || '0');
    console.log(`  Context around pos ${pos}: ${JSON.stringify(fixed.substring(pos-20, pos+20))}`);
  }
}
