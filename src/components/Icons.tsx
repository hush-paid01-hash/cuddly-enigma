import type { ReactNode } from 'react';

export function Icon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    home: (
      <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />
    ),
    history: (
      <>
        <path d="M3 11a9 9 0 1 1 2.6 7M3 4v7h7" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    settings: (
      <>
        <path d="M4 7h16M4 17h16" />
        <circle cx="9" cy="7" r="3" fill="var(--surface)" />
        <circle cx="15" cy="17" r="3" fill="var(--surface)" />
      </>
    ),
    star: (
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" />
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
      </>
    ),
    moon: <path d="M20.5 13A9 9 0 0 1 11 3.5 9 9 0 1 0 20.5 13Z" />,
    monitor: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M8 21h8m-4-4v4" />
      </>
    ),
    palette: (
      <>
        <circle cx="8" cy="10" r=".6" />
        <circle cx="12" cy="7" r=".6" />
        <circle cx="16" cy="10" r=".6" />
        <path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1-3.7 1.5 1.5 0 0 1 .7-2.8H18c5 0 4-11.5-6-11.5Z" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    reorder: (
      <>
        <path d="M8 6h13M8 12h13M8 18h13" />
        <circle cx="3" cy="6" r=".5" />
        <circle cx="3" cy="12" r=".5" />
        <circle cx="3" cy="18" r=".5" />
      </>
    ),
    left: <path d="m14 6-6 6 6 6" />,
    right: <path d="m10 6 6 6-6 6" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    external: (
      <>
        <path d="M8 5H5v14h14v-3M11 5h8v8M10 14l9-9" />
      </>
    ),
    grid: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </>
    ),
    people: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v2" />
      </>
    ),
    play: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="4" />
        <path d="m10 9 5 3-5 3Z" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V4h8v3M3 12a23 23 0 0 0 18 0M12 12v4" />
      </>
    ),
    link: (
      <>
        <path d="m10 14 4-4M8 16l-1 1a3.5 3.5 0 0 1-5-5l4-4a3.5 3.5 0 0 1 5 0m2 8a3.5 3.5 0 0 0 5 0l4-4a3.5 3.5 0 0 0-5-5l-1 1" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4 4" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    spark: (
      <path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z" />
    ),
  };
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths.globe}
    </svg>
  );
}

export function PlatformIcon({ name }: { name: string }) {
  if (name === 'instagram')
    return (
      <svg
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        aria-hidden="true"
      >
        <rect x="5" y="5" width="22" height="22" rx="7" />
        <circle cx="16" cy="16" r="5" />
        <circle cx="23" cy="9" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    );
  if (name === 'facebook')
    return (
      <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M19 30V18h4l.7-5H19V10c0-1.4.4-2.5 2.5-2.5H24V3.2A29 29 0 0 0 20.3 3C16.6 3 14 5.3 14 9.5V13h-4v5h4v12Z" />
      </svg>
    );
  if (name === 'youtube')
    return (
      <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M29 9c-.3-1.7-1.5-3-3.2-3.3C23.3 5 16 5 16 5s-7.3 0-9.8.7C4.5 6 3.3 7.3 3 9c-.6 2.4-.6 7-.6 7s0 4.6.6 7c.3 1.7 1.5 3 3.2 3.3C8.7 27 16 27 16 27s7.3 0 9.8-.7c1.7-.3 2.9-1.6 3.2-3.3.6-2.4.6-7 .6-7s0-4.6-.6-7Z" />
        <path d="m13 11 8 5-8 5Z" fill="var(--icon-cutout, white)" />
      </svg>
    );
  if (name === 'linkedin')
    return (
      <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <circle cx="7" cy="7" r="3" />
        <path d="M4.5 12H10v16H4.5zm9 0H19v2c1-1.5 2.5-2.5 4.5-2.5 4 0 5 2.5 5 6.5v10H23V19c0-2-.5-3-2-3s-2 1-2 3v9h-5.5Z" />
      </svg>
    );
  if (name === 'pinterest')
    return (
      <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M16 2a14 14 0 0 0-5 27c0-2 .5-4 1-6l2-9s-.5-1-.5-2c0-2 1-3.5 2.5-3.5 1.3 0 2 1 2 2.3 0 1.4-1 3.7-1.5 5.7-.4 1.7.9 3 2.5 3 3 0 5-4 5-8 0-3.5-2.5-6-6.5-6-4.5 0-7.5 3.5-7.5 7 0 1.5.5 3 1.5 4 .3.3.3.4.2.8l-.5 2c-.1.4-.4.5-.8.3C8 18.5 6.5 16 6.5 12.5 6.5 7 10.5 3.5 17 3.5c5.5 0 9.5 4 9.5 9 0 6-3.5 10-8 10-1.8 0-3.5-1-4-2l-1 4c-.5 2-1.5 4-2.5 5A14 14 0 1 0 16 2Z" />
      </svg>
    );
  if (name === 'reddit')
    return (
      <svg
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <ellipse cx="16" cy="19" rx="12" ry="8" />
        <path d="m16 11 2-7 7 2M10 23q6 4 12 0M4 18a4 4 0 1 1 3-6m21 6a4 4 0 1 0-3-6" />
        <circle cx="27" cy="6" r="2.5" />
        <circle cx="11" cy="18" r="1.7" fill="currentColor" stroke="none" />
        <circle cx="21" cy="18" r="1.7" fill="currentColor" stroke="none" />
      </svg>
    );
  return <Icon name="globe" />;
}
