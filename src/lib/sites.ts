export type Site = {
  id: string;
  name: string;
  url: string;
  description: string;
  category: 'Social' | 'Entertainment' | 'Work' | 'My links';
  icon: string;
};

export const defaultSites: Site[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://www.instagram.com/',
    description: 'A little inspiration. A lot of connection.',
    category: 'Social',
    icon: 'instagram',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://www.facebook.com/',
    description: 'Keep up with the people who matter.',
    category: 'Social',
    icon: 'facebook',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com/',
    description: 'Press play on something you’ll love.',
    category: 'Entertainment',
    icon: 'youtube',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/',
    description: 'Big ideas. New connections. Next steps.',
    category: 'Work',
    icon: 'linkedin',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    url: 'https://www.pinterest.com/',
    description: 'Find an idea. Make it your own.',
    category: 'Social',
    icon: 'pinterest',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    url: 'https://www.reddit.com/',
    description: 'There’s a community for your curiosity.',
    category: 'Social',
    icon: 'reddit',
  },
];

export function normalizeUrl(value: string): string | null {
  try {
    const trimmed = value.trim();
    const url = new URL(
      /^[a-z][a-z\d+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`,
    );
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      !url.hostname.includes('.') ||
      url.username ||
      url.password
    )
      return null;
    return url.href;
  } catch {
    return null;
  }
}

export function readSavedSites(): Site[] {
  try {
    const saved: unknown = JSON.parse(
      localStorage.getItem('launchpad-links') ?? '[]',
    );
    if (!Array.isArray(saved)) return [];
    const ids = new Set(defaultSites.map((site) => site.id));
    return saved
      .filter((site): site is Site => {
        if (
          !site ||
          typeof site !== 'object' ||
          typeof site.id !== 'string' ||
          ids.has(site.id) ||
          typeof site.name !== 'string' ||
          !site.name.trim() ||
          typeof site.url !== 'string' ||
          !normalizeUrl(site.url) ||
          site.category !== 'My links'
        )
          return false;
        ids.add(site.id);
        return true;
      })
      .map((site) => ({
        ...site,
        url: normalizeUrl(site.url)!,
        description: 'Your own little corner of the internet.',
        icon: 'globe',
      }));
  } catch {
    return [];
  }
}
