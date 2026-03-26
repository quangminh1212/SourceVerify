import fs from 'fs';
import path from 'path';

const methodsDir = path.join(process.cwd(), 'src', 'lib', 'methods');
const categories = ['image', 'video', 'text'];

let totalMethods = 0;
const missingCitations: string[] = [];
const missingTheory: string[] = [];

categories.forEach(cat => {
    const dir = path.join(methodsDir, cat);
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
    
    files.forEach(file => {
        totalMethods++;
        const content = fs.readFileSync(path.join(dir, file), 'utf-8');
        
        // Extract top block comment
        const match = content.match(/\/\*\*([\s\S]*?)\*\//);
        if (!match) {
            missingTheory.push(`${cat}/${file} (No JSDoc)`);
            missingCitations.push(`${cat}/${file} (No JSDoc)`);
            return;
        }

        const jsdoc = match[1].toLowerCase();
        
        // Simple heuristic for citations
        const hasCitation = jsdoc.includes('based on') || 
                            jsdoc.includes('arxiv') || 
                            /(cvpr|iccv|eccv|neurips|icml|ieee|siggraph|202\d|201\d|paper|journal)/.test(jsdoc);
                            
        // Simple heuristic for theory
        // We assume any text that explains something, maybe more than 3 lines of comments, is theory
        const lines = jsdoc.split('\n').map(l => l.trim().replace(/^\*\s*/, '')).filter(l => l.length > 0);
        const hasTheory = lines.length >= 2; // Arbitrary, but usually methods have a description

        if (!hasCitation) {
            missingCitations.push(`${cat}/${file}`);
        }
        if (!hasTheory) {
            missingTheory.push(`${cat}/${file}`);
        }
    });
});

console.log(`Checked ${totalMethods} methods.`);
console.log(`\nMethods missing citations or explicit literature references (${missingCitations.length}):`);
console.log(missingCitations.slice(0, 30).join('\n'));
if(missingCitations.length > 30) {
    console.log(`... and ${missingCitations.length - 30} more.`);
}

console.log(`\nMethods missing theoretical description (${missingTheory.length}):`);
console.log(missingTheory.slice(0, 30).join('\n'));
if(missingTheory.length > 30) {
    console.log(`... and ${missingTheory.length - 30} more.`);
}
