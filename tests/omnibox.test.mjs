import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveOmnibox } from '../src/lib/omnibox.ts';

test('address bar opens addresses and preserves paths, queries, and fragments', () => {
  assert.equal(
    resolveOmnibox(' example.com/news?q=hush#today '),
    'https://example.com/news?q=hush#today',
  );
  assert.equal(resolveOmnibox('http://example.com'), 'http://example.com/');
  assert.equal(
    resolveOmnibox('example.com:8443/page'),
    'https://example.com:8443/page',
  );
  assert.equal(
    resolveOmnibox('127.0.0.1:8080/page'),
    'https://127.0.0.1:8080/page',
  );
  assert.equal(
    resolveOmnibox('https://example.com:8443/page'),
    'https://example.com:8443/page',
  );
});

test('address bar encodes searches without sending requests while typing', () => {
  assert.equal(
    resolveOmnibox('calm places & good coffee'),
    'https://www.google.com/search?q=calm%20places%20%26%20good%20coffee',
  );
  assert.equal(resolveOmnibox('hush'), 'https://www.google.com/search?q=hush');
  assert.equal(
    resolveOmnibox('example.com tips'),
    'https://www.google.com/search?q=example.com%20tips',
  );
});

test('address bar rejects unsafe schemes, credentials, malformed URLs, and empty submissions', () => {
  for (const value of [
    '',
    '  ',
    'javascript:alert(1)',
    'data:text/html,test',
    'file:///tmp/test',
    'ftp://example.com',
    'https://',
    'https://user:password@example.com',
  ]) {
    assert.equal(resolveOmnibox(value), null, value);
  }
});
