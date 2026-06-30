import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAppStore } from '@/stores/appStore';
import { A4Page } from './A4Page';

export function PrintContainer() {
  const pages = useAppStore((state) => state.pages);
  const settings = useAppStore((state) => state.settings);

  const layoutPages = useMemo(() => {
    const perPage = 2;
    const result: typeof pages[] = [];
    for (let i = 0; i < pages.length; i += perPage) {
      result.push(pages.slice(i, i + perPage));
    }
    return result;
  }, [pages]);

  return createPortal(
    <div
      id="print-container"
      className="print-only fixed left-0 top-0 -z-50 flex flex-col bg-white"
      style={{ display: 'none' }}
    >
      {layoutPages.map((pagePages, index) => (
        <A4Page key={index} pages={pagePages} settings={settings} forPrint />
      ))}
    </div>,
    document.body,
  );
}
