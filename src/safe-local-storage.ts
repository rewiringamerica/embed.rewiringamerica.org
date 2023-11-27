/**
 * Augment this interface with a property whose name is the local storage key,
 * and whose type is the type of the values you will store under that key.
 *
 * declare module './safe-local-storage' {  // or however you import this
 *   interface SafeLocalStorageMap {
 *     'my-key': MyType
 *   }
 * }
 */
export interface SafeLocalStorageMap {}

/**
 * A wrapper around window.localStorage that silences errors and handles JSON
 * encoding/decoding.
 */
class SafeLocalStorage {
  setItem<T extends keyof SafeLocalStorageMap>(
    key: T,
    value: SafeLocalStorageMap[T],
  ) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {
      // ignore
    }
  }

  getItem<T extends keyof SafeLocalStorageMap>(
    key: T,
  ): SafeLocalStorageMap[T] | null {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (_) {
      return null;
    }
  }

  removeItem(key: keyof SafeLocalStorageMap) {
    try {
      localStorage.removeItem(key);
    } catch (_) {
      // ignore
    }
  }
}

export const safeLocalStorage = new SafeLocalStorage();
