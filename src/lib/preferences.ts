export type ThemeMode = 'light' | 'dark' | 'system';
export type Preferences = {
  mode: ThemeMode;
  accent: string;
  favorites: string[];
};

export const defaultPreferences: Preferences = {
  mode: 'system',
  accent: '#9b83db',
  favorites: ['instagram', 'youtube', 'linkedin'],
};

export const accentColors = [
  { name: 'Lavender', value: '#9b83db' },
  { name: 'Sage', value: '#8bad76' },
  { name: 'Ocean', value: '#639ee0' },
  { name: 'Rose', value: '#d5819c' },
  { name: 'Amber', value: '#d5a44e' },
];

export function readPreferences(): Preferences {
  try {
    const saved: unknown = JSON.parse(
      localStorage.getItem('launchpad-preferences') ?? 'null',
    );
    if (!saved || typeof saved !== 'object') return { ...defaultPreferences };
    const values = saved as Record<string, unknown>;
    return {
      mode: ['light', 'dark', 'system'].includes(values.mode as string)
        ? (values.mode as ThemeMode)
        : defaultPreferences.mode,
      accent:
        typeof values.accent === 'string' &&
        /^#[\da-f]{6}$/i.test(values.accent)
          ? values.accent
          : defaultPreferences.accent,
      favorites: Array.isArray(values.favorites)
        ? [
            ...new Set(
              values.favorites.filter(
                (id): id is string => typeof id === 'string',
              ),
            ),
          ]
        : [...defaultPreferences.favorites],
    };
  } catch {
    return { ...defaultPreferences };
  }
}

export function savePreferences(preferences: Preferences): boolean {
  try {
    localStorage.setItem('launchpad-preferences', JSON.stringify(preferences));
    return true;
  } catch {
    return false;
  }
}

// IDs remain stable while the same item moves, so its focused button stays mounted.
export function moveFavorite(
  ids: string[],
  id: string,
  direction: -1 | 1,
): string[] {
  const index = ids.indexOf(id);
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= ids.length) return ids;
  const next = [...ids];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  return next;
}
