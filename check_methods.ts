import fs from 'fs';
import path from 'path';

// Load all method IDs from data.ts
const dataTsPath = path.join(__dirname, 'src/app/methods/data.ts');
const dataTsContent = fs.readFileSync(dataTsPath, 'utf8');

const idRegex = /\{ id: "([^"]+)",/g;
let match;
const allMethodIds = new Set<string>();

while ((match = idRegex.exec(dataTsContent)) !== null) {
    allMethodIds.add(match[1]);
}

console.log(`Found ${allMethodIds.size} methods in data.ts`);

// Check methodsI18n.ts
const i18nPath = path.join(__dirname, 'src/lib/methodsI18n.ts');
const i18nContent = fs.readFileSync(i18nPath, 'utf8');

let missingInI18n = 0;
for (const id of allMethodIds) {
    if (!i18nContent.includes(`"${id}":`) && !i18nContent.includes(`'${id}':`)) {
        console.log(`Missing in methodsI18n.ts: ${id}`);
        missingInI18n++;
    }
}
console.log(`Total missing in methodsI18n: ${missingInI18n}`);

// Check analyzer.ts
const analyzerPath = path.join(__dirname, 'src/lib/analyzer.ts');
const analyzerContent = fs.readFileSync(analyzerPath, 'utf8');

let missingInAnalyzer = 0;
for (const id of allMethodIds) {
    // Usually mapped in METHOD_MAP or TEXT_METHOD_MAP or VIDEO_METHOD_MAP
    if (!analyzerContent.includes(`"${id}":`) && !analyzerContent.includes(`'${id}':`)) {
        console.log(`Missing in analyzer.ts mapping: ${id}`);
        missingInAnalyzer++;
    }
}
console.log(`Total missing in analyzer mapping: ${missingInAnalyzer}`);

console.log('Sanity check complete!');
