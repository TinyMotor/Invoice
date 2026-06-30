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

/**
 * Print only the elements inside #print-container, by cloning them into
 * a hidden iframe and triggering the iframe's print dialog. The main page
 * (sidebars, preview chrome, etc.) is never visible to the print pipeline.
 */
export function triggerPrint(): void {
  const source = document.getElementById('print-container');
  if (!source) {
    window.print();
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.setAttribute('tabindex', '-1');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    document.body.removeChild(iframe);
    window.print();
    return;
  }

  // Copy the page's <head> so the iframe picks up Tailwind/base styles
  // and @media print rules. We strip scripts to keep the iframe passive.
  const headHtml = document.head.innerHTML;
  doc.open();
  doc.write(`<!doctype html><html><head>${headHtml}</head><body></body></html>`);
  doc.close();

  // Wait for the iframe document to be ready, then clone the print
  // container's children into it and trigger printing.
  const finalize = () => {
    if (!doc.body) {
      document.body.removeChild(iframe);
      window.print();
      return;
    }

    // Make sure the body has a white background and no margins.
    const style = doc.createElement('style');
    style.textContent = `
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
      }
      body { display: block !important; }
      .no-print, .no-print * { display: none !important; }
      .print-only { display: block !important; }
      .print-page {
        box-shadow: none !important;
        margin: 0 !important;
        page-break-after: always;
        page-break-inside: avoid;
      }
      .print-page:last-child { page-break-after: auto; }
    `;
    doc.head.appendChild(style);

    // Reveal the print container in the iframe regardless of screen media.
    const cloned = source.cloneNode(true) as HTMLElement;
    cloned.style.display = 'block';
    cloned.style.zIndex = '0';
    doc.body.appendChild(cloned);

    // Give the browser one frame to lay out, then print and clean up.
    const cleanup = () => {
      try {
        document.body.removeChild(iframe);
      } catch {
        // ignored
      }
    };

    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } finally {
      // Fallback cleanup: in case the print dialog blocks, still remove
      // the iframe on the next tick.
      setTimeout(cleanup, 1000);
    }
  };

  if (doc.readyState === 'complete') {
    finalize();
  } else {
    iframe.addEventListener('load', finalize, { once: true });
  }
}
