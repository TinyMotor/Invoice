import type { PrintSettings } from '@/types';

export const STORAGE_KEYS = {
  settings: 'invoice-print-assistant:settings',
  templates: 'invoice-print-assistant:templates',
  history: 'invoice-print-assistant:history',
};

export const PAPER_SIZES: Record<string, { width: number; height: number; name: string }> = {
  a4: { width: 210, height: 297, name: 'A4 (210 × 297 mm)' },
  letter: { width: 216, height: 279, name: 'Letter (216 × 279 mm)' },
};

export const DEFAULT_PRINT_SETTINGS: PrintSettings = {
  paperSize: 'a4',
  orientation: 'portrait',
  marginTop: 10,
  marginRight: 10,
  marginBottom: 10,
  marginLeft: 10,
  invoiceGap: 8,
  showCutLine: false,
  scale: 1,
};

export const PDF_RENDER_DPI = 200;
export const THUMB_DPI = 72;

export const MAX_FILE_SIZE_MB = 20;
export const MAX_PAGES_PER_FILE = 50;
export const MAX_TOTAL_PAGES = 200;
export const MAX_TEMPLATES = 50;
export const MAX_HISTORY = 30;
