export type Site = {
  id: string;
  name: string;
  url: string;
  description: string;
  category:
    | 'Social'
    | 'Entertainment'
    | 'Work'
    | 'Learn'
    | 'Create'
    | 'Everyday'
    | 'My links';
  topics?: string[];
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
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    url: 'https://www.wikipedia.org/',
    description: 'Start with an overview, then follow the sources.',
    category: 'Learn',
    icon: 'globe',
    topics: ['research', 'reference', 'encyclopedia'],
  },
  {
    id: 'khan-academy',
    name: 'Khan Academy',
    url: 'https://www.khanacademy.org/',
    description: 'Practice math, science, and more with free lessons.',
    category: 'Learn',
    icon: 'globe',
    topics: ['study', 'courses', 'math', 'science'],
  },
  {
    id: 'mit-ocw',
    name: 'MIT OpenCourseWare',
    url: 'https://ocw.mit.edu/',
    description: 'Explore free university course materials at your pace.',
    category: 'Learn',
    icon: 'globe',
    topics: ['study', 'university', 'engineering', 'courses'],
  },
  {
    id: 'freecodecamp',
    name: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/',
    description: 'Learn to code with hands-on lessons and projects.',
    category: 'Learn',
    icon: 'globe',
    topics: ['programming', 'coding', 'practice'],
  },
  {
    id: 'mdn',
    name: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/',
    description: 'Look up web standards and practical code examples.',
    category: 'Learn',
    icon: 'globe',
    topics: ['programming', 'javascript', 'css', 'html', 'reference'],
  },
  {
    id: 'our-world-in-data',
    name: 'Our World in Data',
    url: 'https://ourworldindata.org/',
    description: 'Explore global questions through charts and research.',
    category: 'Learn',
    icon: 'globe',
    topics: ['research', 'statistics', 'evidence', 'charts'],
  },
  {
    id: 'gutenberg',
    name: 'Project Gutenberg',
    url: 'https://www.gutenberg.org/',
    description: 'Read and download free public-domain ebooks.',
    category: 'Entertainment',
    icon: 'globe',
    topics: ['books', 'reading', 'literature'],
  },
  {
    id: 'radio-garden',
    name: 'Radio Garden',
    url: 'https://radio.garden/',
    description: 'Spin the globe and listen to live radio stations.',
    category: 'Entertainment',
    icon: 'globe',
    topics: ['music', 'audio', 'travel'],
  },
  {
    id: 'nasa',
    name: 'NASA',
    url: 'https://www.nasa.gov/',
    description: 'Explore space missions, science, and new discoveries.',
    category: 'Entertainment',
    icon: 'globe',
    topics: ['space', 'science', 'inspiration'],
  },
  {
    id: 'internet-archive',
    name: 'Internet Archive',
    url: 'https://archive.org/',
    description: 'Explore a digital library of books, audio, and history.',
    category: 'Learn',
    icon: 'globe',
    topics: ['research', 'archives', 'books', 'media'],
  },
  {
    id: 'photopea',
    name: 'Photopea',
    url: 'https://www.photopea.com/',
    description: 'Edit images and layered design files in your browser.',
    category: 'Create',
    icon: 'globe',
    topics: ['photo', 'image', 'design', 'editor'],
  },
  {
    id: 'excalidraw',
    name: 'Excalidraw',
    url: 'https://excalidraw.com/',
    description: 'Sketch a diagram and make your next idea clearer.',
    category: 'Create',
    icon: 'globe',
    topics: ['diagram', 'whiteboard', 'planning', 'drawing'],
  },
  {
    id: 'squoosh',
    name: 'Squoosh',
    url: 'https://squoosh.app/',
    description: 'Compress images and compare the results side by side.',
    category: 'Create',
    icon: 'globe',
    topics: ['image', 'optimize', 'compression'],
  },
  {
    id: 'coolors',
    name: 'Coolors',
    url: 'https://coolors.co/',
    description: 'Explore color palettes for your next creative project.',
    category: 'Create',
    icon: 'globe',
    topics: ['color', 'design', 'palette', 'inspiration'],
  },
  {
    id: 'unsplash',
    name: 'Unsplash',
    url: 'https://unsplash.com/',
    description: 'Find photography for your next idea; check each license.',
    category: 'Create',
    icon: 'globe',
    topics: ['photos', 'design', 'inspiration'],
  },
  {
    id: 'google-fonts',
    name: 'Google Fonts',
    url: 'https://fonts.google.com/',
    description: 'Find open-source typefaces and preview your words.',
    category: 'Create',
    icon: 'globe',
    topics: ['typography', 'design', 'fonts'],
  },
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com/',
    description: 'Explore open-source projects and build together.',
    category: 'Work',
    icon: 'globe',
    topics: ['programming', 'code', 'collaboration'],
  },
  {
    id: 'stack-overflow',
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com/',
    description: 'Find community answers to programming questions.',
    category: 'Work',
    icon: 'globe',
    topics: ['programming', 'code', 'troubleshooting'],
  },
  {
    id: 'overleaf',
    name: 'Overleaf',
    url: 'https://www.overleaf.com/',
    description: 'Write research papers and documents with LaTeX.',
    category: 'Work',
    icon: 'globe',
    topics: ['writing', 'research', 'documents', 'latex'],
  },
  {
    id: 'goblin-tools',
    name: 'Goblin.tools',
    url: 'https://goblin.tools/',
    description: 'Break a task into smaller, more manageable steps.',
    category: 'Work',
    icon: 'globe',
    topics: ['planning', 'tasks', 'productivity'],
  },
  {
    id: 'openstreetmap',
    name: 'OpenStreetMap',
    url: 'https://www.openstreetmap.org/',
    description: 'Explore a map built by a worldwide community.',
    category: 'Everyday',
    icon: 'globe',
    topics: ['maps', 'travel', 'directions'],
  },
  {
    id: 'time-and-date',
    name: 'Time and Date',
    url: 'https://www.timeanddate.com/',
    description: 'Plan across time zones and check world clocks.',
    category: 'Everyday',
    icon: 'globe',
    topics: ['time', 'timezone', 'calendar', 'planning'],
  },
  {
    id: 'ilovepdf',
    name: 'iLovePDF',
    url: 'https://www.ilovepdf.com/',
    description: 'Merge, split, and convert PDFs; review upload privacy.',
    category: 'Everyday',
    icon: 'globe',
    topics: ['documents', 'pdf', 'tools'],
  },
  {
    id: 'standard-ebooks',
    name: 'Standard Ebooks',
    url: 'https://standardebooks.org/',
    description: 'Discover carefully formatted public-domain ebooks.',
    category: 'Entertainment',
    icon: 'globe',
    topics: ['books', 'reading', 'literature'],
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
