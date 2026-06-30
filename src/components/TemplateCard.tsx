import { FileText, Trash2, Clock, Layers } from 'lucide-react';
import type { LayoutTemplate } from '@/types';

interface TemplateCardProps {
  template: LayoutTemplate;
  onLoad: () => void;
  onDelete: () => void;
}

export function TemplateCard({ template, onLoad, onDelete }: TemplateCardProps) {
  const date = new Date(template.createdAt).toLocaleDateString('zh-CN');

  return (
    <div className="group relative rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md">
      <button type="button" onClick={onLoad} className="w-full text-left">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <FileText className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-slate-800">{template.name}</div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Clock className="h-3 w-3" />
              {date}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Layers className="h-3.5 w-3.5" />
            {template.pages.length} 页
          </span>
          <span>{template.settings.paperSize.toUpperCase()} {template.settings.orientation === 'portrait' ? '纵向' : '横向'}</span>
        </div>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute right-2 top-2 rounded-md p-1 text-slate-300 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
        aria-label="删除模板"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
