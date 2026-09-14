/**
 * Storage Service - Layer trừu tượng hóa lưu trữ dữ liệu
 * Hiện tại sử dụng LocalStorage để đảm bảo F5 không mất dữ liệu và chạy offline/preview không cần API key.
 * Sau này chuyển sang Firestore chỉ cần thay thế các hàm trong service này.
 */

const STORAGE_PREFIX = 'ditichviet_';

export const storageService = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`Lỗi đọc localStorage key [${key}]:`, error);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    } catch (error) {
      console.error(`Lỗi ghi localStorage key [${key}]:`, error);
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (error) {
      console.error(`Lỗi xóa localStorage key [${key}]:`, error);
    }
  },

  clearAll(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && typeof key === 'string' && key.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (error) {
      console.error('Lỗi dọn dẹp localStorage:', error);
    }
  }
};
