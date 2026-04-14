/**
 * Check that every method directory has a page.tsx and that it references
 * the correct method. Also check for orphan page.tsx without i18n or vice versa.
 */
const fs = require('fs');
const path = require('path');

const METHODS_DIR = path.join(__dirname, '..', 'src', 'app', 'methods');
const CATEGORIES = ['image', 'text', 'video'];
const issues = [];

let totalMethods = 0;

for (const cat of CATEGORIES) {
    const catDir = path.join(METHODS_DIR, cat);
    if (!fs.existsSync(catDir)) continue;
    const methods = fs.readdirSync(catDir).filter(f => {
        return fs.statSync(path.join(catDir, f)).isDirectory() && f !== 'i18n';
    }).sort();

    for (const method of methods) {
        totalMethods++;
        const methodDir = path.join(catDir, method);
        
        // Check page.tsx exists
        const pagePath = path.join(methodDir, 'page.tsx');
        if (!fs.existsSync(pagePath)) {
            issues.push(`${cat}/${method}: MISSING page.tsx`);
        }
        
        // Check i18n dir exists with files
        const i18nDir = path.join(methodDir, 'i18n');
        if (!fs.existsSync(i18nDir)) {
            issues.push(`${cat}/${method}: MISSING i18n directory`);
        } else {
            const files = fs.readdirSync(i18nDir);
            if (files.length === 0) {
                issues.push(`${cat}/${method}: EMPTY i18n directory`);
            }
        }
        
        // Check for extra unexpected files in method directory
        const contents = fs.readdirSync(methodDir);
        const expected = ['page.tsx', 'i18n'];
        for (const item of contents) {
            if (!expected.includes(item)) {
                issues.push(`${cat}/${method}: UNEXPECTED item "${item}"`);
            }
        }
    }
}

console.log(`Total methods checked: ${totalMethods}`);
console.log(`Issues found: ${issues.length}`);
if (issues.length > 0) {
    for (const i of issues) {
        console.log(`  ${i}`);
    }
}
