export interface PdfPage {
  id: string;
  fileName: string;
  pageNumber: number;
  totalPages: number;
  renderUrl: string;
  thumbUrl: string;
  width: number;
  height: number;
}

export type PaperSize = 'a4' | 'letter';
export type Orientation = 'portrait' | 'landscape';

export interface PrintSettings {
  paperSize: PaperSize;
  orientation: Orientation;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  invoiceGap: number;
  showCutLine: boolean;
  scale: number;
}

export interface LayoutTemplate {
  id: string;
  name: string;
  createdAt: number;
  pages: PdfPage[];
  settings: PrintSettings;
}

export interface HistoryRecord {
  id: string;
  printedAt: number;
  pageCount: number;
  fileNames: string[];
}

export interface FileValidationError {
  fileName: string;
  message: string;
}
