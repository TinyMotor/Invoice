import type { PdfPage } from '@/types';

interface PdfPageImageProps {
  page: PdfPage;
  width: number;
  height: number;
}

export function PdfPageImage({ page, width, height }: PdfPageImageProps) {
  const pxPerMm = 3.78;
  const slotWidthPx = width * pxPerMm;
  const slotHeightPx = height * pxPerMm;

  const scale = Math.min(slotWidthPx / page.width, slotHeightPx / page.height);
  const imgWidthPx = page.width * scale;
  const imgHeightPx = page.height * scale;

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        width: slotWidthPx,
        height: slotHeightPx,
      }}
    >
      <img
        src={page.renderUrl}
        alt={`${page.fileName} 第 ${page.pageNumber} 页`}
        className="max-h-full max-w-full object-contain shadow-sm"
        style={{
          width: imgWidthPx,
          height: imgHeightPx,
        }}
      />
    </div>
  );
}
