const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
  try {
    // Launch browser
    const browser = await puppeteer.launch({
      headless: 'new'
    });
    const page = await browser.newPage();

    // Read HTML file
    const htmlPath = path.join(__dirname, '../assets/sample-resume.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // Set content
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });

    // Generate PDF
    const pdfPath = path.join(__dirname, '../assets/sample-resume.pdf');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    console.log('PDF generated successfully at:', pdfPath);
    await browser.close();
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}

generatePDF(); 