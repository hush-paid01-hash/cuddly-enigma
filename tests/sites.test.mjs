import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  defaultSites,
  normalizeUrl,
  readSavedSites,
} from '../src/lib/sites.ts';

test('default destinations point to real HTTPS sites', () => {
  assert.equal(
    defaultSites.find((site) => site.id === 'instagram').url,
    'https://www.instagram.com/',
  );
  assert.equal(
    defaultSites.find((site) => site.id === 'facebook').url,
    'https://www.facebook.com/',
  );
  for (const site of defaultSites)
    assert.equal(new URL(site.url).protocol, 'https:');
});

test('normalizes website addresses and preserves paths, queries, and fragments', () => {
  assert.equal(
    normalizeUrl(' example.com/article?q=hello#section '),
    'https://example.com/article?q=hello#section',
  );
  assert.equal(normalizeUrl('http://example.com/'), 'http://example.com/');
});

test('rejects executable schemes, credentials, and invalid addresses', () => {
  for (const input of [
    '',
    'not a website',
    'javascript:alert(1)',
    'data:text/html,test',
    'ftp://example.com',
    'https://',
    'https://user:password@example.com',
  ]) {
    assert.equal(normalizeUrl(input), null, input);
  }
});

test('restores only valid custom links and rejects corrupt storage', () => {
  const saved = {
    id: 'custom',
    name: 'Example',
    url: 'example.com/path',
    category: 'My links',
  };
  let contents = JSON.stringify([
    saved,
    saved,
    { ...saved, id: 'instagram' },
    { ...saved, id: 'unsafe', url: 'javascript:alert(1)' },
    null,
  ]);
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: { getItem: () => contents },
  });
  const restored = readSavedSites();
  assert.equal(restored.length, 1);
  assert.equal(restored[0].url, 'https://example.com/path');
  assert.equal(restored[0].icon, 'globe');
  for (const invalid of ['{broken', '{}', 'null']) {
    contents = invalid;
    assert.deepEqual(readSavedSites(), []);
  }
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      throw new Error('Storage unavailable');
    },
  });
  assert.deepEqual(readSavedSites(), []);
  delete globalThis.localStorage;
});
