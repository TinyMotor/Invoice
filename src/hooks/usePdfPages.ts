import { useCallback, useMemo } from 'react';
import { useAppStore } from '@/stores/appStore';
import { renderPdfFile } from '@/utils/pdfRenderer';
import { validatePdfFile, validatePageCount } from '@/utils/validation';
import type { FileValidationError, PdfPage } from '@/types';

export interface UploadResult {
  success: PdfPage[];
  errors: FileValidationError[];
}

export function usePdfPages() {
  const pages = useAppStore((state) => state.pages);
  const selectedPageId = useAppStore((state) => state.selectedPageId);
  const addPages = useAppStore((state) => state.addPages);
  const removePage = useAppStore((state) => state.removePage);
  const reorderPages = useAppStore((state) => state.reorderPages);
  const clearPages = useAppStore((state) => state.clearPages);
  const selectPage = useAppStore((state) => state.selectPage);

  const selectedPage = useMemo(
    () => pages.find((p) => p.id === selectedPageId) || pages[0] || null,
    [pages, selectedPageId],
  );

  const uploadFiles = useCallback(
    async (files: FileList | null, onProgress?: (fileName: string, current: number, total: number) => void): Promise<UploadResult> => {
      if (!files || files.length === 0) return { success: [], errors: [] };

      const result: UploadResult = { success: [], errors: [] };
      let currentTotal = pages.length;

      for (const file of Array.from(files)) {
        const fileError = validatePdfFile(file, currentTotal);
        if (fileError) {
          result.errors.push(fileError);
          continue;
        }

        try {
          const rendered = await renderPdfFile(file, (current, total) => {
            onProgress?.(file.name, current, total);
          });

          const countError = validatePageCount(file.name, rendered.length, currentTotal);
          if (countError) {
            result.errors.push(countError);
            continue;
          }

          const pdfPages: PdfPage[] = rendered.map((r) => ({
            id: r.id,
            fileName: r.fileName,
            pageNumber: r.pageNumber,
            totalPages: r.totalPages,
            renderUrl: r.renderUrl,
            thumbUrl: r.thumbUrl,
            width: r.width,
            height: r.height,
          }));

          result.success.push(...pdfPages);
          currentTotal += pdfPages.length;
        } catch (err) {
          result.errors.push({
            fileName: file.name,
            message: err instanceof Error ? err.message : '渲染失败',
          });
        }
      }

      if (result.success.length > 0) {
        addPages(result.success);
      }

      return result;
    },
    [pages.length, addPages],
  );

  return {
    pages,
    selectedPage,
    selectedPageId,
    uploadFiles,
    removePage,
    reorderPages,
    clearPages,
    selectPage,
  };
}
