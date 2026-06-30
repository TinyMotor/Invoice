import html2pdf from 'html2pdf.js';
import type { PrintSettings } from '@/types';

export async function exportToPdf(element: HTMLElement, settings: PrintSettings, filename = '发票打印.pdf') {
  const opt = {
    margin: 0,
    filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    },
    jsPDF: {
      unit: 'mm',
      format: settings.paperSize.toUpperCase(),
      orientation: settings.orientation,
    },
    pagebreak: { mode: ['css-class', 'legacy'], after: '.print-page' },
  };

  return html2pdf().set(opt).from(element).save();
}

export function triggerPrint() {
  window.print();
}
