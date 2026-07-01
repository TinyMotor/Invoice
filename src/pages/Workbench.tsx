import { useEffect } from 'react';
import { useAppStore } from '@/stores/appStore';
import { AppHeader } from '@/components/AppHeader';
import { PdfUploader } from '@/components/PdfUploader';
import { PdfPageList } from '@/components/PdfPageList';
import { PrintPreview } from '@/components/PrintPreview';
import { PrintSettings } from '@/components/PrintSettings';
import { TemplatePanel } from '@/components/TemplatePanel';
import { ActionBar } from '@/components/ActionBar';
import { PrintContainer } from '@/components/PrintStyles';
import { X, FileText, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Workbench() {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const rightPanelOpen = useAppStore((state) => state.rightPanelOpen);
  const mobileView = useAppStore((state) => state.mobileView);
  const setMobileView = useAppStore((state) => state.setMobileView);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);
  const setRightPanelOpen = useAppStore((state) => state.setRightPanelOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        useAppStore.getState().setSidebarOpen(true);
        useAppStore.getState().setRightPanelOpen(true);
      } else {
        useAppStore.getState().setSidebarOpen(false);
        useAppStore.getState().setRightPanelOpen(false);
        useAppStore.getState().setMobileView('preview');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeAllPanels = () => {
    setSidebarOpen(false);
    setRightPanelOpen(false);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <AppHeader />

      <main className="relative flex flex-1 overflow-hidden">
        {/* Left sidebar — drawer on mobile, fixed on desktop */}
        <aside
          className={cn(
            'no-print flex flex-col gap-4 overflow-y-auto border-r border-slate-200 bg-white p-4 transition-transform duration-300',
            'lg:w-[360px] lg:translate-x-0 lg:static',
            sidebarOpen
              ? 'fixed inset-y-16 left-0 z-40 w-[88vw] max-w-[360px] translate-x-0 shadow-2xl'
              : 'fixed inset-y-16 left-0 z-40 w-[88vw] max-w-[360px] -translate-x-full lg:translate-x-0',
          )}
        >
          <div className="flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FileText className="h-4 w-4 text-indigo-500" />
              发票列表
            </div>
            <button
              type="button"
              onClick={closeAllPanels}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              aria-label="关闭"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <PdfUploader />
          <PdfPageList />
        </aside>

        {/* Center preview */}
        <section
          className={cn(
            'relative flex flex-1 flex-col overflow-hidden',
            mobileView === 'preview' ? 'flex' : 'hidden',
            'lg:flex',
            'p-3 sm:p-4 lg:p-6',
          )}
        >
          <PrintPreview />
        </section>

        {/* Right panel — drawer on mobile, fixed on desktop */}
        <aside
          className={cn(
            'no-print flex flex-col gap-4 overflow-y-auto border-l border-slate-200 bg-white p-4 transition-transform duration-300',
            'lg:w-[320px] lg:translate-x-0 lg:static',
            rightPanelOpen
              ? 'fixed inset-y-16 right-0 z-40 w-[88vw] max-w-[320px] translate-x-0 shadow-2xl'
              : 'fixed inset-y-16 right-0 z-40 w-[88vw] max-w-[320px] translate-x-full lg:translate-x-0',
          )}
        >
          <div className="flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <SlidersHorizontal className="h-4 w-4 text-indigo-500" />
              排版与操作
            </div>
            <button
              type="button"
              onClick={closeAllPanels}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              aria-label="关闭"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <ActionBar />
          <PrintSettings />
          <TemplatePanel />
        </aside>

        {/* Mobile mask — only when a drawer is open */}
        {(sidebarOpen || rightPanelOpen) && (
          <button
            type="button"
            onClick={closeAllPanels}
            className="no-print fixed inset-x-0 bottom-16 top-16 z-30 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden"
            aria-label="关闭面板"
          />
        )}
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="no-print flex shrink-0 items-stretch border-t border-slate-200 bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.04)] lg:hidden">
        <button
          type="button"
          onClick={() => {
            setSidebarOpen(true);
            setRightPanelOpen(false);
            setMobileView('preview');
          }}
          className={cn(
            'flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors',
            sidebarOpen ? 'text-indigo-600' : 'text-slate-500',
          )}
        >
          <FileText className="h-5 w-5" />
          发票
        </button>
        <button
          type="button"
          onClick={() => {
            setMobileView('preview');
            setSidebarOpen(false);
            setRightPanelOpen(false);
          }}
          className={cn(
            'flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors',
            !sidebarOpen && !rightPanelOpen ? 'text-indigo-600' : 'text-slate-500',
          )}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="4" y="3" width="16" height="18" rx="2" />
            <path d="M9 7h6M9 11h6M9 15h4" />
          </svg>
          预览
        </button>
        <button
          type="button"
          onClick={() => {
            setRightPanelOpen(true);
            setSidebarOpen(false);
            setMobileView('preview');
          }}
          className={cn(
            'flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors',
            rightPanelOpen ? 'text-indigo-600' : 'text-slate-500',
          )}
        >
          <SlidersHorizontal className="h-5 w-5" />
          设置
        </button>
      </nav>

      <PrintContainer />
    </div>
  );
}
