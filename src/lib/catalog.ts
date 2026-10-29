import { defaultSites, normalizeUrl, type Site } from './sites.ts';
import { trails, type Trail } from './discovery.ts';

export const catalogCategories = [
  'Social',
  'Entertainment',
  'Work',
  'Learn',
  'Create',
  'Everyday',
] as const;

export type Catalog = {
  schemaVersion: 1;
  sites: Site[];
  trails: Trail[];
};

export const bundledCatalog: Catalog = {
  schemaVersion: 1,
  sites: defaultSites,
  trails,
};
const cacheKey = 'hush-catalog-v1';

// Validate remote and cached data before it can become a destination in the app.
export function parseCatalog(value: unknown): Catalog | null {
  if (!value || typeof value !== 'object') return null;
  const data = value as Record<string, unknown>;
  if (
    data.schemaVersion !== 1 ||
    !Array.isArray(data.sites) ||
    !data.sites.length ||
    data.sites.length > 500 ||
    !Array.isArray(data.trails) ||
    data.trails.length > 50
  )
    return null;
  const ids = new Set<string>();
  const text = (value: unknown): value is string =>
    typeof value === 'string' &&
    value.trim().length > 0 &&
    value.length <= 2000;
  const sites: Site[] = [];
  for (const raw of data.sites) {
    if (
      !raw ||
      !text(raw.id) ||
      ids.has(raw.id) ||
      !text(raw.name) ||
      !text(raw.description) ||
      !text(raw.icon) ||
      !text(raw.url) ||
      normalizeUrl(raw.url) !== raw.url ||
      !catalogCategories.includes(raw.category) ||
      (raw.topics !== undefined &&
        (!Array.isArray(raw.topics) ||
          raw.topics.length > 50 ||
          !raw.topics.every(text)))
    )
      return null;
    ids.add(raw.id);
    sites.push({
      id: raw.id,
      name: raw.name,
      description: raw.description,
      icon: raw.icon,
      url: raw.url,
      category: raw.category,
      ...(raw.topics ? { topics: raw.topics } : {}),
    });
  }
  const trailIds = new Set<string>();
  const parsedTrails: Trail[] = [];
  for (const raw of data.trails) {
    if (
      !raw ||
      !text(raw.id) ||
      trailIds.has(raw.id) ||
      !text(raw.name) ||
      !text(raw.description) ||
      !Array.isArray(raw.sites) ||
      !raw.sites.length ||
      raw.sites.length > 50 ||
      !raw.sites.every(
        (id: unknown) => typeof id === 'string' && ids.has(id),
      ) ||
      new Set(raw.sites).size !== raw.sites.length
    )
      return null;
    trailIds.add(raw.id);
    parsedTrails.push({
      id: raw.id,
      name: raw.name,
      description: raw.description,
      sites: raw.sites,
    });
  }
  return { schemaVersion: 1, sites, trails: parsedTrails };
}

export function readCatalog(): Catalog {
  try {
    return (
      parseCatalog(JSON.parse(localStorage.getItem(cacheKey) ?? 'null')) ??
      bundledCatalog
    );
  } catch {
    return bundledCatalog;
  }
}

export async function fetchCatalog(
  baseUrl: string,
  fetcher: typeof fetch = fetch,
): Promise<Catalog> {
  // AbortSignal.timeout is unavailable on older supported iOS versions.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetcher(`${baseUrl.replace(/\/$/, '')}/catalog`, {
      signal: controller.signal,
      credentials: 'omit',
    });
    if (!response.ok) throw new Error('Catalog unavailable');
    const catalog = parseCatalog(await response.json());
    if (!catalog) throw new Error('Invalid catalog');
    try {
      localStorage.setItem(cacheKey, JSON.stringify(catalog));
    } catch {
      // The bundled catalog remains available even when persistence is blocked.
    }
    return catalog;
  } finally {
    clearTimeout(timeout);
  }
}
