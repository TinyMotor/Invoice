import { useState } from 'react';
import { Save, History, FolderOpen, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useTemplates } from '@/hooks/useTemplates';
import { useHistory } from '@/hooks/useHistory';
import { TemplateCard } from './TemplateCard';
import { cn } from '@/lib/utils';

type Tab = 'templates' | 'history';

export function TemplatePanel() {
  const [activeTab, setActiveTab] = useState<Tab>('templates');
  const [templateName, setTemplateName] = useState('');
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const pages = useAppStore((state) => state.pages);
  const settings = useAppStore((state) => state.settings);
  const setPages = useAppStore((state) => state.setPages);
  const { templates, saveTemplate, deleteTemplate } = useTemplates();
  const { history, clearHistory } = useHistory();

  const handleSaveTemplate = () => {
    if (pages.length === 0) {
      setSaveStatus({ type: 'error', message: '当前没有页面可保存' });
      return;
    }
    const result = saveTemplate(templateName, pages, settings);
    setSaveStatus({ type: result.success ? 'success' : 'error', message: result.message });
    if (result.success) {
      setTemplateName('');
      setTimeout(() => setSaveStatus(null), 2000);
    }
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    if (template.pages.length === 0) {
      setSaveStatus({ type: 'error', message: '模板中没有页面' });
      return;
    }

    setPages(template.pages.map((p) => ({ ...p })));
    useAppStore.getState().updateSettings(template.settings);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <FolderOpen className="h-4 w-4 text-indigo-500" />
        模板与历史
      </div>

      <div className="mb-4 flex rounded-lg border border-slate-200 p-0.5">
        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors',
            activeTab === 'templates'
              ? 'bg-indigo-500 text-white'
              : 'text-slate-600 hover:bg-slate-50',
          )}
        >
          <Save className="h-3.5 w-3.5" />
          模板
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors',
            activeTab === 'history'
              ? 'bg-indigo-500 text-white'
              : 'text-slate-600 hover:bg-slate-50',
          )}
        >
          <History className="h-3.5 w-3.5" />
          历史
        </button>
      </div>

      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">保存当前排版为模板</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="模板名称"
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="button"
                onClick={handleSaveTemplate}
                disabled={pages.length === 0}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md active:translate-y-px disabled:opacity-40"
              >
                保存
              </button>
            </div>
            {saveStatus && (
              <div
                className={cn(
                  'mt-2 flex items-center gap-1.5 text-xs',
                  saveStatus.type === 'success' ? 'text-emerald-600' : 'text-rose-600',
                )}
              >
                {saveStatus.type === 'error' ? <AlertCircle className="h-3.5 w-3.5" /> : null}
                {saveStatus.message}
              </div>
            )}
          </div>

          <div>
            <div className="mb-2 text-xs font-medium text-slate-600">已保存模板</div>
            {templates.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 py-6 text-center text-xs text-slate-400">
                暂无模板
              </div>
            ) : (
              <div className="max-h-[280px] space-y-2 overflow-y-auto pr-1">
                {templates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onLoad={() => handleLoadTemplate(template.id)}
                    onDelete={() => deleteTemplate(template.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-slate-600">最近打印/导出记录</div>
            {history.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                className="text-xs text-rose-600 hover:text-rose-700"
              >
                清空
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 py-6 text-center text-xs text-slate-400">
              暂无记录
            </div>
          ) : (
            <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="rounded-xl border border-slate-200 bg-white p-3 text-sm"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{new Date(record.printedAt).toLocaleString('zh-CN')}</span>
                    <span>{record.pageCount} 页</span>
                  </div>
                  <div className="mt-1 truncate text-xs text-slate-600">
                    {record.fileNames.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
