import assert from 'node:assert/strict';
import { test } from 'node:test';
import handler from '../netlify/functions/api.ts';
import { bundledCatalog, parseCatalog } from '../src/lib/catalog.ts';

const request = (path, method = 'GET') =>
  handler(new Request(`https://hushpaid.netlify.app${path}`, { method }));

test('API returns the same versioned catalog as the bundled app, with no personal data', async () => {
  const response = await request('/api/v1/catalog');
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /application\/json/);
  assert.equal(response.headers.get('access-control-allow-origin'), '*');
  assert.equal(response.headers.get('cache-control'), 'public, max-age=300');
  const catalog = await response.json();
  assert.deepEqual(catalog, bundledCatalog);
  assert.deepEqual(parseCatalog(catalog), bundledCatalog);
  assert.deepEqual(Object.keys(catalog).sort(), [
    'schemaVersion',
    'sites',
    'trails',
  ]);
  assert.ok(catalog.sites.every((site) => site.category !== 'My links'));
});

test('API search and ordered trails follow website discovery behavior', async () => {
  let result = await (
    await request('/api/v1/sites?q=CODING%20practice&category=Learn')
  ).json();
  assert.deepEqual(
    result.sites.map((site) => site.id),
    ['freecodecamp'],
  );
  assert.equal(result.total, 1);
  result = await (await request('/api/v1/sites?trail=research')).json();
  assert.deepEqual(
    result.sites.map((site) => site.id),
    [...bundledCatalog.trails[0].sites],
  );
  result = await (await request('/api/v1/sites?q=not-a-website')).json();
  assert.deepEqual(result, { sites: [], total: 0 });
});

test('API validates filters and consistently handles health, methods, CORS, HEAD, and missing routes', async () => {
  for (const path of [
    '?category=Unknown',
    '?category=My%20links',
    '?trail=missing',
    `?q=${'x'.repeat(201)}`,
  ]) {
    const response = await request(`/api/v1/sites${path}`);
    assert.equal(response.status, 400);
    assert.equal(response.headers.get('cache-control'), 'no-store');
  }
  assert.deepEqual(await (await request('/api/v1/health/')).json(), {
    status: 'ok',
    apiVersion: 1,
  });
  assert.equal((await request('/api/v1/missing')).status, 404);
  assert.equal((await request('/api/v2/catalog')).status, 404);
  const post = await request('/api/v1/catalog', 'POST');
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('allow'), 'GET, HEAD, OPTIONS');
  const options = await request('/api/v1/catalog', 'OPTIONS');
  assert.equal(options.status, 204);
  assert.equal(await options.text(), '');
  const head = await request('/api/v1/catalog', 'HEAD');
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
});
