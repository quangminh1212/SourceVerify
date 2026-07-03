const screenshot = require('screenshot-desktop');
const fs = require('fs');
const path = require('path');

async function takeScreenshot() {
  console.log('Taking screenshot...');
  try {
    const img = await screenshot();
    const outputPath = path.join(__dirname, '../docs/homepage.png');
    fs.writeFileSync(outputPath, img);
    console.log('Screenshot saved to:', outputPath);
    const stats = fs.statSync(outputPath);
    console.log('File size:', stats.size, 'bytes');
  } catch (error) {
    console.error('Error:', error);
  }
}

takeScreenshot();
