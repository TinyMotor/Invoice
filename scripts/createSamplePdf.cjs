const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');

async function createSamplePdf(fileName, title) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([400, 600]);
  const { width, height } = page.getSize();

  page.drawText(title, {
    x: 50,
    y: height - 80,
    size: 24,
    color: rgb(0, 0, 0),
  });

  page.drawText('Sample Electronic Invoice', {
    x: 50,
    y: height - 140,
    size: 16,
    color: rgb(0.2, 0.2, 0.2),
  });

  page.drawText(`Generated: ${new Date().toISOString()}`, {
    x: 50,
    y: height - 200,
    size: 12,
    color: rgb(0.4, 0.4, 0.4),
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(fileName, pdfBytes);
  console.log(`Created ${fileName}`);
}

(async () => {
  await createSamplePdf('sample-invoice-1.pdf', 'Invoice 001');
  await createSamplePdf('sample-invoice-2.pdf', 'Invoice 002');
})();
