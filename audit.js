const fs = require('fs');
const path = require('path');

const methodsDir = path.join(__dirname, 'src', 'app', 'methods');
const categories = ['text', 'image', 'video'];

let issuesFound = [];

categories.forEach(category => {
    const catDir = path.join(methodsDir, category);
    if (!fs.existsSync(catDir)) return;
    
    const methods = fs.readdirSync(catDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('_'))
        .map(dirent => dirent.name);

    methods.forEach(method => {
        const enPath = path.join(catDir, method, 'i18n', 'en.json');
        if (fs.existsSync(enPath)) {
            try {
                const content = JSON.parse(fs.readFileSync(enPath, 'utf8'));
                let issues = [];
                
                // check placeholders in text
                const textStr = JSON.stringify(content).toLowerCase();
                if (textStr.includes('placeholder')) issues.push('contains_placeholder_text');
                
                // check algorithms/mechanism lengths
                if (!content.mechanism || content.mechanism.length < 50) issues.push('short_mechanism');
                if (!content.algorithm || content.algorithm.length < 5) issues.push('missing_algorithm');
                
                // check references
                if (content.references && content.references.length > 0) {
                    content.references.forEach((ref, idx) => {
                        if (!ref.url || ref.url === '' || ref.url.endsWith('/abs/')) {
                            issues.push(`bad_url_in_ref_${idx}`);
                        }
                    });
                } else {
                     if (!content.source) issues.push('missing_source_and_refs');
                }

                if (issues.length > 0) {
                    issuesFound.push({ category, method, issues });
                }
            } catch (e) {
                issuesFound.push({ category, method, issues: ['parse_error'] });
            }
        }
    });
});

fs.writeFileSync('C:\\Dev\\SourceVerify\\audit_results.json', JSON.stringify(issuesFound, null, 2));
console.log(`Found ${issuesFound.length} issues`);
