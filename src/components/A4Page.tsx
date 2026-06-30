import type { PdfPage, PrintSettings } from '@/types';
import { PdfPageImage } from './PdfPageImage';

interface A4PageProps {
  pages: PdfPage[];
  settings: PrintSettings;
  pageIndex: number;
  totalPages: number;
  forPrint?: boolean;
}

export function A4Page({ pages, settings, pageIndex, totalPages, forPrint = false }: A4PageProps) {
  const isPortrait = settings.orientation === 'portrait';
  const widthMm = isPortrait ? 210 : 297;
  const heightMm = isPortrait ? 297 : 210;
  const pxPerMm = 3.78;

  const contentWidth = widthMm - settings.marginLeft - settings.marginRight;
  const contentHeight = heightMm - settings.marginTop - settings.marginBottom;
  const slotHeight = (contentHeight - settings.invoiceGap) / 2;

  return (
    <div
      className={`relative box-border bg-white shadow-paper ${forPrint ? 'print-page' : ''}`}
      style={{
        width: widthMm * pxPerMm,
        height: heightMm * pxPerMm,
        paddingTop: settings.marginTop * pxPerMm,
        paddingRight: settings.marginRight * pxPerMm,
        paddingBottom: settings.marginBottom * pxPerMm,
        paddingLeft: settings.marginLeft * pxPerMm,
      }}
    >
      {pages.map((page, index) => {
        const top = index * (slotHeight * pxPerMm + settings.invoiceGap * pxPerMm);
        return (
          <div
            key={page.id}
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top }}
          >
            <PdfPageImage page={page} width={contentWidth} height={slotHeight} />
            {settings.showCutLine && index < pages.length - 1 && (
              <div
                className="absolute left-0 right-0 border-t-2 border-dashed border-rose-400/60"
                style={{
                  top: slotHeight * pxPerMm + (settings.invoiceGap * pxPerMm) / 2,
                }}
              />
            )}
          </div>
        );
      })}

      <div className="absolute bottom-2 right-3 text-[10px] text-slate-400">
        第 {pageIndex + 1} / {totalPages} 页
      </div>
    </div>
  );
}
