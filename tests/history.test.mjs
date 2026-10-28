import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  historyLimit,
  readHistory,
  recordOpening,
  saveHistory,
} from '../src/lib/history.ts';

const site = {
  name: 'Example',
  url: 'https://example.com/path?q=hello#section',
};
function mockStorage(value) {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: { getItem: () => value },
  });
}

test('records unique destinations newest first and bounds history without mutating it', () => {
  const old = Array.from({ length: historyLimit }, (_, index) => ({
    name: `Site ${index}`,
    url: `https://example.com/${index}`,
    openedAt: index,
  }));
  const snapshot = structuredClone(old);
  const added = recordOpening(old, site, 100);
  assert.equal(added.length, historyLimit);
  assert.deepEqual(added[0], { ...site, openedAt: 100 });
  assert.deepEqual(old, snapshot);
  const reopened = recordOpening(added, old[10], 101);
  assert.deepEqual(reopened[0], { ...old[10], openedAt: 101 });
  assert.equal(reopened.filter((entry) => entry.url === old[10].url).length, 1);
  assert.deepEqual(reopened[1], added[0]);
});

test('restores safe normalized destinations, sorts timestamps, and deduplicates URLs', () => {
  mockStorage(
    JSON.stringify([
      { ...site, openedAt: 10 },
      { ...site, name: 'Renamed example', openedAt: 30 },
      { name: 'Other', url: 'other.example/path', openedAt: 20 },
      { ...site, url: 'javascript:alert(1)', openedAt: 40 },
      { ...site, url: 'https://user:secret@example.com/', openedAt: 40 },
      { ...site, openedAt: 'yesterday' },
      { ...site, openedAt: -1 },
      { ...site, openedAt: 1e30 },
      { ...site, name: '' },
      null,
    ]),
  );
  assert.deepEqual(readHistory(), [
    { ...site, name: 'Renamed example', openedAt: 30 },
    { name: 'Other', url: 'https://other.example/path', openedAt: 20 },
  ]);
  mockStorage(
    JSON.stringify(
      Array.from({ length: 70 }, (_, i) => ({
        ...site,
        url: `https://example.com/${i}`,
        openedAt: i,
      })),
    ),
  );
  assert.equal(readHistory().length, historyLimit);
  assert.equal(readHistory()[0].openedAt, 69);
  delete globalThis.localStorage;
});

test('persists history and clearing removes only its own storage key', () => {
  const storage = new Map([
    ['launchpad-links', 'my links'],
    ['launchpad-preferences', 'my settings'],
  ]);
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key) => storage.get(key),
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    },
  });
  const entries = recordOpening([], site, 10);
  assert.equal(saveHistory(entries), true);
  assert.deepEqual(readHistory(), entries);
  assert.equal(saveHistory([]), true);
  assert.deepEqual(
    [...storage],
    [
      ['launchpad-links', 'my links'],
      ['launchpad-preferences', 'my settings'],
    ],
  );
  assert.deepEqual(readHistory(), []);
  delete globalThis.localStorage;
});

test('handles corrupt, blocked, and full browser storage', () => {
  for (const value of ['{broken', '{}', 'null', 'false', '42']) {
    mockStorage(value);
    assert.deepEqual(readHistory(), []);
  }
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      throw new Error('Storage blocked');
    },
  });
  assert.deepEqual(readHistory(), []);
  assert.equal(saveHistory(recordOpening([], site)), false);
  assert.equal(saveHistory([]), false);
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      setItem() {
        throw new Error('Quota exceeded');
      },
    },
  });
  assert.equal(saveHistory(recordOpening([], site)), false);
  delete globalThis.localStorage;
});
