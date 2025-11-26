export const DEFAULT_PASSKEY = 'FATIMA-ADMIN-ONLY';
export const STORAGE_KEY = 'BFRIS_ADMIN_PASSKEY';

export function getDeletePasskey() {
  try {
    if (typeof window !== 'undefined') {
      const runtime = window.__BFRIS_DELETE_PASSKEY;
      if (runtime && typeof runtime === 'string' && runtime.trim()) return runtime.trim();
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && typeof stored === 'string' && stored.trim()) return stored.trim();
    }
  } catch (_) {
    // ignore
  }
  return DEFAULT_PASSKEY;
}

export function setDeletePasskey(value) {
  try {
    const v = (value || '').trim();
    if (!v) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, v);
  } catch (_) {
    // ignore
  }
}

export function resetDeletePasskey() {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch (_) {
    // ignore
  }
}
