/**
 * Fix missing 'details' field in method return objects
 * and fix weight values > 1.5
 */
const fs = require('fs');
const path = require('path');

const methodsRoot = path.join(__dirname, '..', 'src/lib/methods');
const mediaTypes = ['image', 'text', 'video'];

let detailsFixed = 0;
let weightsFixed = 0;

for (const mediaType of mediaTypes) {
    const mediaDir = path.join(methodsRoot, mediaType);
    if (!fs.existsSync(mediaDir)) continue;
    
    const files = fs.readdirSync(mediaDir).filter(f => f.endsWith('.ts'));
    
    for (const file of files) {
        const filePath = path.join(mediaDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Fix missing details field
        // Look for return { ... } that has description but no details
        if (!content.match(/\bdetails[\s]*[,:]/)) {
            // Insert details after description line in the return object
            // Try to find the pattern: description,\n  ... descriptionKey
            const descKeyMatch = content.match(/(descriptionKey[^,}]+,?)/);
            if (descKeyMatch) {
                // Check if details exists anywhere after descriptionKey
                const afterDescKey = content.indexOf(descKeyMatch[0]) + descKeyMatch[0].length;
                const restContent = content.substring(afterDescKey);
                
                if (!restContent.match(/\bdetails\s*[,:]/)) {
                    // Find the last field before the closing brace of the return
                    // Pattern: look for the last field before };
                    const returnMatch = content.match(/(\s+)(icon:\s*"[^"]*")(,?\s*\n\s*\};)/);
                    if (returnMatch) {
                        const indent = returnMatch[1];
                        content = content.replace(
                            returnMatch[0],
                            `${indent}${returnMatch[2]},\n${indent}details,\n    };`
                        );
                        modified = true;
                        detailsFixed++;
                        console.log(`Added details: ${mediaType}/${file}`);
                    } else {
                        // Try alternative pattern: icon field followed by details or }
                        const altMatch = content.match(/(icon:\s*"[^"]*")(,?\s*\n\s*\})/);
                        if (altMatch) {
                            content = content.replace(
                                altMatch[0],
                                `${altMatch[1]},\n        details,\n    }`
                            );
                            modified = true;
                            detailsFixed++;
                            console.log(`Added details (alt): ${mediaType}/${file}`);
                        }
                    }
                }
            }
        }
        
        // Fix weight > 1.5
        const weightMatch = content.match(/weight:\s*([0-9.]+)/);
        if (weightMatch) {
            const weight = parseFloat(weightMatch[1]);
            if (weight > 1.5) {
                content = content.replace(
                    /weight:\s*[0-9.]+/,
                    'weight: 1.5'
                );
                modified = true;
                weightsFixed++;
                console.log(`Fixed weight: ${mediaType}/${file}: ${weight} → 1.5`);
            }
        }
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
        }
    }
}

console.log(`\nTotal details field additions: ${detailsFixed}`);
console.log(`Total weight fixes: ${weightsFixed}`);
