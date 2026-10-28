import { normalizeUrl } from './sites.ts';

export type HistoryEntry = {
  name: string;
  url: string;
  openedAt: number;
};

export const historyLimit = 50;
const storageKey = 'launchpad-history';

// One entry per destination, ordered by its most recent opening.
export function recordOpening(
  history: HistoryEntry[],
  site: Pick<HistoryEntry, 'name' | 'url'>,
  openedAt = Date.now(),
): HistoryEntry[] {
  return [
    { name: site.name, url: site.url, openedAt },
    ...history.filter((entry) => entry.url !== site.url),
  ].slice(0, historyLimit);
}

export function readHistory(): HistoryEntry[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    if (!Array.isArray(saved)) return [];
    const entries: HistoryEntry[] = [];
    for (const value of saved) {
      if (!value || typeof value !== 'object') continue;
      const entry = value as Record<string, unknown>;
      const url =
        typeof entry.url === 'string' ? normalizeUrl(entry.url) : null;
      if (
        !url ||
        typeof entry.name !== 'string' ||
        !entry.name.trim() ||
        typeof entry.openedAt !== 'number' ||
        !Number.isFinite(entry.openedAt) ||
        entry.openedAt < 0 ||
        entry.openedAt > Date.now()
      )
        continue;
      entries.push({ name: entry.name, url, openedAt: entry.openedAt });
    }
    const urls = new Set<string>();
    return entries
      .sort((a, b) => b.openedAt - a.openedAt)
      .filter((entry) => {
        if (urls.has(entry.url)) return false;
        urls.add(entry.url);
        return true;
      })
      .slice(0, historyLimit);
  } catch {
    return [];
  }
}

export function saveHistory(history: HistoryEntry[]): boolean {
  try {
    if (history.length === 0) localStorage.removeItem(storageKey);
    else localStorage.setItem(storageKey, JSON.stringify(history));
    return true;
  } catch {
    return false;
  }
}
