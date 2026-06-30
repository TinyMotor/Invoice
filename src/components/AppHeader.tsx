import { Receipt, Menu, X } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const rightPanelOpen = useAppStore((state) => state.rightPanelOpen);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);
  const setRightPanelOpen = useAppStore((state) => state.setRightPanelOpen);

  return (
    <header className="no-print sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md lg:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md">
          <Receipt className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-serif text-lg font-bold text-slate-900">发票打印助手</h1>
          <p className="hidden text-[10px] text-slate-500 sm:block">A4 双发票智能排版 · 打印 · PDF 导出</p>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(
            'rounded-lg p-2 transition-colors',
            sidebarOpen ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100',
          )}
          aria-label="切换左侧栏"
        >
          <Menu className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
          className={cn(
            'rounded-lg p-2 transition-colors',
            rightPanelOpen ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100',
          )}
          aria-label="切换右侧面板"
        >
          {rightPanelOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}
