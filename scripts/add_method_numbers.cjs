/**
 * Script: Đánh số (index) cho tất cả method trong data.ts
 * Image: I-001..I-186, Video: V-001..V-165, Text: T-001..T-149
 * Chạy: node scripts/add_method_numbers.cjs
 */
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "src", "app", "methods", "data.ts");

let content = fs.readFileSync(DATA_FILE, "utf8");

// Add `index` to Method interface if missing
if (!content.includes("index?:")) {
    content = content.replace(
        /export interface Method \{([^}]+)\}/,
        (match, body) => {
            return `export interface Method {${body}    index?: string;\n}`;
        }
    );
}

// Parse all method lines and add index
const methodLineRegex = /^(\s*\{\s*id:\s*["'])([^"']+)(["'].*?mediaType:\s*["'])([^"']+)(["'].*?)(,\s*year:\s*\d+)?\s*\},?\s*$/gm;

const counters = { image: 0, video: 0, text: 0 };
const prefixes = { image: "I", video: "V", text: "T" };

// First pass: count to verify
let match;
const entries = [];
const tempRegex = /\{\s*id:\s*["']([^"']+)["'].*?mediaType:\s*["']([^"']+)["']/g;
while ((match = tempRegex.exec(content)) !== null) {
    entries.push({ id: match[1], mediaType: match[2] });
}
console.log(`Total entries: ${entries.length}`);

// Group by media type and assign numbers
const imageEntries = entries.filter(e => e.mediaType === "image");
const videoEntries = entries.filter(e => e.mediaType === "video");
const textEntries = entries.filter(e => e.mediaType === "text");
console.log(`Image: ${imageEntries.length}, Video: ${videoEntries.length}, Text: ${textEntries.length}`);

// Build index map: id -> "I-001" etc.
const indexMap = {};
imageEntries.forEach((e, i) => { indexMap[e.id] = `I-${String(i + 1).padStart(3, "0")}`; });
videoEntries.forEach((e, i) => { indexMap[e.id] = `V-${String(i + 1).padStart(3, "0")}`; });
textEntries.forEach((e, i) => { indexMap[e.id] = `T-${String(i + 1).padStart(3, "0")}`; });

// Now add index field to each line
// We need to be precise - replace each method entry line by line
const lines = content.split("\n");
const newLines = [];

for (const line of lines) {
    // Match method entry line
    const m = line.match(/^(\s*\{\s*id:\s*["'])([^"']+)(["'].+?)(\s*\},?\s*)$/);
    if (m && indexMap[m[2]]) {
        const id = m[2];
        const idx = indexMap[id];
        // Check if already has index
        if (line.includes("index:")) {
            // Update existing index
            newLines.push(line.replace(/index:\s*["'][^"']*["']/, `index: "${idx}"`));
        } else {
            // Add index before closing brace
            // Find the last field and add index after it
            const insertPoint = line.lastIndexOf("}");
            const beforeBrace = line.substring(0, insertPoint).trimEnd();
            const afterBrace = line.substring(insertPoint);
            // Add comma if needed
            const needComma = !beforeBrace.endsWith(",");
            newLines.push(`${beforeBrace}${needComma ? "," : ""} index: "${idx}"${afterBrace}`);
        }
    } else {
        newLines.push(line);
    }
}

const newContent = newLines.join("\n");
fs.writeFileSync(DATA_FILE, newContent, "utf8");

console.log("\nIndex assignment summary:");
console.log(`  Image: I-001 to I-${String(imageEntries.length).padStart(3, "0")}`);
console.log(`  Video: V-001 to V-${String(videoEntries.length).padStart(3, "0")}`);
console.log(`  Text:  T-001 to T-${String(textEntries.length).padStart(3, "0")}`);

// Write index map to a file for reference
const mapLines = [];
mapLines.push("# SourceVerify Method Index\n");
mapLines.push("## Image Methods\n");
imageEntries.forEach((e, i) => mapLines.push(`| ${indexMap[e.id]} | ${e.id} |`));
mapLines.push("\n## Video Methods\n");
videoEntries.forEach((e, i) => mapLines.push(`| ${indexMap[e.id]} | ${e.id} |`));
mapLines.push("\n## Text Methods\n");
textEntries.forEach((e, i) => mapLines.push(`| ${indexMap[e.id]} | ${e.id} |`));

fs.writeFileSync(path.join(__dirname, "..", "docs", "METHOD_INDEX.md"), mapLines.join("\n"), "utf8");
console.log("\nMethod index written to docs/METHOD_INDEX.md");
console.log("Done!");
