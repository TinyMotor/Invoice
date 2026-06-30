import { useAppStore } from '@/stores/appStore';
import { PAPER_SIZES } from '@/utils/constants';
import type { PrintSettings } from '@/types';

export function usePrintSettings() {
  const settings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const previewScale = useAppStore((state) => state.previewScale);
  const setPreviewScale = useAppStore((state) => state.setPreviewScale);

  const paperDimensions = PAPER_SIZES[settings.paperSize];

  const effectiveWidth =
    settings.orientation === 'portrait' ? paperDimensions.width : paperDimensions.height;
  const effectiveHeight =
    settings.orientation === 'portrait' ? paperDimensions.height : paperDimensions.width;

  const contentWidth = effectiveWidth - settings.marginLeft - settings.marginRight;
  const contentHeight = effectiveHeight - settings.marginTop - settings.marginBottom;

  const invoiceHeight = (contentHeight - settings.invoiceGap) / 2;

  const update = (patch: Partial<PrintSettings>) => {
    updateSettings(patch);
  };

  return {
    settings,
    update,
    previewScale,
    setPreviewScale,
    paperDimensions,
    effectiveWidth,
    effectiveHeight,
    contentWidth,
    contentHeight,
    invoiceHeight,
  };
}
