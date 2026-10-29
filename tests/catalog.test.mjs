import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  bundledCatalog,
  fetchCatalog,
  parseCatalog,
  readCatalog,
} from '../src/lib/catalog.ts';

test('catalog rejects unsafe destinations, duplicates, invalid schemas, and broken trails', () => {
  const invalid = [
    null,
    {},
    { ...bundledCatalog, schemaVersion: 2 },
    { ...bundledCatalog, sites: [] },
    {
      ...bundledCatalog,
      sites: [...bundledCatalog.sites, bundledCatalog.sites[0]],
    },
  ];
  for (const changes of [
    { url: 'javascript:alert(1)' },
    { url: 'https://user:secret@example.com/' },
    { url: 'https://example.com' },
    { category: 'My links' },
    { topics: [4] },
    { name: '' },
    { icon: null },
  ]) {
    invalid.push({
      ...bundledCatalog,
      sites: [{ ...bundledCatalog.sites[0], ...changes }],
    });
  }
  for (const changes of [
    { sites: ['missing'] },
    { sites: [4] },
    { sites: [] },
    { description: null },
  ]) {
    invalid.push({
      ...bundledCatalog,
      trails: [{ ...bundledCatalog.trails[0], ...changes }],
    });
  }
  invalid.push({
    ...bundledCatalog,
    trails: [bundledCatalog.trails[0], bundledCatalog.trails[0]],
  });
  for (const value of invalid) assert.equal(parseCatalog(value), null);
  assert.deepEqual(parseCatalog(bundledCatalog), bundledCatalog);
});

test('successful refresh caches the catalog without sending credentials or personal data', async () => {
  const storage = new Map([
    ['launchpad-links', 'personal'],
    ['launchpad-preferences', 'settings'],
  ]);
  globalThis.localStorage = {
    getItem: (key) => storage.get(key),
    setItem: (key, value) => storage.set(key, value),
  };
  assert.deepEqual(readCatalog(), bundledCatalog);
  const catalog = {
    ...bundledCatalog,
    sites: bundledCatalog.sites.map((site) => ({
      ...site,
      description: 'Updated description',
    })),
  };
  const result = await fetchCatalog(
    'https://example.com/api/v1/',
    async (url, options) => {
      assert.equal(url, 'https://example.com/api/v1/catalog');
      assert.equal(options.credentials, 'omit');
      assert.equal(options.body, undefined);
      assert.ok(options.signal instanceof AbortSignal);
      return Response.json(catalog);
    },
  );
  assert.deepEqual(result, catalog);
  assert.deepEqual(readCatalog(), catalog);
  for (const fetcher of [
    async () => {
      throw new Error('Offline');
    },
    async () => new Response('Unavailable', { status: 503 }),
    async () => Response.json({ schemaVersion: 99 }),
    async () => new Response('broken JSON'),
  ]) {
    await assert.rejects(fetchCatalog('https://example.com/api/v1', fetcher));
    assert.deepEqual(readCatalog(), catalog);
  }
  assert.equal(storage.get('launchpad-links'), 'personal');
  assert.equal(storage.get('launchpad-preferences'), 'settings');
  delete globalThis.localStorage;
});

test('blocked storage and corrupted caches still allow bundled and live catalogs', async () => {
  globalThis.localStorage = { getItem: () => '{bad' };
  assert.deepEqual(readCatalog(), bundledCatalog);
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      throw new Error('Storage unavailable');
    },
  });
  assert.deepEqual(readCatalog(), bundledCatalog);
  assert.deepEqual(
    await fetchCatalog('https://example.com/api/v1', async () =>
      Response.json(bundledCatalog),
    ),
    bundledCatalog,
  );
  delete globalThis.localStorage;
});
