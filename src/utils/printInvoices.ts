import type { PdfPage, PrintSettings } from '@/types';
import { PAPER_SIZES } from './constants';

export function printInvoices(pages: PdfPage[], settings: PrintSettings): void {
  const paper = PAPER_SIZES[settings.paperSize];
  const isPortrait = settings.orientation === 'portrait';
  const pageWidthMm = isPortrait ? paper.width : paper.height;
  const pageHeightMm = isPortrait ? paper.height : paper.width;

  const contentWidth = pageWidthMm - settings.marginLeft - settings.marginRight;
  const contentHeight = pageHeightMm - settings.marginTop - settings.marginBottom;
  const slotHeight = (contentHeight - settings.invoiceGap) / 2;
  const scaledSlotWidth = contentWidth * settings.scale;
  const scaledSlotHeight = slotHeight * settings.scale;

  const pairs: PdfPage[][] = [];
  for (let i = 0; i < pages.length; i += 2) {
    pairs.push(pages.slice(i, i + 2));
  }

  const pageDivs = pairs
    .map((pair) => {
      const invoiceDivs = pair
        .map((page, index) => {
          const top =
            settings.marginTop +
            index * (slotHeight + settings.invoiceGap) +
            (slotHeight - scaledSlotHeight) / 2;
          return `<div class="invoice" style="top:${top}mm;width:${scaledSlotWidth}mm;height:${scaledSlotHeight}mm;"><img src="${page.renderUrl}"></div>`;
        })
        .join('');

      const cutLineTop = settings.marginTop + slotHeight + settings.invoiceGap / 2;
      const cutLine =
        settings.showCutLine && pair.length === 2
          ? `<div class="cut-line" style="top:${cutLineTop}mm;left:${settings.marginLeft}mm;right:${settings.marginRight}mm;"></div>`
          : '';

      return `<div class="page">${invoiceDivs}${cutLine}</div>`;
    })
    .join('');

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>打印发票</title>
<style>
  @page { size: ${pageWidthMm}mm ${pageHeightMm}mm; margin: 0; }
  html, body { margin: 0; padding: 0; }
  .page {
    width: ${pageWidthMm}mm;
    height: ${pageHeightMm}mm;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
    break-after: page;
    page-break-after: always;
  }
  .page:last-child { break-after: auto; page-break-after: auto; }
  .invoice {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .invoice img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  .cut-line {
    position: absolute;
    border-top: 0.75pt dashed rgb(244, 86, 104);
    opacity: 0.6;
  }
</style>
</head>
<body>
${pageDivs}
</body>
</html>`;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-9999px';
  iframe.style.top = '0';
  iframe.style.width = '1024px';
  iframe.style.height = '768px';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const cw = iframe.contentWindow;
  const doc = cw?.document;
  if (!cw || !doc) {
    if (iframe.parentNode) document.body.removeChild(iframe);
    throw new Error('无法创建打印框架');
  }

  doc.open();
  doc.write(html);
  doc.close();

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    setTimeout(() => {
      if (iframe.parentNode) document.body.removeChild(iframe);
    }, 10_000);
  };

  const triggerPrint = () => {
    if (done) return;
    try {
      cw.focus();
      cw.print();
    } catch (e) {
      console.warn('打印调用失败', e);
    }
    finish();
  };

  const images = Array.from(doc.images);
  let loaded = 0;
  const total = images.length;

  if (total === 0) {
    setTimeout(triggerPrint, 500);
    return;
  }

  const onImageDone = () => {
    loaded += 1;
    if (loaded >= total) setTimeout(triggerPrint, 300);
  };

  images.forEach((img) => {
    if (img.complete) {
      onImageDone();
    } else {
      img.addEventListener('load', onImageDone, { once: true });
      img.addEventListener('error', onImageDone, { once: true });
    }
  });

  setTimeout(() => {
    if (!done) triggerPrint();
  }, 5000);
}
