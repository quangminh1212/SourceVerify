const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function createHomepageImage() {
  const canvas = createCanvas(1200, 800);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 1200, 800);
  
  // Header
  ctx.fillStyle = '#1e40af';
  ctx.fillRect(0, 0, 1200, 80);
  
  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px Arial';
  ctx.fillText('SourceVerify', 40, 50);
  
  // Main content area
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(40, 120, 560, 400);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 120, 560, 400);
  
  // Drop zone text
  ctx.fillStyle = '#3b82f6';
  ctx.font = '24px Arial';
  ctx.fillText('Kéo-thả ảnh để phân tích', 180, 280);
  
  ctx.fillStyle = '#64748b';
  ctx.font = '16px Arial';
  ctx.fillText('Hệ thống sẽ chạy 5 phương pháp forensic', 150, 320);
  
  // Result area
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(620, 120, 540, 400);
  ctx.strokeStyle = '#e2e8f0';
  ctx.strokeRect(620, 120, 540, 400);
  
  // Result text
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 20px Arial';
  ctx.fillText('VERDICT: AI-GENERATED', 680, 180);
  
  ctx.fillStyle = '#64748b';
  ctx.font = '16px Arial';
  ctx.fillText('AI Score: 68/100', 680, 220);
  ctx.fillText('Tin cậy: 64%', 680, 250);
  
  // Method bars
  const methods = [
    { name: 'Noise Residual', score: 72 },
    { name: 'DCT Block', score: 65 },
    { name: 'Spectral Nyquist', score: 60 },
    { name: 'Chromatic Ab.', score: 68 },
    { name: 'Metadata', score: 50 }
  ];
  
  let y = 300;
  methods.forEach(method => {
    ctx.fillStyle = '#64748b';
    ctx.font = '14px Arial';
    ctx.fillText(method.name, 640, y);
    
    // Bar background
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(640, y + 10, 400, 20);
    
    // Bar fill
    ctx.fillStyle = '#f97316';
    ctx.fillRect(640, y + 10, method.score * 4, 20);
    
    // Score text
    ctx.fillStyle = '#64748b';
    ctx.fillText(method.score.toString(), 1050, y + 25);
    
    y += 50;
  });
  
  // Footer
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 560, 1200, 240);
  
  ctx.fillStyle = '#64748b';
  ctx.font = '14px Arial';
  ctx.fillText('SourceVerify - Nền tảng kiểm chứng ảnh số AI', 40, 600);
  ctx.fillText('© 2026 Bạch Minh Quang', 40, 630);
  
  // Save
  const outputPath = path.join(require('os').tmpdir(), 'homepage.png');
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log('Homepage image saved to:', outputPath);
  
  const stats = fs.statSync(outputPath);
  console.log('File size:', stats.size, 'bytes');
  return outputPath;
}

function createResultImage() {
  const canvas = createCanvas(1200, 800);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 1200, 800);
  
  // Header
  ctx.fillStyle = '#1e40af';
  ctx.fillRect(0, 0, 1200, 80);
  
  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px Arial';
  ctx.fillText('SourceVerify - Kết quả phân tích', 40, 50);
  
  // Main result card
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(40, 120, 1120, 300);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 120, 1120, 300);
  
  // Verdict
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 36px Arial';
  ctx.fillText('AI-GENERATED', 500, 200);
  
  ctx.fillStyle = '#64748b';
  ctx.font = '24px Arial';
  ctx.fillText('AI Score: 68/100', 480, 250);
  ctx.fillText('Độ tin cậy: 64%', 480, 290);
  
  // Methods section
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(40, 460, 1120, 300);
  ctx.strokeStyle = '#e2e8f0';
  ctx.strokeRect(40, 460, 1120, 300);
  
  ctx.fillStyle = '#1e40af';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('Chi tiết các phương pháp', 60, 500);
  
  const methods = [
    { name: 'Noise Residual', score: 72, desc: 'Nhiễu quá đều, nghi AI' },
    { name: 'DCT Block Artifacts', score: 65, desc: 'Không có vết khối JPEG' },
    { name: 'Spectral Nyquist', score: 60, desc: 'Phổ nhô ở tần số cao' },
    { name: 'Chromatic Aberration', score: 68, desc: 'Thiếu viền màu ống kính' },
    { name: 'Metadata', score: 50, desc: 'Không có EXIF camera' }
  ];
  
  let x = 60;
  methods.forEach(method => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, 520, 200, 220);
    ctx.strokeStyle = '#e2e8f0';
    ctx.strokeRect(x, 520, 200, 220);
    
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(method.name, x + 10, 550);
    
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 32px Arial';
    ctx.fillText(method.score.toString(), x + 80, 600);
    
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Arial';
    ctx.fillText(method.desc, x + 10, 650);
    
    x += 220;
  });
  
  // Save
  const outputPath = path.join(require('os').tmpdir(), 'result-page.png');
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log('Result image saved to:', outputPath);
  
  const stats = fs.statSync(outputPath);
  console.log('File size:', stats.size, 'bytes');
  return outputPath;
}

try {
  createHomepageImage();
  createResultImage();
  console.log('All images created successfully!');
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
