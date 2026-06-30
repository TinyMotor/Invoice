import type { FileValidationError } from '@/types';
import {
  MAX_FILE_SIZE_MB,
  MAX_PAGES_PER_FILE,
  MAX_TOTAL_PAGES,
} from './constants';

export function validatePdfFile(
  file: File,
  _: number,
): FileValidationError | null {
  if (file.type !== 'application/pdf') {
    return { fileName: file.name, message: '仅支持 PDF 文件' };
  }

  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return { fileName: file.name, message: `文件大小不能超过 ${MAX_FILE_SIZE_MB}MB` };
  }

  return null;
}

export function validatePageCount(
  fileName: string,
  pageCount: number,
  currentTotalPages: number,
): FileValidationError | null {
  if (pageCount > MAX_PAGES_PER_FILE) {
    return {
      fileName: fileName,
      message: `单个文件不能超过 ${MAX_PAGES_PER_FILE} 页`,
    };
  }

  if (currentTotalPages + pageCount > MAX_TOTAL_PAGES) {
    return {
      fileName: fileName,
      message: `总页数不能超过 ${MAX_TOTAL_PAGES} 页`,
    };
  }

  return null;
}
