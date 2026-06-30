import { useCallback } from 'react';
import { useAppStore } from '@/stores/appStore';
import { MAX_TEMPLATES } from '@/utils/constants';
import { uuid } from '@/utils/uuid';
import type { LayoutTemplate, PdfPage, PrintSettings } from '@/types';

export function useTemplates() {
  const templates = useAppStore((state) => state.templates);
  const addTemplate = useAppStore((state) => state.addTemplate);
  const removeTemplate = useAppStore((state) => state.removeTemplate);

  const saveTemplate = useCallback(
    (name: string, pages: PdfPage[], settings: PrintSettings) => {
      if (templates.length >= MAX_TEMPLATES) {
        return { success: false, message: `最多保存 ${MAX_TEMPLATES} 个模板` };
      }
      const template: LayoutTemplate = {
        id: uuid(),
        name: name.trim() || `模板 ${templates.length + 1}`,
        createdAt: Date.now(),
        pages: pages.map((p) => ({ ...p })),
        settings,
      };
      addTemplate(template);
      return { success: true, message: '模板保存成功' };
    },
    [templates, addTemplate],
  );

  const deleteTemplate = useCallback(
    (id: string) => {
      removeTemplate(id);
    },
    [removeTemplate],
  );

  return {
    templates,
    saveTemplate,
    deleteTemplate,
  };
}
