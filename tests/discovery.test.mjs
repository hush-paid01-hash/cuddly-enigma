import assert from 'node:assert/strict';
import { test } from 'node:test';
import { defaultSites } from '../src/lib/sites.ts';
import {
  discoverSites,
  trails,
  readQueue,
  saveQueue,
  toggleQueued,
  updateQueueNote,
  resolveQueue,
  queueKey,
  noteLimit,
} from '../src/lib/discovery.ts';

test('expanded catalog has unique safe destinations and complete ordered trails', () => {
  assert.equal(defaultSites.length, 30);
  assert.equal(new Set(defaultSites.map((site) => site.id)).size, 30);
  assert.equal(new Set(defaultSites.map((site) => site.url)).size, 30);
  for (const site of defaultSites) {
    const url = new URL(site.url);
    assert.equal(url.protocol, 'https:');
    assert.equal(url.username, '');
    assert.ok(site.description.trim());
  }
  for (const trail of trails) {
    assert.deepEqual(
      discoverSites(defaultSites, 'All websites', '', trail.id).map(
        (site) => site.id,
      ),
      [...trail.sites],
    );
  }
});

test('search matches all topic words, descriptions, URLs, categories, and personal links', () => {
  assert.ok(
    discoverSites(defaultSites, 'All websites', '  CODING practice ').some(
      (site) => site.id === 'freecodecamp',
    ),
  );
  assert.ok(
    discoverSites(defaultSites, 'All websites', 'layered').some(
      (site) => site.id === 'photopea',
    ),
  );
  assert.deepEqual(discoverSites(defaultSites, 'Learn', 'photopea'), []);
  assert.deepEqual(
    discoverSites(defaultSites, 'All websites', 'photopea', 'research'),
    [],
  );
  assert.equal(
    discoverSites(defaultSites, 'All websites', 'squoosh.app')[0].id,
    'squoosh',
  );
  const custom = {
    id: 'custom',
    name: 'My notebook',
    url: 'https://example.com/',
    description: 'Personal notes',
    category: 'My links',
    icon: 'globe',
  };
  assert.deepEqual(
    discoverSites([...defaultSites, custom], 'My links', 'notebook'),
    [custom],
  );
  assert.deepEqual(
    discoverSites(defaultSites, 'All websites', 'no-such-destination'),
    [],
  );
});

test('queue preserves insertion order and notes, supports finishing and re-adding, and resolves live sites', () => {
  const original = Object.freeze([
    { siteId: 'wikipedia', note: 'Read the sources' },
  ]);
  const added = toggleQueued(original, 'photopea');
  const noted = updateQueueNote(added, 'photopea', 'Edit my sketch');
  assert.deepEqual(original, [
    { siteId: 'wikipedia', note: 'Read the sources' },
  ]);
  assert.equal(noted[1].note, 'Edit my sketch');
  assert.equal(added[1].note, '');
  assert.equal(
    updateQueueNote(noted, 'photopea', 'a'.repeat(400))[1].note.length,
    noteLimit,
  );
  const finished = toggleQueued(noted, 'wikipedia');
  assert.deepEqual(finished, [{ siteId: 'photopea', note: 'Edit my sketch' }]);
  assert.equal(toggleQueued(finished, 'wikipedia')[1].note, '');
  assert.deepEqual(
    resolveQueue([...noted, { siteId: 'deleted', note: '' }], defaultSites).map(
      ({ site }) => site.id,
    ),
    ['wikipedia', 'photopea'],
  );
});

test('queue persists separately, validates saved data, and handles unavailable storage', () => {
  const storage = new Map([
    ['launchpad-links', 'untouched'],
    ['launchpad-preferences', 'untouched'],
    ['hush-history', 'untouched'],
  ]);
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key) => storage.get(key),
      setItem: (key, value) => storage.set(key, value),
    },
  });
  const queue = [{ siteId: 'wikipedia', note: 'Check references' }];
  assert.equal(saveQueue(queue), true);
  assert.deepEqual(readQueue(), queue);
  assert.equal(storage.get('launchpad-links'), 'untouched');
  assert.equal(storage.get('launchpad-preferences'), 'untouched');
  storage.set(
    queueKey,
    JSON.stringify([
      null,
      {},
      { siteId: 4, note: '' },
      ...queue,
      ...queue,
      { siteId: 'other', note: 'a'.repeat(400) },
    ]),
  );
  assert.equal(readQueue().length, 2);
  assert.equal(readQueue()[1].note.length, noteLimit);
  for (const invalid of ['null', 'false', '{}', '{broken']) {
    storage.set(queueKey, invalid);
    assert.deepEqual(readQueue(), []);
  }
  assert.equal(saveQueue([]), true);
  assert.deepEqual(readQueue(), []);
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      throw new Error('Storage blocked');
    },
  });
  assert.deepEqual(readQueue(), []);
  assert.equal(saveQueue(queue), false);
  delete globalThis.localStorage;
});
