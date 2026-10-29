import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  focusKey,
  scratchpadKey,
  scratchpadLimit,
  freshSession,
  remainingSeconds,
  toggleSession,
  readFocus,
  readScratchpad,
  saveTool,
} from '../src/lib/tools.ts';

test('focus uses a deadline across suspension, pause, resume, completion, and restart', () => {
  const ready = freshSession(5);
  const started = toggleSession(ready, 1000);
  assert.equal(started.endsAt, 301000);
  assert.equal(remainingSeconds(started, 61001), 240);
  const paused = toggleSession(started, 61001);
  assert.equal(paused.endsAt, null);
  assert.equal(remainingSeconds(paused, 999999), 240);
  const resumed = toggleSession(paused, 1000000);
  assert.equal(resumed.endsAt, 1240000);
  assert.equal(remainingSeconds(resumed, 1240001), 0);
  const finished = toggleSession(resumed, 1240001);
  assert.equal(finished.remaining, 0);
  assert.equal(toggleSession(finished, 2000000).endsAt, 2300000);
  // Moving the device clock backwards cannot exceed the selected duration.
  assert.equal(remainingSeconds(started, 0), 300);
  assert.equal(ready.endsAt, null);
});

test('notes and focus survive reload without changing existing app data; invalid storage is safe', () => {
  const data = new Map([['launchpad-links', 'preserved']]);
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key) => data.get(key) ?? null,
      setItem: (key, value) => data.set(key, value),
    },
  });
  try {
    const session = toggleSession(freshSession(15), 10000);
    assert.equal(saveTool(focusKey, JSON.stringify(session)), true);
    assert.deepEqual(readFocus(), session);
    assert.equal(remainingSeconds(readFocus(), 910001), 0);
    assert.equal(saveTool(scratchpadKey, 'A thought\nA next step'), true);
    assert.equal(readScratchpad(), 'A thought\nA next step');
    data.set(scratchpadKey, 'a'.repeat(scratchpadLimit + 10));
    assert.equal(readScratchpad().length, scratchpadLimit);
    assert.equal(data.get('launchpad-links'), 'preserved');
    for (const invalid of [
      null,
      false,
      {},
      [],
      { minutes: 7, remaining: 420, endsAt: null },
      { minutes: 5, remaining: -1, endsAt: null },
      { minutes: 5, remaining: 301, endsAt: null },
      { minutes: 5, remaining: 10.5, endsAt: null },
      { minutes: 5, remaining: 10, endsAt: 'later' },
      { minutes: 5, remaining: 10, endsAt: -1 },
    ]) {
      data.set(focusKey, JSON.stringify(invalid));
      assert.deepEqual(readFocus(), freshSession());
    }
    data.set(focusKey, '{broken');
    assert.deepEqual(readFocus(), freshSession());
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('Blocked');
      },
    });
    assert.deepEqual(readFocus(), freshSession());
    assert.equal(readScratchpad(), '');
    assert.equal(saveTool(scratchpadKey, 'note'), false);
    assert.equal(saveTool(focusKey, '{}'), false);
  } finally {
    delete globalThis.localStorage;
  }
});
