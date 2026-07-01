import { Trash2, FileText } from 'lucide-react';
import type { PdfPage } from '@/types';
import { cn } from '@/lib/utils';

interface PdfPageThumbnailProps {
  page: PdfPage;
  index: number;
  total: number;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function PdfPageThumbnail({
  page,
  index,
  total,
  isSelected,
  onSelect,
  onRemove,
  canRemove,
}: PdfPageThumbnailProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'group relative flex cursor-pointer flex-col gap-2 rounded-xl border p-2.5 transition-all',
        isSelected
          ? 'border-indigo-500 bg-indigo-50/60 shadow-sm'
          : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50',
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-slate-100">
        <img
          src={page.thumbUrl}
          alt={`${page.fileName} 第 ${page.pageNumber} 页`}
          className="h-full w-full object-contain"
          loading="lazy"
        />
        <div className="absolute right-1 top-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
          {index}/{total}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-xs text-slate-700">
            <FileText className="h-3 w-3 shrink-0 text-slate-400" />
            <span className="truncate">{page.fileName}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          disabled={!canRemove}
          className="shrink-0 rounded-md p-1 text-slate-400 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100 disabled:opacity-0"
          aria-label="删除页面"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
