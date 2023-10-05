/**
 * A wrapper around window.localStorage that silences errors and handles JSON
 * encoding/decoding.
 */
class SafeLocalStorage {
  setItem<T>(key: string, value: T) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {
      // ignore
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (_) {
      return null;
    }
  }

  removeItem(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (_) {
      // ignore
    }
  }
}

export const safeLocalStorage = new SafeLocalStorage();
