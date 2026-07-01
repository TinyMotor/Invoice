import { useState } from 'react';
import { Printer, FileDown, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useHistory } from '@/hooks/useHistory';
import { exportMergedPdf } from '@/utils/pdfExporter';
import { printInvoices } from '@/utils/printInvoices';
import { isMobile, isInAppBrowser, blobToDataUrl } from '@/utils/browser';
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
      printInvoices(pages, settings);
      recordPrint(pages);
    } catch (err) {
      console.error('调起打印失败', err);
      alert('调起打印失败，请改用「导出 PDF」后手动打印');
    } finally {
      setPrinting(false);
    }
  };

  const handleExportPdf = async () => {
    if (!hasPages || exporting) return;
    setExporting(true);
    try {
      const pdfBytes = await exportMergedPdf(pages, settings);
      const filename = `合并发票_${new Date().toISOString().slice(0, 10)}.pdf`;
      await downloadPdf(pdfBytes, filename);
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

/**
 * 多策略 PDF 下载
 * 1. 内置浏览器（微信/QQ等）→ 提示用户「在浏览器中打开」
 * 2. 移动端普通浏览器 → data URL + a.download（更兼容）
 * 3. 桌面端 → blob URL + a.download
 */
async function downloadPdf(bytes: Uint8Array, filename: string): Promise<void> {
  const blob = new Blob([bytes], { type: 'application/pdf' });

  if (isInAppBrowser()) {
    // 内置浏览器：blob URL 跳转后失效，data URL 通常也会被拦截
    // 直接提示用户在系统浏览器中打开
    alert(
      '当前内置浏览器不支持直接下载文件。\n\n请点击右上角菜单 →「在浏览器中打开」本页面后，再点击「导出 PDF」。',
    );
    return;
  }

  if (isMobile()) {
    // 移动端普通浏览器：data URL 更兼容
    // iOS Safari 会显示 PDF，用户可保存到「文件」App
    // Android Chrome 通常会直接下载
    try {
      const dataUrl = await blobToDataUrl(blob);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    } catch (err) {
      console.warn('data URL 下载失败，回退到 blob URL', err);
    }
  }

  // 桌面端：blob URL + download 属性
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
