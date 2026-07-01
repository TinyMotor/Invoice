import { useState } from 'react';
import { Printer, FileDown, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useHistory } from '@/hooks/useHistory';
import { exportMergedPdf } from '@/utils/pdfExporter';
import { cn } from '@/lib/utils';

export function ActionBar() {
  const pages = useAppStore((state) => state.pages);
  const settings = useAppStore((state) => state.settings);
  const { recordPrint } = useHistory();
  const [exporting, setExporting] = useState(false);
  const [printing, setPrinting] = useState(false);

  const hasPages = pages.length > 0;

  const handlePrint = async () => {
    if (!hasPages || printing) return;
    setPrinting(true);
    try {
      const pdfBytes = await exportMergedPdf(pages, settings);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Hidden iframe: load PDF invisibly and trigger system print dialog directly
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.left = '-9999px';
      iframe.style.top = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);

      let printed = false;
      let fallbackTimer: ReturnType<typeof setTimeout>;

      const cleanup = () => {
        clearTimeout(fallbackTimer);
        setTimeout(() => {
          if (iframe.parentNode) document.body.removeChild(iframe);
          URL.revokeObjectURL(url);
        }, 10_000);
      };

      const doPrint = () => {
        if (printed) return;
        printed = true;
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          cleanup();
        } catch (e) {
          console.warn('iframe 打印失败，回退到新窗口', e);
          window.open(url, '_blank');
          cleanup();
        }
      };

      iframe.onload = () => setTimeout(doPrint, 500);
      fallbackTimer = setTimeout(() => {
        if (!printed) doPrint();
      }, 3000);

      iframe.src = url;
      recordPrint(pages);
    } catch (err) {
      console.error('生成打印 PDF 失败', err);
      alert('生成打印 PDF 失败，请重试');
    } finally {
      setPrinting(false);
    }
  };

  const handleExportPdf = async () => {
    if (!hasPages || exporting) return;
    setExporting(true);
    try {
      const pdfBytes = await exportMergedPdf(pages, settings);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `合并发票_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      recordPrint(pages);
    } catch (err) {
      console.error('导出 PDF 失败', err);
      alert('导出 PDF 失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {!hasPages && (
        <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <div className="font-semibold">尚未上传发票</div>
            <div className="mt-0.5">请从左侧上传 PDF 发票后再进行打印或导出。</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handlePrint}
          disabled={!hasPages || printing}
          className={cn(
            'flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition-all',
            !hasPages || printing
              ? 'cursor-not-allowed bg-slate-100 text-slate-400'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md active:translate-y-px',
          )}
        >
          <Printer className="h-4 w-4" />
          {printing ? '准备中…' : '打印'}
        </button>
        <button
          type="button"
          onClick={handleExportPdf}
          disabled={!hasPages || exporting}
          className={cn(
            'flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition-all',
            !hasPages || exporting
              ? 'cursor-not-allowed bg-slate-100 text-slate-400'
              : 'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 active:translate-y-px',
          )}
        >
          <FileDown className="h-4 w-4" />
          {exporting ? '导出中…' : '导出 PDF'}
        </button>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
        <span>共 {pages.length} 页发票</span>
        <span>预计 {Math.ceil(pages.length / 2)} 张 A4</span>
      </div>
    </div>
  );
}
