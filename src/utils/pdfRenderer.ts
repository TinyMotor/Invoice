import { pdfjsLib } from './pdfjsSetup';
import { PDF_RENDER_DPI, THUMB_DPI } from './constants';

const MM_TO_PT = 2.83465;

async function renderPageToDataUrl(
  page: pdfjsLib.PDFPageProxy,
  dpi: number,
): Promise<{ dataUrl: string; width: number; height: number }> {
  const viewport = page.getViewport({ scale: 1 });
  const scale = dpi / 72;
  const scaledViewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = scaledViewport.width;
  canvas.height = scaledViewport.height;
  await page.render({ canvas, viewport: scaledViewport }).promise;
  const dataUrl = canvas.toDataURL('image/png');
  canvas.width = 0;
  canvas.height = 0;

  return {
    dataUrl,
    width: viewport.width / MM_TO_PT,
    height: viewport.height / MM_TO_PT,
  };
}

export interface RenderedPdfPage {
  id: string;
  fileName: string;
  pageNumber: number;
  totalPages: number;
  renderUrl: string;
  thumbUrl: string;
  width: number;
  height: number;
}

export async function renderPdfFile(
  file: File,
  onProgress?: (current: number, total: number) => void,
): Promise<RenderedPdfPage[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
    cMapUrl: `${import.meta.env.BASE_URL}cmaps/`,
    cMapPacked: true,
  }).promise;
  const totalPages = pdf.numPages;
  const result: RenderedPdfPage[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    const [rendered, thumb] = await Promise.all([
      renderPageToDataUrl(page, PDF_RENDER_DPI),
      renderPageToDataUrl(page, THUMB_DPI),
    ]);
    page.cleanup();

    result.push({
      id: crypto.randomUUID(),
      fileName: file.name,
      pageNumber: i,
      totalPages,
      renderUrl: rendered.dataUrl,
      thumbUrl: thumb.dataUrl,
      width: rendered.width,
      height: rendered.height,
    });

    onProgress?.(i, totalPages);
  }

  return result;
}
