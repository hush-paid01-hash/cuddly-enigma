import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  defaultPreferences,
  moveFavorite,
  readPreferences,
  savePreferences,
} from '../src/lib/preferences.ts';

function mockStorage(value) {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: { getItem: () => value, setItem: () => {} },
  });
}

test('restores appearance and favorite order without changing existing links', () => {
  const preferences = {
    ...defaultPreferences,
    mode: 'dark',
    accent: '#12AbEF',
    favorites: ['youtube', 'custom', 'instagram'],
  };
  let stored;
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key) =>
        key === 'launchpad-preferences' ? stored : 'existing links',
      setItem: (key, value) => {
        assert.equal(key, 'launchpad-preferences');
        stored = value;
      },
    },
  });
  assert.equal(savePreferences(preferences), true);
  assert.deepEqual(readPreferences(), preferences);
  assert.equal(localStorage.getItem('launchpad-links'), 'existing links');
  delete globalThis.localStorage;
});

test('validates saved preferences independently and preserves an empty favorites list', () => {
  mockStorage(
    JSON.stringify({
      mode: 'invalid',
      accent: 'red; background: black',
      favorites: ['youtube', 3, null, 'youtube', 'instagram'],
    }),
  );
  assert.deepEqual(readPreferences(), {
    ...defaultPreferences,
    favorites: ['youtube', 'instagram'],
  });
  mockStorage(
    JSON.stringify({ mode: 'light', accent: '#ffffff', favorites: [] }),
  );
  assert.deepEqual(readPreferences(), {
    ...defaultPreferences,
    mode: 'light',
    accent: '#ffffff',
    favorites: [],
  });
  mockStorage(
    JSON.stringify({ mode: 'system', accent: '#000000', favorites: {} }),
  );
  assert.deepEqual(readPreferences(), {
    ...defaultPreferences,
    mode: 'system',
    accent: '#000000',
  });
  delete globalThis.localStorage;
});

test('handles corrupt preferences and unavailable or full browser storage', () => {
  for (const value of ['{bad', 'null', 'false', '42', '[]', '{}']) {
    mockStorage(value);
    assert.deepEqual(readPreferences(), defaultPreferences);
  }
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      throw new Error('Storage blocked');
    },
  });
  assert.deepEqual(readPreferences(), defaultPreferences);
  assert.equal(savePreferences(defaultPreferences), false);
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      setItem() {
        throw new Error('Quota exceeded');
      },
    },
  });
  assert.equal(savePreferences(defaultPreferences), false);
  delete globalThis.localStorage;
});

test('moves favorites in both directions without mutating or losing destinations', () => {
  const ids = Object.freeze(['instagram', 'youtube', 'custom']);
  assert.deepEqual(moveFavorite(ids, 'custom', -1), [
    'instagram',
    'custom',
    'youtube',
  ]);
  assert.deepEqual(moveFavorite(ids, 'instagram', 1), [
    'youtube',
    'instagram',
    'custom',
  ]);
  assert.deepEqual(ids, ['instagram', 'youtube', 'custom']);
  assert.deepEqual(moveFavorite(ids, 'instagram', -1), ids);
  assert.deepEqual(moveFavorite(ids, 'custom', 1), ids);
  assert.deepEqual(moveFavorite(ids, 'missing', 1), ids);
  assert.deepEqual(moveFavorite([], 'missing', -1), []);
});

test('migrates existing preferences and validates history and favorites visibility settings', () => {
  mockStorage(
    JSON.stringify({ mode: 'dark', accent: '#123456', favorites: ['custom'] }),
  );
  assert.deepEqual(readPreferences(), {
    ...defaultPreferences,
    mode: 'dark',
    accent: '#123456',
    favorites: ['custom'],
  });
  mockStorage(JSON.stringify({ rememberHistory: false, showFavorites: false }));
  assert.deepEqual(readPreferences(), {
    ...defaultPreferences,
    rememberHistory: false,
    showFavorites: false,
  });
  mockStorage(JSON.stringify({ rememberHistory: 'false', showFavorites: 0 }));
  assert.deepEqual(readPreferences(), defaultPreferences);
  delete globalThis.localStorage;
});
