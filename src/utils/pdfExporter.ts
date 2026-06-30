import { PDFDocument, PDFImage, rgb } from 'pdf-lib';
import type { PdfPage, PrintSettings } from '@/types';
import { PAPER_SIZES } from './constants';

const MM_TO_PT = 2.83465;

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function fitImageToRect(
  imgWidth: number,
  imgHeight: number,
  rectWidth: number,
  rectHeight: number,
) {
  const scale = Math.min(rectWidth / imgWidth, rectHeight / imgHeight);
  return {
    width: imgWidth * scale,
    height: imgHeight * scale,
  };
}

export async function exportMergedPdf(
  pages: PdfPage[],
  settings: PrintSettings,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const paper = PAPER_SIZES[settings.paperSize];
  const pageWidthPt = paper.width * MM_TO_PT;
  const pageHeightPt = paper.height * MM_TO_PT;

  const contentWidth = pageWidthPt - (settings.marginLeft + settings.marginRight) * MM_TO_PT;
  const contentHeight =
    pageHeightPt - (settings.marginTop + settings.marginBottom) * MM_TO_PT;
  const slotHeight = (contentHeight - settings.invoiceGap * MM_TO_PT) / 2;

  for (let i = 0; i < pages.length; i += 2) {
    const page = pdfDoc.addPage([pageWidthPt, pageHeightPt]);
    const pair = [pages[i], pages[i + 1]].filter(Boolean) as PdfPage[];

    for (let j = 0; j < pair.length; j++) {
      const pdfPage = pair[j];
      const imageBytes = dataUrlToUint8Array(pdfPage.renderUrl);
      let image: PDFImage;
      try {
        image = await pdfDoc.embedPng(imageBytes);
      } catch {
        image = await pdfDoc.embedJpg(imageBytes);
      }

      const fitted = fitImageToRect(
        image.width,
        image.height,
        contentWidth,
        slotHeight,
      );

      const x = settings.marginLeft * MM_TO_PT + (contentWidth - fitted.width) / 2;
      const y =
        pageHeightPt -
        settings.marginTop * MM_TO_PT -
        j * (slotHeight + settings.invoiceGap * MM_TO_PT) -
        fitted.height;

      page.drawImage(image, {
        x,
        y,
        width: fitted.width,
        height: fitted.height,
      });
    }

    if (settings.showCutLine && pair.length === 2) {
      const cutY =
        pageHeightPt -
        settings.marginTop * MM_TO_PT -
        slotHeight -
        (settings.invoiceGap * MM_TO_PT) / 2;
      const cutX1 = settings.marginLeft * MM_TO_PT;
      const cutX2 = cutX1 + contentWidth;

      page.drawLine({
        start: { x: cutX1, y: cutY },
        end: { x: cutX2, y: cutY },
        thickness: 0.75,
        color: rgb(0.96, 0.34, 0.41),
        opacity: 0.6,
        dashArray: [4, 3],
      });
    }
  }

  return pdfDoc.save();
}
