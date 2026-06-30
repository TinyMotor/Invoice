import { Settings, Ruler, Scissors } from 'lucide-react';
import { usePrintSettings } from '@/hooks/usePrintSettings';
import { PAPER_SIZES } from '@/utils/constants';
import type { PaperSize } from '@/types';

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

export function PrintSettings() {
  const { settings, update } = usePrintSettings();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Settings className="h-4 w-4 text-indigo-500" />
        打印设置
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">纸张大小</label>
            <select
              value={settings.paperSize}
              onChange={(e) => update({ paperSize: e.target.value as PaperSize })}
              className={inputClass}
            >
              {Object.entries(PAPER_SIZES).map(([key, { name }]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">纸张方向</label>
            <div className="flex rounded-lg border border-slate-200 p-0.5">
              <button
                type="button"
                onClick={() => update({ orientation: 'portrait' })}
                className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
                  settings.orientation === 'portrait'
                    ? 'bg-indigo-500 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                纵向
              </button>
              <button
                type="button"
                onClick={() => update({ orientation: 'landscape' })}
                className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
                  settings.orientation === 'landscape'
                    ? 'bg-indigo-500 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                横向
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-600">
            <Ruler className="h-3.5 w-3.5" />
            页边距（mm）
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[10px] text-slate-500">上</label>
              <input
                type="number"
                min={0}
                max={50}
                step={1}
                value={settings.marginTop}
                onChange={(e) => update({ marginTop: Number(e.target.value) })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] text-slate-500">右</label>
              <input
                type="number"
                min={0}
                max={50}
                step={1}
                value={settings.marginRight}
                onChange={(e) => update({ marginRight: Number(e.target.value) })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] text-slate-500">下</label>
              <input
                type="number"
                min={0}
                max={50}
                step={1}
                value={settings.marginBottom}
                onChange={(e) => update({ marginBottom: Number(e.target.value) })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] text-slate-500">左</label>
              <input
                type="number"
                min={0}
                max={50}
                step={1}
                value={settings.marginLeft}
                onChange={(e) => update({ marginLeft: Number(e.target.value) })}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">发票间距（mm）</label>
          <input
            type="number"
            min={0}
            max={30}
            step={1}
            value={settings.invoiceGap}
            onChange={(e) => update({ invoiceGap: Number(e.target.value) })}
            className={inputClass}
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
            <span>发票缩放</span>
            <span className="font-mono text-slate-500">{Math.round(settings.scale * 100)}%</span>
          </div>
          <input
            type="range"
            min={50}
            max={150}
            step={5}
            value={Math.round(settings.scale * 100)}
            onChange={(e) => update({ scale: Number(e.target.value) / 100 })}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-500"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 transition-colors hover:bg-slate-100">
          <input
            type="checkbox"
            checked={settings.showCutLine}
            onChange={(e) => update({ showCutLine: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="flex items-center gap-2 text-sm text-slate-700">
            <Scissors className="h-4 w-4 text-slate-400" />
            添加裁剪线
          </span>
        </label>
      </div>
    </div>
  );
}
