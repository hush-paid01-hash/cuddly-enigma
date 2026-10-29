import type { Site } from './sites';

export const trails = [
  {
    id: 'research',
    name: 'Research a question',
    description:
      'Get an overview → inspect the evidence → check the archives → write it up.',
    sites: ['wikipedia', 'our-world-in-data', 'internet-archive', 'overleaf'],
  },
  {
    id: 'create',
    name: 'Bring an idea to life',
    description:
      'Sketch the idea → find a typeface → edit your image → make it lighter.',
    sites: ['excalidraw', 'google-fonts', 'photopea', 'squoosh'],
  },
  {
    id: 'learn',
    name: 'Build a new skill',
    description:
      'Find a lesson → explore a course → practice coding → look up the details.',
    sites: ['khan-academy', 'mit-ocw', 'freecodecamp', 'mdn'],
  },
  {
    id: 'plan',
    name: 'Make a plan',
    description:
      'Break down a task → check the time → explore the map → sketch your plan.',
    sites: ['goblin-tools', 'time-and-date', 'openstreetmap', 'excalidraw'],
  },
] as const;

export function discoverSites(
  sites: Site[],
  category: string,
  query: string,
  trailId = '',
) {
  const trail = trails.find((item) => item.id === trailId);
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const candidates = trail
    ? trail.sites.flatMap((id) => sites.find((site) => site.id === id) ?? [])
    : sites;
  return candidates.filter((site) => {
    const text =
      `${site.name} ${site.url} ${site.description} ${site.category} ${site.topics?.join(' ') ?? ''}`.toLowerCase();
    return (
      (category === 'All websites' || category === site.category) &&
      terms.every((term) => text.includes(term))
    );
  });
}

export type QueueEntry = { siteId: string; note: string };
export const queueKey = 'hush-next-up-v5';
export const noteLimit = 240;

export function readQueue(): QueueEntry[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(queueKey) ?? '[]');
    if (!Array.isArray(raw)) return [];
    const ids = new Set<string>();
    return raw.flatMap((entry) => {
      if (
        !entry ||
        typeof entry.siteId !== 'string' ||
        !entry.siteId ||
        ids.has(entry.siteId) ||
        typeof entry.note !== 'string'
      )
        return [];
      ids.add(entry.siteId);
      return [{ siteId: entry.siteId, note: entry.note.slice(0, noteLimit) }];
    });
  } catch {
    return [];
  }
}

export function saveQueue(queue: QueueEntry[]): boolean {
  try {
    localStorage.setItem(queueKey, JSON.stringify(queue));
    return true;
  } catch {
    return false;
  }
}

export function toggleQueued(
  queue: QueueEntry[],
  siteId: string,
): QueueEntry[] {
  return queue.some((entry) => entry.siteId === siteId)
    ? queue.filter((entry) => entry.siteId !== siteId)
    : [...queue, { siteId, note: '' }];
}

export function updateQueueNote(
  queue: QueueEntry[],
  siteId: string,
  note: string,
): QueueEntry[] {
  return queue.map((entry) =>
    entry.siteId === siteId
      ? { ...entry, note: note.slice(0, noteLimit) }
      : entry,
  );
}

export function resolveQueue(queue: QueueEntry[], sites: Site[]) {
  return queue.flatMap((entry) => {
    const site = sites.find((item) => item.id === entry.siteId);
    return site ? [{ ...entry, site }] : [];
  });
}
