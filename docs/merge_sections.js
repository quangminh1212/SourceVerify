const fs = require('fs');
const path = require('path');

// Đường dẫn
const DOCS_DIR = __dirname;
const REPORT_FILE = path.join(DOCS_DIR, 'Report_Overleaf.tex');
const SECTIONS_DIR = path.join(DOCS_DIR, 'sections');

// Thứ tự các file sections
const SECTIONS_ORDER = [
  '00-preface.tex',
  '01-summary.tex',
  '02-introduction.tex',
  '03-theory.tex',
  '04-system-design.tex',
  '05-implementation-results.tex',
  '06-conclusion.tex',
  '07-references.tex'
];

function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.log(`Warning: File ${filePath} không tồn tại`);
    return '';
  }
}

function mergeSections() {
  console.log('Bắt đầu gộp sections vào Report_Overleaf.tex...');
  console.log(`DOCS_DIR: ${DOCS_DIR}`);
  console.log(`REPORT_FILE: ${REPORT_FILE}`);
  console.log(`SECTIONS_DIR: ${SECTIONS_DIR}`);

  // Đọc phần preamble của Report_Overleaf.tex (từ đầu đến \begin{document})
  let preamble = '';
  const sectionsContent = [];

  // Đọc nội dung hiện tại của Report_Overleaf.tex
  const reportContent = readFileContent(REPORT_FILE);

  // Tìm phần preamble (trước \begin{document})
  if (reportContent) {
    const beginDocIdx = reportContent.indexOf('\\begin{document}');
    if (beginDocIdx !== -1) {
      preamble = reportContent.substring(0, beginDocIdx);
    }
  }

  // Đọc từng section theo thứ tự
  for (const sectionFile of SECTIONS_ORDER) {
    const sectionPath = path.join(SECTIONS_DIR, sectionFile);
    const content = readFileContent(sectionPath);
    if (content) {
      // Thêm comment để đánh dấu section
      sectionsContent.push(`% === ${sectionFile} ===\n`);
      sectionsContent.push(content);
      sectionsContent.push('\n\n');
      console.log(`✓ Đã gộp ${sectionFile}`);
    } else {
      console.log(`✗ Bỏ qua ${sectionFile} (không có nội dung)`);
    }
  }

  // Gộp tất cả lại
  const mergedContent = preamble + '\\begin{document}\n';
  mergedContent += '\\pagenumbering{gobble}\n\n';
  mergedContent += sectionsContent.join('');
  mergedContent += '\\end{document}\n';

  // Ghi vào Report_Overleaf.tex
  try {
    fs.writeFileSync(REPORT_FILE, mergedContent, 'utf-8');
    console.log(`\n✓ Đã gộp thành công vào ${REPORT_FILE}`);
  } catch (error) {
    console.log(`Error writing to ${REPORT_FILE}: ${error}`);
  }
}

mergeSections();
