/**
 * 浏览器环境检测工具
 */

export function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /Android|iPhone|iPad|iPod|Mobile|Windows Phone|SymbianOS|BlackBerry/i.test(ua);
}

/**
 * 检测是否在 App 内置浏览器中（微信、QQ、微博、抖音等）
 * 这些浏览器对 blob URL、download 属性、window.print() 支持都很差
 */
export function isInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  return /micromessenger|qqbrowser|qq\/|weibo|douyin|bytedance|snssdk|baiduboxapp|ucbrowser|opera mini|alipay/i.test(ua);
}

export function isWeChatBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /micromessenger/i.test(navigator.userAgent.toLowerCase());
}

export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/**
 * 将 Blob 转为 data URL（base64）
 * data URL 自包含，跳转后仍可访问，适合移动端下载
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
