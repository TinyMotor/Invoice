import { Receipt, FileText, SlidersHorizontal } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const rightPanelOpen = useAppStore((state) => state.rightPanelOpen);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);
  const setRightPanelOpen = useAppStore((state) => state.setRightPanelOpen);

  return (
    <header className="no-print sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-3 backdrop-blur-md sm:px-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md sm:h-10 sm:w-10">
          <Receipt className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate font-serif text-base font-bold text-slate-900 sm:text-lg">
            发票打印助手
          </h1>
          <p className="hidden text-[10px] text-slate-500 sm:block">
            A4 双发票智能排版 · 打印 · PDF 导出
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 lg:hidden">
        <button
          type="button"
          onClick={() => {
            setSidebarOpen(true);
            setRightPanelOpen(false);
          }}
          className={cn(
            'flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
            sidebarOpen ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100',
          )}
          aria-label="打开发票列表"
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">列表</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setRightPanelOpen(true);
            setSidebarOpen(false);
          }}
          className={cn(
            'flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
            rightPanelOpen ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100',
          )}
          aria-label="打开打印设置"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">设置</span>
        </button>
      </div>
    </header>
  );
}
