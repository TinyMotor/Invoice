import { useRef, useState, useCallback } from 'react';
import { Upload, FileWarning, X, ShieldCheck } from 'lucide-react';
import { usePdfPages } from '@/hooks/usePdfPages';
import type { FileValidationError } from '@/types';
import { cn } from '@/lib/utils';

export function PdfUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadFiles } = usePdfPages();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ fileName: string; current: number; total: number } | null>(null);
  const [errors, setErrors] = useState<FileValidationError[]>([]);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      setErrors([]);
      setUploading(true);
      try {
        const result = await uploadFiles(files, (fileName, current, total) => {
          setProgress({ fileName, current, total });
        });
        if (result.errors.length > 0) {
          setErrors(result.errors);
        }
      } finally {
        setUploading(false);
        setProgress(null);
        if (inputRef.current) inputRef.current.value = '';
      }
    },
    [uploadFiles],
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-2 rounded-lg border border-emerald-100 bg-emerald-50/80 px-3 py-2 text-xs text-emerald-700">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <div className="leading-relaxed">
          <span className="font-semibold">纯前端工具，隐私无忧</span>
          <span className="ml-1 text-emerald-600">所有文件仅在浏览器本地处理，不会上传至服务器。</span>
        </div>
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          'relative cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition-all',
          isDragging
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/30',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <Upload className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium text-slate-700">
          {uploading ? '正在渲染 PDF…' : '点击或拖拽上传 PDF 发票'}
        </p>
        <p className="mt-1 text-xs text-slate-500">支持多文件，单个不超过 20MB</p>

        {uploading && progress && (
          <div className="mt-3">
            <div className="mb-1 text-xs text-slate-600">
              {progress.fileName}：{progress.current} / {progress.total} 页
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((err, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700"
            >
              <FileWarning className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <div className="flex-1">
                <span className="font-medium">{err.fileName}</span>
                <span className="ml-1">{err.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrors((prev) => prev.filter((_, i) => i !== idx))}
                className="shrink-0 text-rose-400 hover:text-rose-600"
                aria-label="关闭"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
