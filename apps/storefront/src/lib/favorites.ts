// The customer's favourites (FK-37), kept on her phone like her contact details:
// no account, nothing stored in Medusa. Only product handles are kept, prices and
// stock are always read from Medusa. Storage may be unavailable (private browsing,
// blocked site data): every access is guarded and the shop works without it.

const KEY = "fk_favorites";
const MAX = 50;
export const FAVORITES_EVENT = "fk:favorites-updated";

export function loadFavorites(): string[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((h): h is string => typeof h === "string").slice(0, MAX) : [];
  } catch {
    return [];
  }
}

/** Saves the list. Returns false when the phone refuses (the heart then promises nothing). */
function saveFavorites(handles: string[]): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(handles.slice(0, MAX)));
    window.dispatchEvent(new CustomEvent(FAVORITES_EVENT, { detail: handles }));
    return true;
  } catch {
    return false;
  }
}

/** Adds or removes a product. Returns the new state, or null when it could not be saved. */
export function toggleFavorite(handle: string): boolean | null {
  const current = loadFavorites();
  const isFavorite = current.includes(handle);
  const next = isFavorite ? current.filter((h) => h !== handle) : [handle, ...current];
  return saveFavorites(next) ? !isFavorite : null;
}

export function removeFavorite(handle: string): void {
  saveFavorites(loadFavorites().filter((h) => h !== handle));
}
