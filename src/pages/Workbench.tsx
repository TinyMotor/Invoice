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
import { cn } from '@/lib/utils';

export default function Workbench() {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const rightPanelOpen = useAppStore((state) => state.rightPanelOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        useAppStore.getState().setSidebarOpen(true);
        useAppStore.getState().setRightPanelOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <AppHeader />

      <main className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside
          className={cn(
            'no-print flex w-full flex-col gap-4 overflow-y-auto border-r border-slate-200 bg-white p-4 transition-all duration-300 lg:w-[360px] lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
            sidebarOpen ? 'absolute inset-y-16 left-0 z-30 lg:static lg:inset-auto' : 'hidden lg:flex',
          )}
        >
          <PdfUploader />
          <PdfPageList />
        </aside>

        {/* Center preview */}
        <section className="relative flex flex-1 flex-col overflow-hidden p-4 lg:p-6">
          <PrintPreview />
        </section>

        {/* Right panel */}
        <aside
          className={cn(
            'no-print flex w-full flex-col gap-4 overflow-y-auto border-l border-slate-200 bg-white p-4 transition-all duration-300 lg:w-[320px] lg:translate-x-0',
            rightPanelOpen ? 'translate-x-0' : 'translate-x-full',
            rightPanelOpen ? 'absolute inset-y-16 right-0 z-30 lg:static lg:inset-auto' : 'hidden lg:flex',
          )}
        >
          <ActionBar />
          <PrintSettings />
          <TemplatePanel />
        </aside>
      </main>

      <PrintContainer />
    </div>
  );
}
