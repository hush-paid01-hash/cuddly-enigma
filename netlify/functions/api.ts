import { bundledCatalog, catalogCategories } from '../../src/lib/catalog.ts';
import { discoverSites } from '../../src/lib/discovery.ts';

export default async function handler(request: Request): Promise<Response> {
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store',
  });
  const respond = (body: unknown, status = 200) =>
    new Response(request.method === 'HEAD' ? null : JSON.stringify(body), {
      status,
      headers,
    });
  if (request.method === 'OPTIONS')
    return new Response(null, { status: 204, headers });
  if (!['GET', 'HEAD'].includes(request.method)) {
    headers.set('Allow', 'GET, HEAD, OPTIONS');
    return respond({ error: 'Method not allowed' }, 405);
  }
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, '');
  if (path === '/api/v1/health')
    return respond({ status: 'ok', apiVersion: 1 });
  if (path === '/api/v1/catalog') {
    headers.set('Cache-Control', 'public, max-age=300');
    return respond(bundledCatalog);
  }
  if (path === '/api/v1/sites') {
    const category = url.searchParams.get('category') ?? 'All websites';
    const query = url.searchParams.get('q') ?? '';
    const trail = url.searchParams.get('trail') ?? '';
    if (
      (category !== 'All websites' &&
        !catalogCategories.some((item) => item === category)) ||
      (trail && !bundledCatalog.trails.some((item) => item.id === trail)) ||
      query.length > 200
    )
      return respond(
        { error: 'Invalid category, trail, or query (maximum 200 characters)' },
        400,
      );
    const sites = discoverSites(bundledCatalog.sites, category, query, trail);
    headers.set('Cache-Control', 'public, max-age=300');
    return respond({ sites, total: sites.length });
  }
  return respond({ error: 'Not found' }, 404);
}

export const config = { path: '/api/v1/*' };
