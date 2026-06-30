import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Polyfill Map/WeakMap.getOrInsertComputed for older browsers / integrated
// environments that ship a Chromium version without this stage-3 method.
// pdf.js 6.x uses it at runtime when parsing complex PDFs.
if (typeof Map !== 'undefined' && !('getOrInsertComputed' in Map.prototype)) {
  Object.defineProperty(Map.prototype, 'getOrInsertComputed', {
    value: function getOrInsertComputed<K, V>(
      this: Map<K, V>,
      key: K,
      callbackfn: (key: K, map: Map<K, V>) => V,
    ): V {
      if (!this.has(key)) {
        this.set(key, callbackfn(key, this));
      }
      return this.get(key) as V;
    },
    configurable: true,
    writable: true,
  });
}

if (typeof WeakMap !== 'undefined' && !('getOrInsertComputed' in WeakMap.prototype)) {
  Object.defineProperty(WeakMap.prototype, 'getOrInsertComputed', {
    value: function getOrInsertComputed<K extends object, V>(
      this: WeakMap<K, V>,
      key: K,
      callbackfn: (key: K, map: WeakMap<K, V>) => V,
    ): V {
      if (!this.has(key)) {
        this.set(key, callbackfn(key, this));
      }
      return this.get(key) as V;
    },
    configurable: true,
    writable: true,
  });
}

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export { pdfjsLib };
