const fs = require('fs');
const path = require('path');

const dataTsPath = path.join(__dirname, '../src/app/methods/data.ts');
const dataTsContent = fs.readFileSync(dataTsPath, 'utf8');

const idRegex = /\{\s*id:\s*"([^"]+)"[^}]*mediaType:\s*"([^"]+)"[^}]*\}/g;
let match;
const methodsToVerify = [];
while ((match = idRegex.exec(dataTsContent)) !== null) {
    if (match[2] === "all" || match[2] === 'all') {
        methodsToVerify.push({ id: match[1], mediaType: "image" });
        methodsToVerify.push({ id: match[1], mediaType: "video" });
        methodsToVerify.push({ id: match[1], mediaType: "text" });
    } else {
        methodsToVerify.push({ id: match[1], mediaType: match[2] });
    }
}

let missingRefsCount = 0;
let emptyRefsCount = 0;
let invalidLinkCount = 0;
let notFoundCount = 0;
const invalidMethods = [];

methodsToVerify.forEach(m => {
    const enJsonPath = path.join(__dirname, `../src/app/methods/${m.mediaType}/${m.id}/i18n/en.json`);
    if (!fs.existsSync(enJsonPath)) {
        notFoundCount++;
        invalidMethods.push(`${m.id} (${m.mediaType}) - missing translation folder (implementation missing)`);
        return; 
    }

    try {
        const enContent = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
        if (!enContent.references) {
            missingRefsCount++;
            invalidMethods.push(`${m.id} (${m.mediaType}) - missing 'references' array`);
        } else if (!Array.isArray(enContent.references) || enContent.references.length === 0) {
            emptyRefsCount++;
            invalidMethods.push(`${m.id} (${m.mediaType}) - empty 'references' array`);
        } else {
            let hasInvalid = false;
            enContent.references.forEach((ref, index) => {
                if (!ref.url || !ref.title) {
                    hasInvalid = true;
                    invalidMethods.push(`${m.id} (${m.mediaType}) - reference ${index} missing title or url`);
                } else if (!ref.url.startsWith('http') && !ref.url.startsWith('#')) {
                    hasInvalid = true;
                    invalidMethods.push(`${m.id} (${m.mediaType}) - reference ${index} url does not start with http: ${ref.url}`);
                }
            });
            if (hasInvalid) invalidLinkCount++;
        }
    } catch(e) {
        console.error(`Failed to parse ${enJsonPath}: ${e.message}`);
    }
});

console.log(`Scan completed across ${methodsToVerify.length} method mappings.`);
console.log(`Methods completely missing (no folder): ${notFoundCount}`);
console.log(`Missing refs array in json: ${missingRefsCount}`);
console.log(`Empty refs array in json: ${emptyRefsCount}`);
console.log(`Invalid link format: ${invalidLinkCount}`);
console.log('--- INVALID METHODS LOG ---');
invalidMethods.forEach(str => console.log(str));
