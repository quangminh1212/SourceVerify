const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function takeScreenshots() {
  console.log('Starting Puppeteer...');
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  console.log('Browser launched');
  
  const page = await browser.newPage();
  console.log('New page created');
  
  // Set viewport size
  await page.setViewport({ width: 1920, height: 1080 });
  console.log('Viewport set to 1920x1080');
  
  // Screenshot homepage
  console.log('Navigating to homepage...');
  try {
    await page.goto('https://sourceverify.vercel.app/', { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });
    console.log('Page loaded');
    
    // Wait for content to render
    await page.waitForTimeout(3000);
    
    const outputPath = path.join(__dirname, '../docs/homepage.png');
    console.log('Saving screenshot to:', outputPath);
    
    await page.screenshot({ 
      path: outputPath,
      fullPage: true 
    });
    
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      console.log('Homepage screenshot saved successfully! Size:', stats.size, 'bytes');
    } else {
      console.error('Screenshot file was not created!');
    }
  } catch (error) {
    console.error('Error during screenshot:', error);
  }
  
  // Wait a bit then close
  await browser.close();
  console.log('Browser closed');
  console.log('Done!');
}

takeScreenshots().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
