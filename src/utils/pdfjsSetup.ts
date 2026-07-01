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

function polyfillUint8ArrayHelpers() {
  if (typeof Uint8Array === 'undefined') return;

  const proto = Uint8Array.prototype as unknown as Record<string, unknown>;
  const ctor = Uint8Array as unknown as Record<string, unknown>;

  if (typeof proto.toHex !== 'function') {
    Object.defineProperty(Uint8Array.prototype, 'toHex', {
      value: function toHex(this: Uint8Array): string {
        let out = '';
        for (let i = 0; i < this.length; i++) {
          out += this[i].toString(16).padStart(2, '0');
        }
        return out;
      },
      configurable: true,
      writable: true,
    });
  }

  if (typeof ctor.fromHex !== 'function') {
    Object.defineProperty(Uint8Array, 'fromHex', {
      value: function fromHex(hex: string): Uint8Array {
        const clean = hex.replace(/\s+/g, '');
        if (clean.length % 2 !== 0) {
          throw new SyntaxError('Input string has odd length');
        }
        const bytes = new Uint8Array(clean.length / 2);
        for (let i = 0; i < bytes.length; i++) {
          const b = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
          if (Number.isNaN(b)) {
            throw new SyntaxError('Input string has invalid hex characters');
          }
          bytes[i] = b;
        }
        return bytes;
      },
      configurable: true,
      writable: true,
    });
  }

  if (typeof proto.toBase64 !== 'function') {
    Object.defineProperty(Uint8Array.prototype, 'toBase64', {
      value: function toBase64(this: Uint8Array): string {
        let binary = '';
        for (let i = 0; i < this.length; i++) {
          binary += String.fromCharCode(this[i]);
        }
        return btoa(binary);
      },
      configurable: true,
      writable: true,
    });
  }

  if (typeof ctor.fromBase64 !== 'function') {
    Object.defineProperty(Uint8Array, 'fromBase64', {
      value: function fromBase64(b64: string): Uint8Array {
        const binary = atob(b64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
      },
      configurable: true,
      writable: true,
    });
  }
}

export function installCryptoPolyfills(): void {
  installMapPolyfills();
  polyfillRandomUUID();
  polyfillUint8ArrayHelpers();
}

// pdf.js 6.x calls crypto.randomUUID() during PDF parsing; some embedded
// Chromium environments ship crypto.getRandomValues but not
// crypto.randomUUID. We install polyfills as a module side effect so any
// import of this file (directly or transitively via pdfRenderer) gets
// the fix before the first PDF is parsed.
installCryptoPolyfills();

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export { pdfjsLib };
