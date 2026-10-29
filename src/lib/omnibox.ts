import { normalizeUrl } from './sites.ts';

// Explicit addresses must pass the same safety checks as saved websites.
// Everything else is a web search; typing alone never contacts the provider.
export function resolveOmnibox(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  if (
    /^(?:[\w-]+\.)+[\w-]+(?::\d+)?(?:[/?#]|$)/i.test(value) &&
    !/\s/.test(value)
  ) {
    return normalizeUrl(`https://${value}`);
  }
  if (/^[a-z][a-z\d+.-]*:/i.test(value)) return normalizeUrl(value);
  return `https://www.google.com/search?q=${encodeURIComponent(value)}`;
}
