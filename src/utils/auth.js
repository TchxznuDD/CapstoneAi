export const DEFAULT_ADMIN_PASSWORD = 'admin';
export const STORAGE_KEY_ADMIN_PASSWORD = 'BFRIS_ADMIN_PASSWORD';
export const DEFAULT_JUNIOR_PASSWORD = 'junior';
export const STORAGE_KEY_JUNIOR_PASSWORD = 'BFRIS_JUNIOR_PASSWORD';

export function getAdminPassword() {
  try {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(STORAGE_KEY_ADMIN_PASSWORD);
      if (stored && typeof stored === 'string' && stored.trim()) return stored;
    }
  } catch (_) {
    // ignore
  }
  return DEFAULT_ADMIN_PASSWORD;
}

export function setAdminPassword(value) {
  try {
    const v = (value || '').trim();
    if (!v) {
      // if cleared, fall back to default behavior
      window.localStorage.removeItem(STORAGE_KEY_ADMIN_PASSWORD);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY_ADMIN_PASSWORD, v);
  } catch (_) {
    // ignore
  }
}

export function getJuniorPassword() {
  try {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(STORAGE_KEY_JUNIOR_PASSWORD);
      if (stored && typeof stored === 'string' && stored.trim()) return stored;
    }
  } catch (_) {}
  return DEFAULT_JUNIOR_PASSWORD;
}

export function setJuniorPassword(value) {
  try {
    const v = (value || '').trim();
    if (!v) {
      window.localStorage.removeItem(STORAGE_KEY_JUNIOR_PASSWORD);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY_JUNIOR_PASSWORD, v);
  } catch (_) {}
}
