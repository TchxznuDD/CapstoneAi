export const STORAGE_KEY_DARK_MODE = 'BFRIS_DARK_MODE';

export function getDarkMode() {
  try {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(STORAGE_KEY_DARK_MODE);
      if (stored === 'true') return true;
      if (stored === 'false') return false;
    }
  } catch (_) {}
  return false; // default light mode
}

export function setDarkMode(enabled) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY_DARK_MODE, enabled ? 'true' : 'false');
      applyDarkMode(enabled);
    }
  } catch (_) {}
}

export function applyDarkMode(enabled) {
  if (typeof document !== 'undefined') {
    if (enabled) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }
}
