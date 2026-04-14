const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'src', 'app', 'methods');

const cases = [
    ['image/clip_detection', 'ko', 'limitations'],
    ['image/curvelet_transform', 'ja', 'description'],
    ['image/curvelet_transform', 'ko', 'description'],
    ['image/curvelet_transform', 'zh', 'description'],
    ['image/gradient', 'zh', 'strengths'],
    ['image/moire_pattern', 'ja', 'name'],
    ['image/moire_pattern', 'ja', 'description'],
    ['image/moire_pattern', 'ja', 'mechanism'],
    ['image/moire_pattern', 'ja', 'useCase'],
    ['image/moire_pattern', 'ko', 'name'],
    ['image/moire_pattern', 'ko', 'description'],
    ['image/moire_pattern', 'ko', 'mechanism'],
    ['image/moire_pattern', 'ko', 'useCase'],
    ['image/moire_pattern', 'zh', 'name'],
    ['image/moire_pattern', 'zh', 'description'],
    ['image/moire_pattern', 'zh', 'mechanism'],
    ['image/moire_pattern', 'zh', 'useCase'],
    ['text/analogy_simile', 'ko', 'parameters'],
    ['text/analogy_simile', 'zh', 'parameters'],
    ['text/coreference_chain', 'ko', 'strengths'],
    ['text/emphasis_pattern', 'zh', 'strengths'],
    ['text/idiom_detection', 'ko', 'mechanism'],
    ['text/number_usage', 'ko', 'mechanism'],
    ['text/repetitive_phrase', 'ko', 'mechanism'],
    ['text/instructional_tone', 'ko', 'limitations'],
    ['text/register_variation', 'ko', 'description'],
];

for (const [method, lang, field] of cases) {
    const fp = path.join(dir, method, 'i18n', `${lang}.json`);
    const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
    const text = data[field] || '';
    // Find the specific Vietnamese characters
    const viMatches = text.match(/[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/gi);
    const jaKana = text.match(/[\u3040-\u309f\u30a0-\u30ff]/g);
    
    let issue = '';
    if (viMatches) {
        // Check if it's just accent in a technical word like "moiré" 
        const viContext = [];
        for (const ch of new Set(viMatches)) {
            const idx = text.indexOf(ch);
            viContext.push(`'${ch}' in "...${text.substring(Math.max(0,idx-10), idx+15)}..."`);
        }
        issue = `VI: ${viContext.join('; ')}`;
    }
    if (jaKana) {
        const jaContext = [];
        for (const ch of new Set(jaKana)) {
            const idx = text.indexOf(ch);
            jaContext.push(`'${ch}' in "...${text.substring(Math.max(0,idx-10), idx+15)}..."`);
        }    
        issue = `JA: ${jaContext.join('; ')}`;
    }
    console.log(`${method} [${lang}].${field}: ${issue}`);
}
