import { useCallback } from 'react';
import { useAppStore } from '@/stores/appStore';
import { MAX_HISTORY } from '@/utils/constants';
import type { HistoryRecord, PdfPage } from '@/types';

export function useHistory() {
  const history = useAppStore((state) => state.history);
  const setHistory = useAppStore((state) => state.setHistory);

  const recordPrint = useCallback(
    (pages: PdfPage[]) => {
      const record: HistoryRecord = {
        id: crypto.randomUUID(),
        printedAt: Date.now(),
        pageCount: pages.length,
        fileNames: Array.from(new Set(pages.map((p) => p.fileName))),
      };
      const nextHistory = [record, ...history].slice(0, MAX_HISTORY);
      setHistory(nextHistory);
      return record;
    },
    [history, setHistory],
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return {
    history,
    recordPrint,
    clearHistory,
  };
}
