import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

function installMapPolyfills() {
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
}

function polyfillRandomUUID() {
  if (typeof globalThis === 'undefined' || !globalThis.crypto) {
    return;
  }
  if (typeof globalThis.crypto.randomUUID === 'function') {
    return;
  }
  const cryptoObj = globalThis.crypto;
  Object.defineProperty(cryptoObj, 'randomUUID', {
    value: function randomUUID(): string {
      const bytes = new Uint8Array(16);
      cryptoObj.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
      return (
        hex.slice(0, 4).join('') +
        '-' +
        hex.slice(4, 6).join('') +
        '-' +
        hex.slice(6, 8).join('') +
        '-' +
        hex.slice(8, 10).join('') +
        '-' +
        hex.slice(10, 16).join('')
      );
    },
    configurable: true,
    writable: true,
  });
}

export function installCryptoPolyfills(): void {
  installMapPolyfills();
  polyfillRandomUUID();
}

// pdf.js 6.x calls crypto.randomUUID() during PDF parsing; some embedded
// Chromium environments ship crypto.getRandomValues but not
// crypto.randomUUID. We install polyfills as a module side effect so any
// import of this file (directly or transitively via pdfRenderer) gets
// the fix before the first PDF is parsed.
installCryptoPolyfills();

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export { pdfjsLib };
