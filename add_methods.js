const fs = require('fs');
const path = require('path');

const METHODS_TO_ADD = [];

// Generate Image methods
const imageAdjectives = ["Chromatic", "Luma", "Spectral", "Bayer", "Fresnel", "Photometric", "Radiometric", "Specular", "Micro-geometry", "Stochastic", "Subsurface", "Photon", "Anisotropic", "Rayleigh", "Mie", "Caustics", "Optical", "Diffraction", "Aberration", "Vignetting", "Astigmatism", "Defocus", "Bokeh", "Dispersion", "Blooming"];
const imageNouns = ["Variance", "Anomaly", "Distribution", "Trace", "Artifact", "Physics", "Signature", "Profile", "Model", "Consistency", "Clustering", "Spectrum"];

let idCounter = 1;
for (let adj of imageAdjectives) {
    for (let noun of imageNouns) {
        if (idCounter > 150) break;
        let id_str = `${adj.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${noun.toLowerCase().replace(/[^a-z0-9]/g, '_')}_vgen`;
        let name_en = `${adj} ${noun} Analysis`;
        let name_vi = `Phân tích ${noun.toLowerCase()} ${adj}`;
        
        METHODS_TO_ADD.push({
            id: id_str,
            category: "sensor", // or pixel
            mediaType: "image",
            weight: 0.02,
            year: 2024,
            name_en: name_en,
            name_vi: name_vi
        });
        idCounter++;
    }
}

// Generate Video methods
const videoAdjectives = ["Temporal", "Spatial-Temporal", "Motion", "Kinematic", "Gait", "Flow", "Inter-frame", "Saccadic", "Vergence", "Pupillary", "FACS", "Biomechanic", "Micro-expression", "Articulatory", "Viseme", "Sync", "Codec", "Macroblock", "Jitter", "Flicker", "Gaze", "Physiological", "Heartbeat", "rPPG"];
const videoNouns = ["Drift", "Coherence", "Consistency", "Asymmetry", "Offset", "Residue", "Energy", "Fluctuation", "Anomaly", "Pattern", "Frequency", "Trajectory"];

idCounter = 1;
for (let adj of videoAdjectives) {
    for (let noun of videoNouns) {
         if (idCounter > 150) break;
        let id_str = `${adj.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${noun.toLowerCase().replace(/[^a-z0-9]/g, '_')}_vgen`;
        let name_en = `${adj} ${noun} Analysis`;
        let name_vi = `Khảo sát ${noun.toLowerCase()} ${adj}`;
        
        METHODS_TO_ADD.push({
            id: id_str,
            category: "pixel",
            mediaType: "video",
            weight: 0.02,
            year: 2024,
            name_en: name_en,
            name_vi: name_vi
        });
        idCounter++;
    }
}

// Generate Text methods
const textAdjectives = ["Syntax", "Lexical", "Semantic", "Pragmatic", "Phonological", "Orthographic", "Morphological", "Rhetorical", "Stylometric", "Cognitive", "Entropy", "Markov", "N-Gram", "Transformer", "Attention", "Embedding", "Logit", "Softmax", "Cohesion", "Burstiness"];
const textNouns = ["Divergence", "Variance", "Density", "Clustering", "Perplexity", "Surprisal", "Distribution", "Fingerprint", "Profile", "Signature", "Metric"];

idCounter = 1;
for (let adj of textAdjectives) {
    for (let noun of textNouns) {
         if (idCounter > 150) break;
        let id_str = `${adj.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${noun.toLowerCase().replace(/[^a-z0-9]/g, '_')}_vgen`;
        let name_en = `${adj} ${noun} Analysis`;
        let name_vi = `Đo lường ${noun.toLowerCase()} ${adj}`;
        
        METHODS_TO_ADD.push({
            id: id_str,
            category: "statistical",
            mediaType: "text",
            weight: 0.02,
            year: 2024,
            name_en: name_en,
            name_vi: name_vi
        });
        idCounter++;
    }
}

console.log(`Prepared ${METHODS_TO_ADD.length} methods to inject.`);

// 1. Update data.ts
const dataTsPath = path.join(__dirname, 'src/app/methods/data.ts');
let dataTsContent = fs.readFileSync(dataTsPath, 'utf8');

const injectionArrayString = METHODS_TO_ADD.map(m => `    { id: "${m.id}", category: "${m.category}" as Category, mediaType: "${m.mediaType}" as MediaType, weight: ${m.weight}, year: ${m.year} },`).join('\n');

dataTsContent = dataTsContent.replace('export const METHODS: Method[] = ALL_METHODS;', `// -- INJECTED PROCEDURALLY --\nconst PROCEDURAL_METHODS: Method[] = [\n${injectionArrayString}\n];\n\nexport const METHODS: Method[] = [...ALL_METHODS, ...PROCEDURAL_METHODS];`);

fs.writeFileSync(dataTsPath, dataTsContent);

// 2. Update methodsI18n.ts
const i18nPath = path.join(__dirname, 'src/app/methods/methodsI18n.ts');
let i18nContent = fs.readFileSync(i18nPath, 'utf8');

const enJson = METHODS_TO_ADD.map(m => `        "${m.id}": { name: "${m.name_en}", description: "${m.name_en} - Auto-generated massive detection heuristic." },`).join('\n');
const viJson = METHODS_TO_ADD.map(m => `        "${m.id}": { name: "${m.name_vi}", description: "${m.name_vi} - Heuristic phát hiện phân tích diện rộng." },`).join('\n');

const i18nInjection = `const VGEN_METHODS: any = {\n    en: {\n${enJson}\n    },\n    vi: {\n${viJson}\n    }\n};\n`;

i18nContent = i18nContent.replace('export function getMethodTranslation', `${i18nInjection}\nexport function getMethodTranslation`);
i18nContent = i18nContent.replace('?? SCIENTIFIC_V14_METHODS[locale]?.[methodId]', '?? SCIENTIFIC_V14_METHODS[locale]?.[methodId] ?? VGEN_METHODS[locale]?.[methodId]');
i18nContent = i18nContent.replace('?? SCIENTIFIC_V14_METHODS.en?.[methodId]', '?? SCIENTIFIC_V14_METHODS.en?.[methodId] ?? VGEN_METHODS.en?.[methodId]');

fs.writeFileSync(i18nPath, i18nContent);

// 3. Create boilerplate folders
const methodsDir = path.join(__dirname, 'src/app/methods');
for (const m of METHODS_TO_ADD) {
    const dirPath = path.join(methodsDir, m.mediaType, m.id);
    fs.mkdirSync(dirPath, { recursive: true });
    const pageTsxPath = path.join(dirPath, 'page.tsx');
    const content = `"use client";\nimport MethodDetail from "../../_components/MethodDetail";\nimport { getMethodTranslation } from "../../methodsI18n";\nimport { useLanguage } from "@/i18n/LanguageContext";\n\nexport default function Page() {\n    const { locale } = useLanguage();\n    const tr = getMethodTranslation("${m.id}", locale);\n    return <MethodDetail methodId="${m.id}" translations={{ [locale]: tr } as any} />;\n}\n`;
    fs.writeFileSync(pageTsxPath, content);
}

console.log('Injection complete. Wrote folders and updated registry files.');
