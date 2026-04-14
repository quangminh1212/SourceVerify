const fs = require("fs");
const path = require("path");
const b = "src/app/methods";
let i = 0, v = 0, t = 0;
for (const d of fs.readdirSync(path.join(b, "image")))
  if (fs.statSync(path.join(b, "image", d)).isDirectory() && d !== "_components") i++;
for (const d of fs.readdirSync(path.join(b, "video")))
  if (fs.statSync(path.join(b, "video", d)).isDirectory() && d !== "_components") v++;
for (const d of fs.readdirSync(path.join(b, "text")))
  if (fs.statSync(path.join(b, "text", d)).isDirectory() && d !== "_components") t++;
console.log("Image dirs:", i);
console.log("Video dirs:", v);
console.log("Text dirs:", t);
console.log("Total dirs:", i + v + t);
const dt = fs.readFileSync(path.join(b, "data.ts"), "utf8");
const entries = (dt.match(/ id: "/g) || []).length;
console.log("data.ts entries:", entries);
const mi = fs.readFileSync(path.join(b, "methodsI18n.ts"), "utf8");
console.log("METHODS_1000 exists:", mi.includes("METHODS_1000"));
console.log("Chain updated:", mi.includes("METHODS_1000[locale]"));
