const fs = require('fs');
const path = require('path');

const methodsDir = path.join(__dirname, '..', 'src', 'app', 'methods');
const LANGS = ['en', 'es', 'ja', 'ko', 'vi', 'zh'];
const REQUIRED_KEYS = ['name', 'description', 'algorithm', 'mechanism', 'useCase', 'strengths', 'limitations', 'parameters', 'accuracy', 'references', 'source'];

const issues = [];
let totalFiles = 0;
let totalMethods = 0;

function addIssue(method, lang, type, detail) {
    issues.push({ method, lang, type, detail });
}

// Detect if text is predominantly English (heuristic)
function looksEnglish(text) {
    if (!text || text.length < 20) return false;
    // Count ASCII letter ratio
    const ascii = text.replace(/[^a-zA-Z]/g, '').length;
    const total = text.replace(/[\s\d.,;:!?()\[\]{}"'\-\/\\•\n\r$=+*#@%&|<>~`^_]/g, '').length;
    if (total === 0) return false;
    return (ascii / total) > 0.85;
}

// Check for common encoding corruption patterns
function hasEncodingIssues(text) {
    // Common mojibake patterns
    return /Ã¡|Ã©|Ã­|Ã³|Ãº|Ã±|Ã¼|Â |ÃŸ|â€™|â€"|â€œ|Ã¢|Ãª|Ã®|Ã´|Ã»|Ã§|á»|áº|ắ|ề|ổ/.test(text) && 
           !/[\u00e0-\u00ff\u0100-\u024f\u1e00-\u1eff]/.test(text.substring(0, 10));
}

function hasJapanese(text) {
    return /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]/.test(text);
}
function hasKorean(text) {
    return /[\uac00-\ud7af\u1100-\u11ff]/.test(text);
}
function hasChinese(text) {
    return /[\u4e00-\u9fff\u3400-\u4dbf]/.test(text);
}
function hasVietnamese(text) {
    return /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i.test(text);
}
function hasSpanish(text) {
    return /[áéíóúñ¿¡ü]/i.test(text);
}

const categories = ['image', 'text', 'video'];

for (const cat of categories) {
    const catDir = path.join(methodsDir, cat);
    if (!fs.existsSync(catDir)) continue;
    
    const methods = fs.readdirSync(catDir).filter(d => {
        const p = path.join(catDir, d);
        return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'i18n'));
    });
    
    for (const method of methods) {
        totalMethods++;
        const i18nDir = path.join(catDir, method, 'i18n');
        const methodId = `${cat}/${method}`;
        
        // Check all language files exist
        for (const lang of LANGS) {
            const filePath = path.join(i18nDir, `${lang}.json`);
            if (!fs.existsSync(filePath)) {
                addIssue(methodId, lang, 'MISSING_FILE', `${lang}.json does not exist`);
                continue;
            }
            totalFiles++;
            
            // Check JSON validity
            let data;
            try {
                const raw = fs.readFileSync(filePath, 'utf8');
                data = JSON.parse(raw);
            } catch (e) {
                addIssue(methodId, lang, 'JSON_PARSE_ERROR', e.message);
                continue;
            }
            
            // Check required keys
            for (const key of REQUIRED_KEYS) {
                if (!(key in data)) {
                    addIssue(methodId, lang, 'MISSING_KEY', `Missing key: ${key}`);
                }
            }
            
            // Check empty values
            for (const key of REQUIRED_KEYS) {
                if (key === 'references') continue; // references can be empty array
                if (key in data && (!data[key] || (typeof data[key] === 'string' && data[key].trim() === ''))) {
                    addIssue(methodId, lang, 'EMPTY_VALUE', `Empty value for: ${key}`);
                }
            }
            
            // Check for encoding corruption
            for (const key of REQUIRED_KEYS) {
                if (key === 'references') continue;
                if (data[key] && typeof data[key] === 'string' && hasEncodingIssues(data[key])) {
                    addIssue(methodId, lang, 'ENCODING', `Possible encoding corruption in: ${key}`);
                }
            }
            
            // Language-specific checks for non-EN files
            if (lang !== 'en') {
                // Check mechanism field - should not be English
                if (data.mechanism && typeof data.mechanism === 'string' && data.mechanism.length > 50) {
                    if (looksEnglish(data.mechanism)) {
                        addIssue(methodId, lang, 'UNTRANSLATED_MECHANISM', `mechanism appears to be English (${data.mechanism.substring(0, 60)}...)`);
                    }
                }
                
                // Check description field
                if (data.description && typeof data.description === 'string' && data.description.length > 50) {
                    if (looksEnglish(data.description)) {
                        addIssue(methodId, lang, 'UNTRANSLATED_DESCRIPTION', `description appears to be English (${data.description.substring(0, 60)}...)`);
                    }
                }
                
                // Check name field
                if (data.name && typeof data.name === 'string') {
                    if (lang === 'ja' && !hasJapanese(data.name) && data.name.length > 3 && !/^[A-Z]/.test(data.name)) {
                        // Some names are proper nouns/acronyms, skip those
                    }
                    if (lang === 'ko' && !hasKorean(data.name) && data.name.length > 5 && looksEnglish(data.name)) {
                        addIssue(methodId, lang, 'UNTRANSLATED_NAME', `name appears English: "${data.name}"`);
                    }
                    if (lang === 'zh' && !hasChinese(data.name) && data.name.length > 5 && looksEnglish(data.name)) {
                        addIssue(methodId, lang, 'UNTRANSLATED_NAME', `name appears English: "${data.name}"`);
                    }
                }
                
                // Check useCase field
                if (data.useCase && typeof data.useCase === 'string' && data.useCase.length > 50) {
                    if (looksEnglish(data.useCase)) {
                        addIssue(methodId, lang, 'UNTRANSLATED_USECASE', `useCase appears to be English (${data.useCase.substring(0, 60)}...)`);
                    }
                }

                // Check strengths field
                if (data.strengths && typeof data.strengths === 'string' && data.strengths.length > 50) {
                    if (looksEnglish(data.strengths)) {
                        addIssue(methodId, lang, 'UNTRANSLATED_STRENGTHS', `strengths appears to be English (${data.strengths.substring(0, 60)}...)`);
                    }
                }

                // Check limitations field
                if (data.limitations && typeof data.limitations === 'string' && data.limitations.length > 50) {
                    if (looksEnglish(data.limitations)) {
                        addIssue(methodId, lang, 'UNTRANSLATED_LIMITATIONS', `limitations appears to be English (${data.limitations.substring(0, 60)}...)`);
                    }
                }

                // Cross-language contamination check
                if (lang === 'es' && data.mechanism && hasJapanese(data.mechanism)) {
                    addIssue(methodId, lang, 'WRONG_LANGUAGE', 'ES mechanism contains Japanese characters');
                }
                if (lang === 'ja' && data.mechanism && hasKorean(data.mechanism)) {
                    addIssue(methodId, lang, 'WRONG_LANGUAGE', 'JA mechanism contains Korean characters');
                }
                if (lang === 'ko' && data.mechanism && hasJapanese(data.mechanism) && !hasChinese(data.mechanism)) {
                    addIssue(methodId, lang, 'WRONG_LANGUAGE', 'KO mechanism contains Japanese characters');
                }
            }
            
            // Check references is an array
            if ('references' in data && !Array.isArray(data.references)) {
                addIssue(methodId, lang, 'INVALID_REFERENCES', `references is not an array: ${typeof data.references}`);
            }
        }
    }
}

// Summary
console.log('=== I18N AUDIT REPORT ===');
console.log(`Methods scanned: ${totalMethods}`);
console.log(`Files scanned: ${totalFiles}`);
console.log(`Total issues: ${issues.length}`);
console.log('');

// Group by type
const byType = {};
for (const i of issues) {
    if (!byType[i.type]) byType[i.type] = [];
    byType[i.type].push(i);
}

for (const [type, items] of Object.entries(byType).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`\n--- ${type} (${items.length}) ---`);
    for (const item of items.slice(0, 30)) {
        console.log(`  ${item.method} [${item.lang}]: ${item.detail}`);
    }
    if (items.length > 30) {
        console.log(`  ... and ${items.length - 30} more`);
    }
}

// Count untranslated by lang
console.log('\n--- UNTRANSLATED SUMMARY BY LANG ---');
const untransByLang = {};
for (const i of issues) {
    if (i.type.startsWith('UNTRANSLATED_')) {
        if (!untransByLang[i.lang]) untransByLang[i.lang] = {};
        const field = i.type.replace('UNTRANSLATED_', '').toLowerCase();
        if (!untransByLang[i.lang][field]) untransByLang[i.lang][field] = 0;
        untransByLang[i.lang][field]++;
    }
}
for (const [lang, fields] of Object.entries(untransByLang)) {
    const parts = Object.entries(fields).map(([f, c]) => `${f}:${c}`).join(', ');
    console.log(`  ${lang}: ${parts}`);
}
