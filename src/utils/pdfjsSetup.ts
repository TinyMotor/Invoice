import * as pdfjsLib from 'pdfjs-dist';
import './pdfPolyfills';
import PdfWorker from './pdfWorker.entry?worker';

// Polyfills installed via side-effect import above (main thread).
// The worker entry (pdfWorker.entry) also installs the same polyfills
// inside the worker context, so pdf.js 6.x calls to Uint8Array.prototype.toHex,
// crypto.randomUUID, Map.getOrInsertComputed, etc. work in both contexts.
pdfjsLib.GlobalWorkerOptions.workerPort = new PdfWorker();

export { pdfjsLib };
