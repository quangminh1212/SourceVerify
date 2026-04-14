/**
 * Audit script: Kiểm tra văn phong và chất lượng nội dung của tất cả methods
 * 
 * Tiêu chí đánh giá:
 * 1. Generic/Template content (nội dung mẫu chung chung)
 * 2. Fake DOIs (DOI giả với pattern 0000001)
 * 3. Missing fields (thiếu trường)
 * 4. Shallow references (ít hoặc không có tham chiếu thực)
 * 5. Template phrases (cụm từ mẫu)
 * 6. Vague parameters (tham số không cụ thể)
 * 7. Missing author names in references
 * 8. Consistency across languages
 */

const fs = require('fs');
const path = require('path');

const METHODS_DIR = path.join(__dirname, '..', 'src', 'app', 'methods');
const CATEGORIES = ['image', 'video', 'text'];
const LANGUAGES = ['en', 'vi', 'zh', 'ja', 'ko', 'es'];

// Template/generic phrases that indicate low quality
const TEMPLATE_PHRASES_EN = [
  'This method applies',
  'for digital forensics and AI-generated content detection',
  'preprocessed and relevant features are extracted',
  'domain-specific techniques aligned with',
  'statistical models derived from authentic content databases',
  'Deviations from expected distributions indicate',
  'A normalized anomaly score (0–100) is computed',
  'Cross-validation: Results are cross-validated with complementary detection methods',
  'Based on peer-reviewed research in digital forensics',
  'Used as part of multi-signal analysis pipeline',
  'Research-backed methodology',
  'Complementary to other detection methods',
  'Works across different AI generators',
  'Accuracy varies with input quality',
  'Best used in combination with other methods',
  'May require calibration for new AI models',
  'Analysis type: automated statistical',
  'Minimum input size: varies by media type',
  'Moderate to High — 70-85% accuracy depending on input quality and method combination',
];

// Fake DOI patterns
const FAKE_DOI_PATTERNS = [
  /10\.1109\/TIFS\.\d{4}\.0+\d{1}$/,
  /10\.1109\/.*\.0{4,}/,
  /doi\.org\/10\.\d+\/placeholder/i,
  /doi\.org\/10\.\d+\/example/i,
];

// Generic reference titles
const GENERIC_REF_TITLES = [
  /reference study$/i,
  /^[\w\s]+ — reference study$/i,
  /generic.*reference/i,
];

const REQUIRED_FIELDS = ['name', 'description', 'algorithm', 'mechanism', 'parameters', 'accuracy', 'source', 'useCase', 'strengths', 'limitations', 'references'];

function analyzeMethod(category, methodId) {
  const i18nDir = path.join(METHODS_DIR, category, methodId, 'i18n');
  if (!fs.existsSync(i18nDir)) return null;

  const issues = [];
  const scores = {};
  let hasEn = false;

  for (const lang of LANGUAGES) {
    const filePath = path.join(i18nDir, `${lang}.json`);
    if (!fs.existsSync(filePath)) {
      issues.push({ severity: 'error', field: 'i18n', message: `Missing ${lang}.json` });
      continue;
    }

    let data;
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      data = JSON.parse(raw);
    } catch (e) {
      issues.push({ severity: 'error', field: 'i18n', message: `Invalid JSON in ${lang}.json: ${e.message}` });
      continue;
    }

    if (lang === 'en') {
      hasEn = true;
      // Check required fields
      for (const field of REQUIRED_FIELDS) {
        if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
          issues.push({ severity: 'error', field, message: `Missing or empty field: ${field}` });
        }
      }

      // Check template/generic phrases in mechanism
      let templateCount = 0;
      const fullText = JSON.stringify(data);
      for (const phrase of TEMPLATE_PHRASES_EN) {
        if (fullText.includes(phrase)) {
          templateCount++;
        }
      }
      if (templateCount >= 3) {
        issues.push({ severity: 'critical', field: 'mechanism', message: `Generic template content detected (${templateCount} template phrases found)` });
      } else if (templateCount >= 1) {
        issues.push({ severity: 'warning', field: 'mechanism', message: `Some template phrases detected (${templateCount})` });
      }

      // Check references
      if (Array.isArray(data.references)) {
        if (data.references.length === 0) {
          issues.push({ severity: 'error', field: 'references', message: 'No references provided' });
        } else if (data.references.length === 1) {
          issues.push({ severity: 'warning', field: 'references', message: 'Only 1 reference (recommend 2-4)' });
        }

        for (const ref of data.references) {
          // Check fake DOIs
          if (ref.url) {
            for (const pattern of FAKE_DOI_PATTERNS) {
              if (pattern.test(ref.url)) {
                issues.push({ severity: 'critical', field: 'references', message: `Fake/placeholder DOI detected: ${ref.url}` });
              }
            }
            // Check Google Scholar links (weak)
            if (ref.url.includes('scholar.google.com')) {
              issues.push({ severity: 'warning', field: 'references', message: `Google Scholar search link instead of direct paper: ${ref.url}` });
            }
          }
          // Check generic ref titles
          if (ref.title) {
            for (const pattern of GENERIC_REF_TITLES) {
              if (pattern.test(ref.title)) {
                issues.push({ severity: 'critical', field: 'references', message: `Generic reference title: "${ref.title}"` });
              }
            }
            // Check missing author names
            if (!/\b[A-Z][a-z]+,?\s+[A-Z]\./.test(ref.title) && !/et al\./.test(ref.title)) {
              issues.push({ severity: 'warning', field: 'references', message: `No author citation in reference: "${ref.title.substring(0, 60)}..."` });
            }
          }
        }
      } else {
        issues.push({ severity: 'error', field: 'references', message: 'References not an array' });
      }

      // Check description quality
      if (data.description && data.description.length < 50) {
        issues.push({ severity: 'warning', field: 'description', message: `Description too short (${data.description.length} chars)` });
      }

      // Check mechanism quality
      if (data.mechanism && data.mechanism.length < 100) {
        issues.push({ severity: 'warning', field: 'mechanism', message: `Mechanism description too short (${data.mechanism.length} chars)` });
      }

      // Check vague parameters
      if (data.parameters) {
        const vagueParams = [
          'varies by media type',
          'automated statistical',
          'default settings',
        ];
        for (const vp of vagueParams) {
          if (data.parameters.includes(vp)) {
            issues.push({ severity: 'warning', field: 'parameters', message: `Vague parameter: "${vp}"` });
          }
        }
      }

      // Check source quality
      if (data.source && /^Based on peer-reviewed research/i.test(data.source)) {
        issues.push({ severity: 'critical', field: 'source', message: 'Generic source attribution (no specific paper/author cited)' });
      }

      // Check strengths/limitations format
      if (data.strengths && typeof data.strengths === 'string') {
        const bulletCount = (data.strengths.match(/[•\-\*]/g) || []).length;
        if (bulletCount < 2) {
          issues.push({ severity: 'warning', field: 'strengths', message: 'Strengths should list multiple bullet points' });
        }
      }
      if (data.limitations && typeof data.limitations === 'string') {
        const bulletCount = (data.limitations.match(/[•\-\*]/g) || []).length;
        if (bulletCount < 2) {
          issues.push({ severity: 'warning', field: 'limitations', message: 'Limitations should list multiple bullet points' });
        }
      }

      // Score calculation
      let score = 100;
      for (const issue of issues) {
        if (issue.severity === 'critical') score -= 25;
        else if (issue.severity === 'error') score -= 15;
        else if (issue.severity === 'warning') score -= 5;
      }
      scores.en = Math.max(0, score);
    }
  }

  return {
    category,
    methodId,
    issues,
    score: scores.en || 0,
    hasEn,
  };
}

function main() {
  const allResults = [];

  for (const category of CATEGORIES) {
    const catDir = path.join(METHODS_DIR, category);
    if (!fs.existsSync(catDir)) continue;

    const methods = fs.readdirSync(catDir).filter(f => {
      return fs.statSync(path.join(catDir, f)).isDirectory();
    });

    for (const methodId of methods) {
      const result = analyzeMethod(category, methodId);
      if (result) {
        allResults.push(result);
      }
    }
  }

  // Sort by score (worst first)
  allResults.sort((a, b) => a.score - b.score);

  // Summary
  const critical = allResults.filter(r => r.issues.some(i => i.severity === 'critical'));
  const errors = allResults.filter(r => r.issues.some(i => i.severity === 'error') && !r.issues.some(i => i.severity === 'critical'));
  const warnings = allResults.filter(r => r.issues.length > 0 && !r.issues.some(i => i.severity === 'error') && !r.issues.some(i => i.severity === 'critical'));
  const clean = allResults.filter(r => r.issues.length === 0);

  console.log('='.repeat(80));
  console.log('AUDIT VĂN PHONG - SOURCE VERIFY METHODS');
  console.log('='.repeat(80));
  console.log(`Tổng số methods: ${allResults.length}`);
  console.log(`  CRITICAL (nội dung template/DOI giả): ${critical.length}`);
  console.log(`  ERROR (thiếu trường/lỗi JSON): ${errors.length}`);
  console.log(`  WARNING (cần cải thiện): ${warnings.length}`);
  console.log(`  CLEAN (đạt chất lượng): ${clean.length}`);
  console.log();

  // Score distribution
  const tiers = {
    'Excellent (90-100)': allResults.filter(r => r.score >= 90).length,
    'Good (70-89)': allResults.filter(r => r.score >= 70 && r.score < 90).length,
    'Fair (50-69)': allResults.filter(r => r.score >= 50 && r.score < 70).length,
    'Poor (25-49)': allResults.filter(r => r.score >= 25 && r.score < 50).length,
    'Critical (0-24)': allResults.filter(r => r.score < 25).length,
  };
  console.log('PHÂN BỐ ĐIỂM:');
  for (const [tier, count] of Object.entries(tiers)) {
    const bar = '█'.repeat(Math.ceil(count / 2));
    console.log(`  ${tier.padEnd(22)} ${String(count).padStart(4)} ${bar}`);
  }
  console.log();

  // By category
  for (const category of CATEGORIES) {
    const catResults = allResults.filter(r => r.category === category);
    const avgScore = catResults.length > 0 ? Math.round(catResults.reduce((s, r) => s + r.score, 0) / catResults.length) : 0;
    console.log(`${category.toUpperCase()}: ${catResults.length} methods, avg score: ${avgScore}`);
  }
  console.log();

  // Print critical issues
  if (critical.length > 0) {
    console.log('='.repeat(80));
    console.log('CRITICAL ISSUES (phải sửa ngay):');
    console.log('='.repeat(80));
    for (const r of critical) {
      console.log(`\n[${r.category}/${r.methodId}] Score: ${r.score}`);
      for (const i of r.issues.filter(i => i.severity === 'critical')) {
        console.log(`  ❌ ${i.field}: ${i.message}`);
      }
    }
    console.log();
  }

  // Print errors
  if (errors.length > 0) {
    console.log('='.repeat(80));
    console.log('ERRORS (cần sửa):');
    console.log('='.repeat(80));
    for (const r of errors) {
      console.log(`\n[${r.category}/${r.methodId}] Score: ${r.score}`);
      for (const i of r.issues.filter(i => i.severity === 'error')) {
        console.log(`  ⚠️ ${i.field}: ${i.message}`);
      }
    }
    console.log();
  }

  // Print all methods sorted by score (worst first), the worst 50
  console.log('='.repeat(80));
  console.log('50 METHODS VĂN PHONG KÉM NHẤT:');
  console.log('='.repeat(80));
  const worst50 = allResults.slice(0, 50);
  for (const r of worst50) {
    const criticalIssues = r.issues.filter(i => i.severity === 'critical').length;
    const errorIssues = r.issues.filter(i => i.severity === 'error').length;
    const warnIssues = r.issues.filter(i => i.severity === 'warning').length;
    console.log(`  ${String(r.score).padStart(3)} | ${r.category.padEnd(6)} | ${r.methodId.padEnd(35)} | C:${criticalIssues} E:${errorIssues} W:${warnIssues}`);
  }
  console.log();

  // Print best methods
  console.log('='.repeat(80));
  console.log('TOP 20 METHODS VĂN PHONG TỐT NHẤT:');
  console.log('='.repeat(80));
  const best20 = allResults.slice(-20).reverse();
  for (const r of best20) {
    console.log(`  ${String(r.score).padStart(3)} | ${r.category.padEnd(6)} | ${r.methodId}`);
  }

  // Write detailed report
  const reportPath = path.join(__dirname, '..', 'audit_van_phong_report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    summary: {
      total: allResults.length,
      critical: critical.length,
      errors: errors.length,
      warnings: warnings.length,
      clean: clean.length,
      tiers,
    },
    criticalMethods: critical.map(r => ({
      path: `${r.category}/${r.methodId}`,
      score: r.score,
      issues: r.issues.filter(i => i.severity === 'critical'),
    })),
    allResults: allResults.map(r => ({
      path: `${r.category}/${r.methodId}`,
      score: r.score,
      issueCount: r.issues.length,
      criticals: r.issues.filter(i => i.severity === 'critical').length,
    })),
  }, null, 2));
  console.log(`\nDetailed report saved to: audit_van_phong_report.json`);
}

main();
