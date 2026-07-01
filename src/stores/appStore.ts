import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PdfPage, PrintSettings, LayoutTemplate, HistoryRecord } from '@/types';
import { DEFAULT_PRINT_SETTINGS } from '@/utils/constants';

interface AppState {
  pages: PdfPage[];
  selectedPageId: string | null;
  settings: PrintSettings;
  templates: LayoutTemplate[];
  history: HistoryRecord[];
  previewScale: number;
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  mobileView: 'preview' | 'list' | 'settings';

  setPages: (pages: PdfPage[]) => void;
  addPages: (pages: PdfPage[]) => void;
  removePage: (id: string) => void;
  reorderPages: (ids: string[]) => void;
  clearPages: () => void;
  selectPage: (id: string | null) => void;

  setSettings: (settings: PrintSettings) => void;
  updateSettings: (patch: Partial<PrintSettings>) => void;

  setTemplates: (templates: LayoutTemplate[]) => void;
  addTemplate: (template: LayoutTemplate) => void;
  removeTemplate: (id: string) => void;

  setHistory: (history: HistoryRecord[]) => void;
  addHistory: (record: HistoryRecord) => void;

  setPreviewScale: (scale: number) => void;
  setSidebarOpen: (open: boolean) => void;
  setRightPanelOpen: (open: boolean) => void;
  setMobileView: (view: 'preview' | 'list' | 'settings') => void;
}

const storageOptions = {
  name: 'invoice-print-assistant:store',
  partialize: (state: AppState) => ({
    settings: state.settings,
    templates: state.templates,
    history: state.history,
  }),
};

export const useAppStore = create<AppState>()(
  persist(
    (set, _) => ({
      pages: [],
      selectedPageId: null,
      settings: { ...DEFAULT_PRINT_SETTINGS },
      templates: [],
      history: [],
      previewScale: 0.75,
      sidebarOpen: true,
      rightPanelOpen: true,
      mobileView: 'preview',

      setPages: (pages) => set({ pages }),
      addPages: (pages) => {
        set((state) => {
          const combined = [...state.pages, ...pages];
          return {
            pages: combined,
            selectedPageId: state.selectedPageId || combined[0]?.id || null,
          };
        });
      },
      removePage: (id) => {
        set((state) => {
          const filtered = state.pages.filter((p) => p.id !== id);
          const nextId =
            state.selectedPageId === id ? filtered[0]?.id || null : state.selectedPageId;
          return { pages: filtered, selectedPageId: nextId };
        });
      },
      reorderPages: (ids) => {
        set((state) => {
          const map = new Map(state.pages.map((p) => [p.id, p]));
          return { pages: ids.map((id) => map.get(id)!).filter(Boolean) };
        });
      },
      clearPages: () => set({ pages: [], selectedPageId: null }),
      selectPage: (id) => set({ selectedPageId: id }),

      setSettings: (settings) => set({ settings }),
      updateSettings: (patch) =>
        set((state) => ({ settings: { ...state.settings, ...patch } })),

      setTemplates: (templates) => set({ templates }),
      addTemplate: (template) =>
        set((state) => ({ templates: [template, ...state.templates] })),
      removeTemplate: (id) =>
        set((state) => ({ templates: state.templates.filter((t) => t.id !== id) })),

      setHistory: (history) => set({ history }),
      addHistory: (record) =>
        set((state) => ({ history: [record, ...state.history] })),

      setPreviewScale: (scale) => set({ previewScale: scale }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
      setMobileView: (view) => set({ mobileView: view }),
    }),
    storageOptions,
  ),
);
