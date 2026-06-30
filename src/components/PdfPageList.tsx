import { usePdfPages } from '@/hooks/usePdfPages';
import { PdfPageThumbnail } from './PdfPageThumbnail';

export function PdfPageList() {
  const { pages, selectedPageId, removePage, selectPage, clearPages } = usePdfPages();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">发票页面</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{pages.length} 页</span>
          {pages.length > 0 && (
            <button
              type="button"
              onClick={clearPages}
              className="text-xs text-rose-600 hover:text-rose-700"
            >
              清空
            </button>
          )}
        </div>
      </div>

      {pages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-8 text-center text-sm text-slate-500">
          暂无 PDF 页面
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {pages.map((page) => (
            <PdfPageThumbnail
              key={page.id}
              page={page}
              isSelected={page.id === selectedPageId}
              onSelect={() => selectPage(page.id)}
              onRemove={() => removePage(page.id)}
              canRemove={pages.length > 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
