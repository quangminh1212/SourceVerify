const nodeHtmlToImage = require('node-html-to-image');
const fs = require('fs');
const path = require('path');

async function renderImage() {
  console.log('Reading HTML...');
  const htmlPath = path.join(__dirname, '../docs/homepage.html');
  let html;
  
  if (fs.existsSync(htmlPath)) {
    html = fs.readFileSync(htmlPath, 'utf8');
    console.log('HTML loaded, size:', html.length);
  } else {
    // Create simple HTML placeholder
    html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
          .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
          h1 { color: #2563eb; }
          .card { background: #e0f2fe; padding: 20px; margin: 20px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>SourceVerify</h1>
          <p>Nền tảng hỗ trợ kiểm chứng ảnh số có khả năng được tạo bởi AI</p>
          <div class="card">
            <h2>Kéo-thả ảnh để phân tích</h2>
            <p>Hệ thống sẽ chạy 5 phương pháp forensic để kiểm tra ảnh</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
  
  console.log('Rendering image...');
  const outputPath = path.join(__dirname, '../docs/homepage.png');
  
  await nodeHtmlToImage({
    html: html,
    output: outputPath,
    transparent: true,
    quality: 100,
    type: 'png',
    encoding: 'buffer',
    waitUntil: 'networkidle0'
  });
  
  console.log('Image saved to:', outputPath);
  if (fs.existsSync(outputPath)) {
    const stats = fs.statSync(outputPath);
    console.log('File size:', stats.size, 'bytes');
  }
}

renderImage().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
