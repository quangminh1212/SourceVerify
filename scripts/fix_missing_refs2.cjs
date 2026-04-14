/**
 * Add missing references to translation files so they match en.json
 */
const fs = require('fs');
const path = require('path');

const METHODS_DIR = path.join(__dirname, '..', 'src', 'app', 'methods');
const TRANS_LANGS = ['es', 'ja', 'ko', 'zh'];

const fixes = [
    {
        method: 'image/iptc_verification',
        missingRef: {
            title: "ISO 12639:2004 — Graphic technology — Prepress digital data exchange (DigitalSourceType)",
            url: "https://www.iso.org/standard/34342.html"
        },
        insertAtIndex: 1
    },
    {
        method: 'image/resolution_consistency',
        missingRefs: [
            {
                title: "Podell, D. et al. (2023). SDXL: Improving Latent Diffusion Models for High-Resolution Image Synthesis.",
                url: "https://doi.org/10.48550/arXiv.2307.01952"
            },
            {
                title: "JEITA CP-3451C — Exif Standard Image Dimensions",
                url: "https://www.cipa.jp/std/documents/download_e.html?DC-008-Translation-2023-E"
            }
        ],
        insertAtIndex: 1
    },
    {
        method: 'image/software_fingerprint',
        missingRef: {
            title: "Yu, N. et al. (2019). Attributing Fake Images to GANs: Learning and Analyzing GAN Fingerprints. ICCV.",
            url: "https://doi.org/10.1109/ICCV.2019.00765"
        },
        insertAtIndex: 3
    },
    {
        method: 'image/timestamp_forensics',
        missingRef: {
            title: "Geradts, Z. & Bijhold, J. (2002). Content-Based Information Retrieval in Forensic Image Databases. Journal of Forensic Sciences.",
            url: "https://doi.org/10.1520/JFS15316J"
        },
        insertAtIndex: 2
    },
    {
        method: 'text/abstractness',
        missingRef: {
            title: "Bhatia, Bhatia, & Momennejad (2020). The abstract representations of LLMs vs Humans.",
            url: "https://arxiv.org/abs/2005.00000"
        },
        insertAtIndex: 1
    },
];

let totalFixed = 0;

for (const fix of fixes) {
    for (const lang of TRANS_LANGS) {
        const fp = path.join(METHODS_DIR, fix.method, 'i18n', `${lang}.json`);
        const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
        
        if (fix.missingRefs) {
            data.references.splice(fix.insertAtIndex, 0, ...fix.missingRefs);
        } else {
            data.references.splice(fix.insertAtIndex, 0, fix.missingRef);
        }
        
        fs.writeFileSync(fp, JSON.stringify(data, null, 4) + '\n', 'utf8');
        totalFixed++;
        console.log(`Fixed ${fix.method} [${lang}]: now ${data.references.length} refs`);
    }
}

console.log(`\nTotal files fixed: ${totalFixed}`);
