const fs = require('fs');
const path = require('path');

// Load all method IDs from data.ts
const dataTsPath = path.join(__dirname, 'src/app/methods/data.ts');
const dataTsContent = fs.readFileSync(dataTsPath, 'utf8');

const idRegex = /\{ id: "([^"]+)",/g;
let match;
const allMethodIds = new Set();
while ((match = idRegex.exec(dataTsContent)) !== null) {
    allMethodIds.add(match[1]);
}

console.log(`Found ${allMethodIds.size} methods in data.ts`);

// Check analyzer.ts
const analyzerPath = path.join(__dirname, 'src/lib/analyzer.ts');
const analyzerContent = fs.readFileSync(analyzerPath, 'utf8');

// Parse mappings from analyzer.ts
const mapRegex = /["']?([^: \n\t"']+)["']?:\s*["'](signal\.[^"']+)["']/g;
const methodToSignal = new Map();
while ((match = mapRegex.exec(analyzerContent)) !== null) {
    methodToSignal.set(match[1], match[2]);
}

let missingInAnalyzer = 0;
const validSignalKeys = new Set();
for (const id of allMethodIds) {
    if (!methodToSignal.has(id)) {
        console.log(`Missing mapped id in analyzer.ts: ${id}`);
        missingInAnalyzer++;
    } else {
        validSignalKeys.add(methodToSignal.get(id));
    }
}
console.log(`Total missing in analyzer mapping: ${missingInAnalyzer}`);

// Check methodsI18n.ts
const i18nPath = path.join(__dirname, 'src/lib/methodsI18n.ts');
const i18nContent = fs.readFileSync(i18nPath, 'utf8');

let missingInI18n = 0;
for (const signalKey of validSignalKeys) {
    if (!i18nContent.includes(`"${signalKey}":`) && !i18nContent.includes(`'${signalKey}':`)) {
        console.log(`Missing signal key in methodsI18n.ts: ${signalKey}`);
        missingInI18n++;
    }
}
console.log(`Total missing signal keys in methodsI18n: ${missingInI18n}`);

console.log('Sanity check complete!');
