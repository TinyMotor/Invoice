import { useMemo, useState } from 'react';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { A4Page } from './A4Page';
import { cn } from '@/lib/utils';

export function PrintPreview() {
  const pages = useAppStore((state) => state.pages);
  const settings = useAppStore((state) => state.settings);
  const previewScale = useAppStore((state) => state.previewScale);
  const setPreviewScale = useAppStore((state) => state.setPreviewScale);

  const [pageIndex, setPageIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const layoutPages = useMemo(() => {
    const perPage = 2;
    const result: typeof pages[] = [];
    for (let i = 0; i < pages.length; i += perPage) {
      result.push(pages.slice(i, i + perPage));
    }
    return result;
  }, [pages]);

  const currentPage = layoutPages[pageIndex] || [];

  const handleZoomIn = () => setPreviewScale(Math.min(previewScale + 0.1, 1.5));
  const handleZoomOut = () => setPreviewScale(Math.max(previewScale - 0.1, 0.3));

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-float',
        fullscreen ? 'fixed inset-0 z-50' : 'h-full min-h-[600px]',
      )}
    >
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div className="text-sm font-semibold text-slate-700">打印预览</div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={handleZoomOut}
              className="rounded-md p-1.5 text-slate-600 hover:bg-white hover:shadow-sm"
              aria-label="缩小"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="min-w-[48px] text-center text-xs font-medium text-slate-600">
              {Math.round(previewScale * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="rounded-md p-1.5 text-slate-600 hover:bg-white hover:shadow-sm"
              aria-label="放大"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              disabled={pageIndex === 0}
              className="rounded-md p-1.5 text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-30"
              aria-label="上一页"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[56px] text-center text-xs font-medium text-slate-600">
              {pages.length > 0 ? pageIndex + 1 : 0} / {layoutPages.length}
            </span>
            <button
              type="button"
              onClick={() => setPageIndex((p) => Math.min(layoutPages.length - 1, p + 1))}
              disabled={pageIndex >= layoutPages.length - 1}
              className="rounded-md p-1.5 text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-30"
              aria-label="下一页"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setFullscreen((v) => !v)}
            className="rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-slate-600 hover:bg-white hover:shadow-sm"
            aria-label={fullscreen ? '退出全屏' : '全屏预览'}
          >
            {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex flex-1 items-start justify-center overflow-auto p-8">
        <div
          className="origin-top transition-transform duration-200"
          style={{ transform: `scale(${previewScale})` }}
        >
          {currentPage.length > 0 ? (
            <A4Page pages={currentPage} settings={settings} />
          ) : (
            <div className="flex h-[400px] w-[300px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-500">
              请先上传 PDF 发票
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
